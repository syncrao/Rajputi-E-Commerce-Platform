from django.contrib import admin
from .models import Address, Order, OrderItem


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("full_name", "phone", "street", "city", "state", "is_default")
    list_filter = ("phone", "street", "city")
    search_fields = ("full_name", "phone", "city", "state", "postal_code")


class OrderItemInline(admin.TabularInline):  # Inline items inside Order
    model = OrderItem
    extra = 1
    readonly_fields = ("inventory_display", "quantity", "price")
    fields = ("inventory_display", "quantity", "price")

    def inventory_display(self, obj):
        if obj.inventory:
            return f"{obj.inventory.product.name} ({obj.inventory.size}, {obj.inventory.color})"
        return "N/A"
    inventory_display.short_description = "Product (Size, Color)"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "total_price", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "id")
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "inventory_product", "inventory_size", "inventory_color", "quantity", "price")
    list_filter = ("inventory__product", "inventory__size", "inventory__color")
    search_fields = ("inventory__product__name",)

    def inventory_product(self, obj):
        return obj.inventory.product.name if obj.inventory else "N/A"
    inventory_product.short_description = "Product"

    def inventory_size(self, obj):
        return obj.inventory.size if obj.inventory else "N/A"
    inventory_size.short_description = "Size"

    def inventory_color(self, obj):
        return obj.inventory.color if obj.inventory else "N/A"
    inventory_color.short_description = "Color"
