from django.urls import path
from .views import MockPaymentView, PaymentListView, create_payment

urlpatterns = [
    path("mock/<int:order_id>/", MockPaymentView, name="mock-payment"),
    path("list/", PaymentListView.as_view(), name="payment-list"),
    path("create/", create_payment, name="create-payment"),
    # path("verify-payment/", verify_payment, name="verify-payment"),
]
