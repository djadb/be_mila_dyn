from rest_framework import serializers
from apps.media.serializers import ImageSerializer
from .models import Project, ProjectStatus


class ProjectStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProjectStatus
        fields = ["id", "status_en", "status_fr", "status_ar"]


class ProjectSerializer(serializers.ModelSerializer):
    status = ProjectStatusSerializer(read_only=True)
    images = ImageSerializer(many=True, read_only=True)  # uses related_name="images"

    class Meta:
        model  = Project
        fields = [
            "id",
            "title_en", "title_fr", "title_ar",
            "description_en", "description_fr", "description_ar",
            "start_date", "estimated_date", "end_date",
            "is_featured", "status", "images"
        ]