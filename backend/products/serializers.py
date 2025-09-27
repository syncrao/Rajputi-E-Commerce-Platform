from rest_framework import serializers
from .models import Product, ProductImage


# 🔹 Product Image Serializer
class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_main"]


# 🔹 Lightweight Product List Serializer with Images
class ProductListSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = serializers.CharField(source="get_category_display")
    fabric = serializers.CharField(source="get_fabric_display")
    product_type = serializers.CharField(source="get_product_type_display")

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "product_type",
            "price",
            "mrp",
            "category",
            "fabric",
            "images",
        ]
