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


from phonepe.sdk.pg.payments.v2.standard_checkout_client import StandardCheckoutClient
from phonepe.sdk.pg.payments.v2.models.request.standard_checkout_pay_request import StandardCheckoutPayRequest
from phonepe.sdk.pg.common.models.request.meta_info import MetaInfo
from phonepe.sdk.pg.env import Env
from uuid import uuid4

load_dotenv()
CLIENT_ID = os.getenv("PHONEPE_CLIENT_ID", "").strip().replace('"', '')
CLIENT_VERSION = os.getenv("PHONEPE_CLIENT_VERSION", "1").strip()
SALT_KEY = os.getenv("PHONEPE_SALT_KEY", "TEST").strip()
SALT_INDEX = os.getenv("PHONEPE_SALT_INDEX", "1").strip()

client = StandardCheckoutClient.get_instance(client_id=CLIENT_ID, client_secret=SALT_KEY, client_version=CLIENT_VERSION, env=Env.SANDBOX, should_publish_events=False)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def MockPaymentView(request, order_id):
    """
    Simulates a successful payment without calling PhonePe.
    """
    try:
        order = Order.objects.select_related('address').prefetch_related('items__inventory__product').get(
            id=order_id, user=request.user
        )
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    if order.status != "pending":
        return Response({"error": "Order already paid or cancelled"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Validate stock
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

    # ✅ Deduct stock
    for item in order.items.all():
        inventory = item.inventory
        inventory.quantity -= item.quantity
        inventory.save()

    # ✅ Mock transaction
    transaction_id = f"TXN{order.id}{order.user.id}"
    ui_redirect_url = "https://raoshop.vercel.app/"
    amount = int(order.total_price * 100)

    

    try:
        standard_pay_request = StandardCheckoutPayRequest.build_request(
            merchant_order_id=transaction_id,
            amount=amount,
            redirect_url=ui_redirect_url
        )

        standard_pay_response = client.pay(standard_pay_request)

        payment = Payment.objects.create(
        order=order,
        amount=order.total_price,
        status="pending",
        transaction_id=transaction_id,
        )

        return Response({
            "success": True,
            "merchant_order_id": transaction_id,
            "checkout_url": standard_pay_response.redirect_url,
            "payment": PaymentSerializer(payment).data,
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
    ui_redirect_url = "https://raoshop.vercel.app/"
    amount = 10000  

    try:
        standard_pay_request = StandardCheckoutPayRequest.build_request(
            merchant_order_id=unique_order_id,
            amount=amount,
            redirect_url=ui_redirect_url
        )

        standard_pay_response = client.pay(standard_pay_request)

        return JsonResponse({
            "success": True,
            "merchant_order_id": unique_order_id,
            "checkout_url": standard_pay_response.redirect_url
        })

    except Exception as e:
        print("PhonePe Error:", str(e))
        return JsonResponse({"success": False, "error": str(e)}, status=500)


# @csrf_exempt
# def verify_payment(request):
#     """
#     Verifies the payment status using PhonePe API.
#     """
#     transaction_id = request.GET.get("transactionId", "TEST_TXN")

#     url = f"{BASE_URL}/status/{CLIENT_ID}/{transaction_id}"
#     checksum_raw = f"/pg/{CLIENT_VERSION}/status/{CLIENT_ID}/{transaction_id}" + SALT_KEY
#     checksum = hashlib.sha256(checksum_raw.encode()).hexdigest() + "###" + SALT_INDEX

#     headers = {
#         "Content-Type": "application/json",
#         "X-VERIFY": checksum,
#         "X-MERCHANT-ID": CLIENT_ID
#     }

#     res = requests.get(url, headers=headers)
#     data = res.json()
#     status_text = "success" if data.get("success") else "failed"
#     return JsonResponse({"status": status_text, "data": data})
