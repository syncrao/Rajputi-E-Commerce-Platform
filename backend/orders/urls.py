from django.urls import path
from .views import OrderListView, CreateOrderView, AddressCreateView, AddressListView, AddressDetailView, OrderDetailView

urlpatterns = [
    path("", OrderListView.as_view(), name="order-list"),           
    path("create/", CreateOrderView.as_view(), name="order-create"),
    path("addresses/", AddressListView.as_view(), name="address-list"),
    path("addresses/add/", AddressCreateView.as_view(), name="address-add"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(), name="address-detail"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
]
