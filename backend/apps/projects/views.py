from rest_framework import viewsets, mixins
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.filter(is_active=True).prefetch_related("images")
        featured = self.request.query_params.get("featured")
        if featured == "true":
            queryset = queryset.filter(is_featured=True)
        return queryset

    def get_serializer_context(self):
        return {"request": self.request}