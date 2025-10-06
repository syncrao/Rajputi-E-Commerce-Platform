from rest_framework import serializers
from .models import Order, OrderItem, Address
from products.models import ProductInventory


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "full_name",
            "phone",
            "street",
            "city",
            "state",
            "postal_code",
            "country",
            "is_default",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="inventory.product.name", read_only=True)
    size = serializers.CharField(source="inventory.size", read_only=True)
    color = serializers.CharField(source="inventory.color", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "inventory", "product_name", "size", "color", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ["id", "address", "total_price", "status", "created_at", "items"]


class CreateOrderSerializer(serializers.Serializer):
    address_id = serializers.IntegerField(required=False)
    items = serializers.ListField(child=serializers.DictField())

    def validate(self, data):
        """Check stock before creating an order."""
        for item in data["items"]:
            inventory_id = item.get("inventory")
            quantity = item.get("quantity", 1)

            try:
                inventory = ProductInventory.objects.get(id=inventory_id)
            except ProductInventory.DoesNotExist:
                raise serializers.ValidationError(
                    f"Inventory item {inventory_id} does not exist."
                )

            if inventory.quantity < quantity:
                raise serializers.ValidationError(
                    f"Not enough stock for product {inventory.product.name} (size: {inventory.size}, color: {inventory.color}). Available: {inventory.quantity}"
                )

        return data
