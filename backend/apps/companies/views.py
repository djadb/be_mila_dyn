from rest_framework import viewsets, mixins
from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet):
    serializer_class = CompanySerializer

    def get_queryset(self):
        return Company.objects.filter(is_active=True).prefetch_related(
            "phones", "emails", "addresses",
            "domains", "qualities", "partners", "images"
        )

    def get_serializer_context(self):
        return {"request": self.request}