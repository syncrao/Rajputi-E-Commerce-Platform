from django.urls import path
from .views import OrderListView, CreateOrderView, AddressCreateView, AddressListView

urlpatterns = [
    path("", OrderListView.as_view(), name="order-list"),           
    path("create/", CreateOrderView.as_view(), name="order-create"),
    path("addresses/", AddressListView.as_view(), name="address-list"),
    path("addresses/add/", AddressCreateView.as_view(), name="address-add"),
]
