from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    ProductLastUpdatedView,
    inventory,
    ProductRatingListCreateView,
    ProductRatingDetailView,
    ProductRatingSummaryView,
)

urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
    path("<int:id>/", ProductDetailView.as_view(), name="product-detail"),
    path("last-updated/", ProductLastUpdatedView.as_view(), name="product-last-updated"),
    path("inventory/<int:product_id>/", inventory, name="inventory"),
    path("ratings/<int:product_id>/", ProductRatingListCreateView.as_view(), name="product-ratings"),
    path("rating/<int:pk>/", ProductRatingDetailView.as_view(), name="rating-detail"),
    path("ratings/summary/<int:product_id>/", ProductRatingSummaryView.as_view(), name="rating-summary"),
]
