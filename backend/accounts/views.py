from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer, OTPVerifySerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from .utils import IsSelfOrAdmin, get_user_by_identifier
from google.oauth2 import id_token
from google.auth.transport import requests
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
from .models import OTP
import random

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {"message": "User registered successfully. Please verify your email via OTP."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        google_token = request.data.get("google_token")
        if not google_token:
            return Response({"error": "Google token required"}, status=status.HTTP_400_BAD_REQUEST)


        try:
            idinfo = id_token.verify_oauth2_token(google_token, requests.Request(), settings.GOOGLE_ID)
            email = idinfo.get("email")
            google_id = idinfo.get("sub")
            first_name  = idinfo.get("given_name", "")
            last_name = idinfo.get("family_name", "")

            user, created = User.objects.get_or_create(
                google_id=google_id,
                defaults={
                    "username": email.split("@")[0],
                    "email": email,
                    "first_name" : first_name,
                    "last_name" : last_name,
                    "is_email_verified": True,
                    "password": get_random_string(30)
                },
            )

            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data
            })

        except Exception as e:
            return Response({"error": "Invalid Google token", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer  
    parser_classes = [MultiPartParser, FormParser] 

    def get_permissions(self):
        if self.action == "list":
            return [permissions.IsAdminUser()]
        elif self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return [IsSelfOrAdmin()]   
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id) 
    
    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj) 
        return obj

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
        
    


class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier")
        if not identifier:
            return Response({"error": "Username, email or phone is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_user_by_identifier(identifier)
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        code = str(random.randint(100000, 999999))
        OTP.objects.create(user=user, code=code)

        print("DEBUG OTP:", code)

        if user.email:
            subject = "Your OTP Code"
            message = f"Hello {user.username},\n\nYour OTP code is: {code}\nIt will expire in 5 minutes."
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

        return Response({"message": "OTP sent successfully"})


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            otp = serializer.validated_data["otp"]

            otp.is_used = True
            otp.save()

            user.is_email_verified = True
            user.save()

            return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier")
        code = request.data.get("code")
        new_password = request.data.get("new_password")

        if not all([identifier, code, new_password]):
            return Response({"error": "Identifier, code and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_user_by_identifier(identifier)
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp = OTP.objects.filter(user=user, code=code, is_used=False).latest("created_at")
        except OTP.DoesNotExist:
            return Response({"error": "Invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save()

        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)