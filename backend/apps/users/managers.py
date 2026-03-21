from django.contrib.auth.models import UserManager


class ActiveUserManager(UserManager):
    """Returns only active (non-soft-deleted) users by default."""
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class AllUserManager(UserManager):
    """Returns all users including soft-deleted ones."""
    def get_queryset(self):
        return super().get_queryset()