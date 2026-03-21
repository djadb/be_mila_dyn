from rest_framework import serializers
from .models import Image


class ImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = Image
        fields = ["id", "title_en", "title_fr", "title_ar", "image_url", "position"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None