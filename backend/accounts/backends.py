from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailOrPhoneBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        user = None
        try:
            if '@' in username: 
                user = User.objects.get(email=username)
            elif username.isdigit():  
                user = User.objects.get(phone=username)
            else:  
                user = User.objects.get(username=username)
                
            if user and user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None
