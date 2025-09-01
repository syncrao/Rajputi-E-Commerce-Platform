from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from rest_framework.routers import SimpleRouter
from django.urls import path, include
from .views import UserViewSet, RegisterView, GoogleLoginView, SendOTPView, VerifyOTPView, ResetPasswordView

router = SimpleRouter()
router.register('', UserViewSet, basename='user')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('google/', GoogleLoginView.as_view(), name='google_login'),
    path('send_otp/', SendOTPView.as_view(), name='send_otp'),
    path('verify_otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('reset_password/', ResetPasswordView.as_view(), name='reset_password' ),
    path('', include(router.urls)),
]


