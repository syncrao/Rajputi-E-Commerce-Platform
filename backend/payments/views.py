from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from django.db import transaction
from .models import Payment
from orders.models import Order
from .serializers import PaymentSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from dotenv import load_dotenv
import requests
from uuid import uuid4

load_dotenv()
CLIENT_ID = os.getenv("PHONEPE_CLIENT_ID", "").strip().replace('"', '')
CLIENT_VERSION = os.getenv("PHONEPE_CLIENT_VERSION", "1").strip()
SALT_KEY = os.getenv("PHONEPE_SALT_KEY", "TEST").strip()
SALT_INDEX = os.getenv("PHONEPE_SALT_INDEX", "1").strip()

url_token = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token"
url_pay = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay"

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def MockPaymentView(request, order_id):
   
    try:
        order = Order.objects.select_related('address').prefetch_related('items__inventory__product').get(
            id=order_id, user=request.user
        )
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    if order.status != "pending":
        return Response({"error": "Order already paid or cancelled"}, status=status.HTTP_400_BAD_REQUEST)

 
    insufficient_items = []
    for item in order.items.all():
        inventory = item.inventory
        if not inventory or inventory.quantity < item.quantity:
            insufficient_items.append(
                f"{inventory.product.name if inventory else 'Unknown Product'} "
                f"(Available: {inventory.quantity if inventory else 0})"
            )

    if insufficient_items:
        return Response(
            {"error": "Not enough stock for the following items", "items": insufficient_items},
            status=status.HTTP_400_BAD_REQUEST
        )


    for item in order.items.all():
        inventory = item.inventory
        inventory.quantity -= item.quantity
        inventory.save()


    transaction_id = f"TXN{order.id}{order.user.id}"
    ui_redirect_url = "https://raoshop.vercel.app/"
    amount = int(order.total_price * 100)

    

    try:
        payload = {
        "client_version": 1,
        "grant_type": "client_credentials",
        "client_id": "TEST-M22UXK3NSWUKO_25101",
        "client_secret": "MjRiZDQzYWYtMGUwYy00MmUwLWE5NDktM2FiZTlhZDA3ZDQ3"
        }

        headers = {
        "Content-Type": "application/x-www-form-urlencoded"
        }

        response = requests.post(url_token, data=payload, headers=headers)

        data = response.json()
        print(data.get("access_token"))


        payload = {
        "amount": 1000,
        "expireAfter": 1200,
        "metaInfo": {
            "udf1": "additional-information-1",
            "udf2": "additional-information-2",
            "udf3": "additional-information-3",
            "udf4": "additional-information-4",
            "udf5": "additional-information-5"
        },
        "paymentFlow": {
            "type": "PG_CHECKOUT",
            "message": "Payment message used for collect requests",
            "merchantUrls": {
            "redirectUrl": ui_redirect_url
            }
        },
        "merchantOrderId": transaction_id
        }

        headers = {
        "Content-Type": "application/json",
        "Authorization": f"O-Bearer {data.get("access_token")}"
        }

        response = requests.post(url_pay, json=payload, headers=headers)
        data = response.json()
        print(data)

        payment = Payment.objects.create(
        order=order,
        amount=order.total_price,
        status="pending",
        transaction_id=transaction_id,
        )

        return Response({
            "success": True,
            "merchant_order_id": transaction_id,
            "checkout_url": data.get('redirectUrl'),
            "payment": PaymentSerializer(payment).data
        })

    except Exception as e:
        print("PhonePe Error:", str(e))
        return Response({"success": False, "error": str(e)}, status=500)


class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user).order_by("-created_at")



@csrf_exempt
def create_payment(request):
    unique_order_id = str(uuid4())
    return JsonResponse({"success": False}, status=500)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def verify_payment(request, order_id):
    
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        payment = Payment.objects.get(order=order)
    except Payment.DoesNotExist:
        return Response({"error": "Payment record not found"}, status=status.HTTP_404_NOT_FOUND)

    # Make sure we have a transaction_id
    if not payment.transaction_id:
        return Response({"error": "No transaction ID found"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get access token again
        token_payload = {
            "client_version": 1,
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": os.getenv("PHONEPE_CLIENT_SECRET", "").strip(),
        }

        token_headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }

        token_response = requests.post(url_token, data=token_payload, headers=token_headers)
        token_data = token_response.json()

        access_token = token_data.get("access_token")
        if not access_token:
            return Response({"error": "Failed to get access token", "details": token_data}, status=500)

        # Verify payment from PhonePe
        verify_url = f"https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/status/{payment.transaction_id}"

        headers = {
            "Authorization": f"O-Bearer {access_token}",
            "Content-Type": "application/json"
        }

        response = requests.get(verify_url, headers=headers)
        data = response.json()

        print("Verification Response:", data)

        # Example success condition: depends on PhonePe API
        # Usually, you'll get something like data["data"]["state"] == "COMPLETED"
        payment_state = data.get("data", {}).get("state")

        if payment_state == "COMPLETED":
            payment.status = "success"
            payment.save()

            order.status = "paid"
            order.save()

            return Response({
                "success": True,
                "message": "Payment verified successfully",
                "order_status": order.status,
                "payment_status": payment.status
            })

        else:
            payment.status = "failed"
            payment.save()

            order.status = "payment_failed"
            order.save()

            return Response({
                "success": False,
                "message": "Payment failed or not completed",
                "order_status": order.status,
                "payment_status": payment.status
            })

    except Exception as e:
        print("Verification Error:", str(e))
        return Response({"error": str(e)}, status=500)

