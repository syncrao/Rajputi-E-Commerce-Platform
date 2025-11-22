from django.urls import path
from .views import MockPaymentView, PaymentListView, create_payment, verify_payment

urlpatterns = [
    path("mock/<int:order_id>/", MockPaymentView, name="mock-payment"),
    path('verify/<int:order_id>/', verify_payment, name='verify-payment'),
    path("list/", PaymentListView.as_view(), name="payment-list"),
    path("create/", create_payment, name="create-payment"),
]
