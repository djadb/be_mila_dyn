from django.contrib import admin
from django.utils.html import format_html
from simple_history.admin import SimpleHistoryAdmin
from apps.media.admin import CompanyImageInline
from .models import (
    Company, CompanyPhone, CompanyEmail,
    CompanyAddress, DomainActivity, CompanyQuality
)


class CompanyPhoneInline(admin.TabularInline):
    model  = CompanyPhone
    extra  = 1
    fields = (
        "phone_number",
        "phone_type_en", "phone_type_fr", "phone_type_ar",
        "is_primary", "is_active"
    )


class CompanyEmailInline(admin.TabularInline):
    model  = CompanyEmail
    extra  = 1
    fields = (
        "email",
        "email_type_en", "email_type_fr", "email_type_ar",
        "is_primary", "is_active"
    )


class CompanyAddressInline(admin.StackedInline):
    model  = CompanyAddress
    extra  = 1
    fields = (
        "address_line1_en", "address_line1_fr", "address_line1_ar",
        "address_line2_en", "address_line2_fr", "address_line2_ar",
        "city_en", "city_fr", "city_ar",
        "state_en", "state_fr", "state_ar",
        "country_en", "country_fr", "country_ar",
        "postcode",
        "address_type_en", "address_type_fr", "address_type_ar",
        "is_primary", "is_active"
    )

@admin.register(DomainActivity)
class DomainActivityAdmin(SimpleHistoryAdmin):
    list_display        = ("name_en", "name_fr", "name_ar")
    search_fields       = ("name_en", "name_fr", "name_ar")
    autocomplete_fields = ("icon",)
    readonly_fields     = ("icon_preview",)

    fieldsets = (
        ("English", {
            "fields": ("name_en", "description_en")
        }),
        ("French", {
            "fields": ("name_fr", "description_fr")
        }),
        ("Arabic", {
            "fields": ("name_ar", "description_ar")
        }),
        ("Icon", {
            "fields": ("icon_preview", "icon")
        }),
    )

    def icon_preview(self, obj):
        if obj.icon and obj.icon.image:
            return format_html(
                '<img src="{}" style="height:40px; border-radius:4px;"/>',
                obj.icon.image.url
            )
        return "No icon"
    icon_preview.short_description = "Icon Preview"


@admin.register(CompanyQuality)
class CompanyQualityAdmin(SimpleHistoryAdmin):
    list_display        = ("icon_preview", "name_en", "name_fr", "name_ar")
    search_fields       = ("name_en", "name_fr", "name_ar")
    autocomplete_fields = ("icon",)
    readonly_fields     = ("icon_preview",)

    def icon_preview(self, obj):
        if obj.icon and obj.icon.image:
            return format_html('<img src="{}" style="height:40px; border-radius:4px;"/>', obj.icon.image.url)
        return "No icon"
    icon_preview.short_description = "Icon"


@admin.register(Company)
class CompanyAdmin(SimpleHistoryAdmin):
    list_display      = ("logo_preview", "name_en", "is_main", "website", "is_active")
    list_filter       = ("is_active", "is_main", "domains", "qualities")
    list_editable     = ("is_main",)
    search_fields       = ("name_en", "name_fr", "name_ar")
    filter_horizontal   = ("domains", "qualities", "partners")
    autocomplete_fields = ("logo",)
    readonly_fields     = ("logo_preview",)
    inlines             = [
        CompanyPhoneInline,
        CompanyEmailInline,
        CompanyAddressInline,
        CompanyImageInline,
    ]

    fieldsets = (
        ("English", {
            "fields": ("name_en", "description_en")
        }),
        ("French", {
            "fields": ("name_fr", "description_fr")
        }),
        ("Arabic", {
            "fields": ("name_ar", "description_ar")
        }),
        ("Details", {
            "fields": ("logo_preview", "logo", "website", "is_active","is_main")
        }),
        ("Relations", {
            "fields": ("domains", "qualities", "partners")
        }),
    )

    def logo_preview(self, obj):
        if obj.logo and obj.logo.image:
            return format_html('<img src="{}" style="height:60px; border-radius:4px;"/>', obj.logo.image.url)
        return "No logo"
    logo_preview.short_description = "Logo"

    def get_queryset(self, request):
        return Company.objects.all()

@admin.register(CompanyPhone)
class CompanyPhoneAdmin(SimpleHistoryAdmin):
    list_display = ("phone_number", "phone_type_en", "is_primary", "company", "is_active")
    list_filter  = ("is_active", "phone_type_en")


@admin.register(CompanyEmail)
class CompanyEmailAdmin(SimpleHistoryAdmin):
    list_display = ("email", "email_type_en", "is_primary", "company", "is_active")
    list_filter  = ("is_active", "email_type_en")


@admin.register(CompanyAddress)
class CompanyAddressAdmin(SimpleHistoryAdmin):
    list_display = ("address_line1_en", "city_en", "country_en", "is_primary", "company", "is_active")
    list_filter  = ("is_active", "country_en")