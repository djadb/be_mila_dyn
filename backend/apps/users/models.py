from django.contrib.auth.models import AbstractUser
from django.db import models
from simple_history.models import HistoricalRecords
from .managers import ActiveUserManager, AllUserManager


class User(AbstractUser):
    # AbstractUser already gives you:
    # username, email, first_name, last_name, password,
    # is_active, date_joined, last_login, groups, user_permissions

    history  = HistoricalRecords()  # replaces all your audit/update_user fields
    objects  = ActiveUserManager()  # default: active users only
    all_objects = AllUserManager()  # when you need soft-deleted users too

    
    def delete(self, using=None, keep_parents=False):
        """Soft delete — deactivates instead of removing the row."""
        self.is_active = False
        self.save()

    def hard_delete(self, using=None, keep_parents=False):
        """Permanent delete — use only when truly needed."""
        super().delete(using=using, keep_parents=keep_parents)

    def restore(self):
        """Undo a soft delete."""
        self.is_active = True
        self.save()