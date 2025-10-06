from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from django.db import transaction
from .models import Payment
from orders.models import Order, OrderItem
from products.models import ProductInventory
from .serializers import PaymentSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def MockPaymentView(request, order_id):
    """
    Mock payment endpoint:
    - Checks order exists and is pending
    - Validates stock for all items
    - Deducts stock
    - Creates Payment entry
    - Updates order status to 'paid'
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

    # ✅ Mock payment transaction
    transaction_id = f"TXN{order.id}{order.user.id}123"
    payment = Payment.objects.create(
        order=order,
        amount=order.total_price,
        status="success",
        transaction_id=transaction_id,
    )

    # ✅ Update order status
    order.status = "paid"
    order.save()

    return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)



# 🔹 Payment List Class-Based View
class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only payments related to orders of the logged-in user
        return Payment.objects.filter(order__user=self.request.user).order_by("-created_at")
