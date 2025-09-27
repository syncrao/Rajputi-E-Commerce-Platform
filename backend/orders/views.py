from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import Order, OrderItem, Address
from .serializers import OrderSerializer, CreateOrderSerializer, AddressSerializer
from products.models import ProductInventory


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")


class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        address_id = serializer.validated_data.get("address_id")
        items_data = serializer.validated_data["items"]

        # Fetch Address
        if address_id:
            try:
                address = Address.objects.get(id=address_id, user=request.user)
            except Address.DoesNotExist:
                return Response({"error": "Invalid address"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                address = Address.objects.get(user=request.user, is_default=True)
            except Address.DoesNotExist:
                return Response({"error": "No default address found"}, status=status.HTTP_400_BAD_REQUEST)

        # Create Order
        order = Order.objects.create(user=request.user, address=address, total_price=0, status="pending")
        total_price = 0

        for item in items_data:
            inventory_id = item.get("inventory")
            quantity = item.get("quantity", 1)

            try:
                inventory = ProductInventory.objects.get(id=inventory_id)
            except ProductInventory.DoesNotExist:
                return Response({"error": f"Inventory item {inventory_id} does not exist"}, status=400)

            if inventory.quantity < quantity:
                return Response(
                    {"error": f"Not enough stock for {inventory.product.name} (size: {inventory.size}, color: {inventory.color}). Available: {inventory.quantity}"},
                    status=400
                )

            price = inventory.product.price * quantity
            total_price += price

            OrderItem.objects.create(
                order=order,
                inventory=inventory,
                quantity=quantity,
                price=price,
            )

            # Reduce stock
            inventory.quantity -= quantity
            inventory.save()

        order.total_price = total_price
        order.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class AddressListView(generics.ListAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by("-id")


class AddressCreateView(generics.CreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.validated_data.get("is_default"):
            Address.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save(user=self.request.user)
