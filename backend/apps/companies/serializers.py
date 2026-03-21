from rest_framework import serializers
from apps.media.serializers import ImageSerializer
from .models import Company, CompanyPhone, CompanyEmail, CompanyAddress, DomainActivity, CompanyQuality


class DomainActivitySerializer(serializers.ModelSerializer):
    icon = ImageSerializer(read_only=True)

    class Meta:
        model  = DomainActivity
        fields = ["id", "name_en", "name_fr", "name_ar", "icon"]


class CompanyQualitySerializer(serializers.ModelSerializer):
    icon = ImageSerializer(read_only=True)

    class Meta:
        model  = CompanyQuality
        fields = ["id", "name_en", "name_fr", "name_ar", "icon"]


class CompanyPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CompanyPhone
        fields = [
            "id", "phone_number",
            "phone_type_en", "phone_type_fr", "phone_type_ar",
            "is_primary"
        ]


class CompanyEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CompanyEmail
        fields = [
            "id", "email",
            "email_type_en", "email_type_fr", "email_type_ar",
            "is_primary"
        ]

class CompanyAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CompanyAddress
        fields = [
            "id",
            "address_line1_en", "address_line1_fr", "address_line1_ar",
            "address_line2_en", "address_line2_fr", "address_line2_ar",
            "city_en", "city_fr", "city_ar",
            "state_en", "state_fr", "state_ar",
            "country_en", "country_fr", "country_ar",
            "postcode",
            "address_type_en", "address_type_fr", "address_type_ar",
            "is_primary"
        ]


class CompanySerializer(serializers.ModelSerializer):
    logo      = ImageSerializer(read_only=True)   # ← nested image object
    phones    = CompanyPhoneSerializer(many=True, read_only=True)
    emails    = CompanyEmailSerializer(many=True, read_only=True)
    addresses = CompanyAddressSerializer(many=True, read_only=True)
    domains   = DomainActivitySerializer(many=True, read_only=True)
    qualities = CompanyQualitySerializer(many=True, read_only=True)
    images    = ImageSerializer(many=True, read_only=True)
    partners  = serializers.SerializerMethodField()

    class Meta:
        model  = Company
        fields = [
            "id",
            "name_en", "name_fr", "name_ar",
            "description_en", "description_fr", "description_ar",
            "logo", "website",
            "domains", "qualities", "partners",
            "phones", "emails", "addresses", "images"
        ]

    def get_partners(self, obj):
        return [
            {"id": p.id, "name_en": p.name_en, "name_fr": p.name_fr, "name_ar": p.name_ar}
            for p in obj.partners.filter(is_active=True)
        ]