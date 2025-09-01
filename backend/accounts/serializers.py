from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import OTP


User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)  
        user.save()
        return user


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        try:
            otp = user.otps.filter(code=data["code"], is_used=False).latest("created_at")
        except OTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP")

        if otp.is_expired():
            raise serializers.ValidationError("OTP expired")

        data["user"] = user
        data["otp"] = otp
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "first_name", "last_name", "is_email_verified", "is_phone_verified"]
        read_only_fields = ["is_email_verified", "is_phone_verified", "google_id"]
