from django.urls import path
from .views import MockPaymentView, PaymentListView

urlpatterns = [
    path("", PaymentListView.as_view(), name="payment-list"),            
    path("pay/<int:order_id>/", MockPaymentView, name="payment-pay")
]
