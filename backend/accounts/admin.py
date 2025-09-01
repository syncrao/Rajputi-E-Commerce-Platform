from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "phone", "is_email_verified", "is_phone_verified")
    search_fields = ("username", "email", "phone")

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email", "phone")}),
        ("Profile", {"fields": ("google_pic", "profile_pic", "google_id")}),
        ("Verification", {"fields": ("is_email_verified", "is_phone_verified")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "phone", "password1", "password2"),
        }),
    )

admin.site.site_header = "My Admin Panel"
admin.site.site_title = "My Admin Portal"
admin.site.index_title = "Welcome to the Dashboard"