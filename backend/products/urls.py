from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    ProductLastUpdatedView,
    inventory,
)

urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
    path("<int:id>/", ProductDetailView.as_view(), name="product-detail"),
    path("last-updated/", ProductLastUpdatedView.as_view(), name="product-last-updated"),
    path("inventory/<int:product_id>/", inventory, name="inventory")
]
