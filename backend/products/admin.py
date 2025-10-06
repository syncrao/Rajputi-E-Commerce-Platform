from django.contrib import admin
from .models import Product, ProductImage, ProductRating, ProductInventory


# Inline for Product Images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ("id",)
    fields = ("image", "is_main")


# Inline for Product Ratings (read-only)
class ProductRatingInline(admin.TabularInline):
    model = ProductRating
    extra = 0
    readonly_fields = (
        "user",
        "rating",
        "review",
        "created_at",
    )


# Inline for Product Inventory (editable)
class ProductInventoryInline(admin.TabularInline):
    model = ProductInventory
    extra = 1
    fields = ("size", "color", "quantity")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "fabric",
        "price",
        "mrp",
        "created_at",
    )
    list_filter = ("category", "fabric")
    search_fields = ("name", "description")
    inlines = [ProductImageInline, ProductRatingInline, ProductInventoryInline]


@admin.register(ProductRating)
class ProductRatingAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "user",
        "rating",
        "created_at",
    )
    list_filter = ("product", "rating")
    search_fields = ("product__name", "user__username")


@admin.register(ProductInventory)
class ProductInventoryAdmin(admin.ModelAdmin):
    def product_id(self, obj):
        return obj.product.id
    
    list_display = ("product_id", "product", "size", "color", "quantity")
    list_filter = ("product", "size", "color")
    search_fields = ("product__name",)
