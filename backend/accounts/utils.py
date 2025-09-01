from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()

class IsSelfOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user
    
def get_user_by_identifier(identifier: str):

    try:
        if "@" in identifier:
            return User.objects.get(email=identifier)
        elif identifier.isdigit():
            return User.objects.get(phone=identifier)
        return User.objects.get(username=identifier)
    except User.DoesNotExist:
        return None
