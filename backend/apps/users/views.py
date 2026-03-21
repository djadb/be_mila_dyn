from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset           = User.objects.all()       # active only via manager
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    def perform_destroy(self, instance):
        instance.delete()                         # soft delete

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        """Reactivate a soft-deleted user."""
        user = User.all_objects.get(pk=pk)
        user.restore()
        return Response({"status": "user restored"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def history(self, request, pk=None):
        """Return the full audit trail for a user."""
        user = User.all_objects.get(pk=pk)
        records = user.history.all().values(
            "history_date", "history_user", "history_type",
            "username", "email", "first_name", "last_name", "is_active"
        )
        return Response(list(records))