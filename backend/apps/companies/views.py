from rest_framework import viewsets, mixins
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
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


@api_view(["GET"])
@permission_classes([AllowAny])
def main_company(request):
    """Returns the single main company for the website."""
    try:
        company = Company.objects.filter(
            is_main=True,
            is_active=True
        ).prefetch_related(
            "phones", "emails", "addresses",
            "domains", "qualities", "partners", "images"
        ).get()
        serializer = CompanySerializer(company, context={"request": request})
        return Response(serializer.data)
    except Company.DoesNotExist:
        return Response({"error": "No main company configured."}, status=404)
    except Company.MultipleObjectsReturned:
        # safety — if multiple marked as main, return the first one
        company = Company.objects.filter(is_main=True, is_active=True).prefetch_related(
            "phones", "emails", "addresses",
            "domains", "qualities", "partners", "images"
        ).first()
        serializer = CompanySerializer(company, context={"request": request})
        return Response(serializer.data)