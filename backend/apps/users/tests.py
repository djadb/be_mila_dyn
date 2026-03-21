from django.test import TestCase
from .models import User


class SoftDeleteTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="pass", email="t@t.com"
        )

    def test_soft_delete_hides_user(self):
        self.user.delete()
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())

    def test_soft_deleted_user_still_in_db(self):
        self.user.delete()
        self.assertTrue(User.all_objects.filter(pk=self.user.pk).exists())

    def test_restore(self):
        self.user.delete()
        self.user.restore()
        self.assertTrue(User.objects.filter(pk=self.user.pk).exists())

    def test_history_tracks_creation(self):
        self.assertEqual(self.user.history.count(), 1)
        self.assertEqual(self.user.history.first().history_type, "+")

    def test_history_tracks_soft_delete(self):
        self.user.delete()
        # creation (+) and update (~) for is_active=False
        self.assertEqual(self.user.history.count(), 2)