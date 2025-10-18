from rest_framework import serializers
from .models import Product, ProductImage, ProductRating


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_main"]


class ProductListSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = serializers.CharField(source="get_category_display")
    fabric = serializers.CharField(source="get_fabric_display")

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "mrp",
            "category",
            "fabric",
            "images",
        ]


class ProductRatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ProductRating
        fields = ["id", "user", "rating", "review", "created_at"]
        read_only_fields = ["id", "user", "created_at"]