from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from simple_history.admin import SimpleHistoryAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin, SimpleHistoryAdmin):
    list_display  = ("username", "email", "first_name", "last_name", "is_active")
    list_filter   = ("is_active", "groups")
    search_fields = ("username", "email", "first_name", "last_name")

    # Show soft-deleted users in admin too
    def get_queryset(self, request):
        return User.all_objects.all()