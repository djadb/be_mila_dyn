from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, main_company
from django.urls import path

router = DefaultRouter()
router.register(r"companies", CompanyViewSet, basename="company")

urlpatterns = router.urls + [
    path("company/main/", main_company, name="main-company"),  # ← dedicated endpoint
]