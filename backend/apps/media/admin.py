from django.contrib import admin
from django.utils.html import format_html
from simple_history.admin import SimpleHistoryAdmin
from .models import Image


class ProjectImageInline(admin.TabularInline):
    model    = Image
    extra    = 1
    fields   = ("image_preview", "image", "title_en", "title_fr", "title_ar", "position", "is_active")
    readonly_fields = ("image_preview",)
    ordering = ("position",)
    verbose_name        = "Project Image"
    verbose_name_plural = "Project Images"

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:60px; border-radius:4px;"/>', obj.image.url)
        return "No image"
    image_preview.short_description = "Preview"


class CompanyImageInline(admin.TabularInline):
    model    = Image
    extra    = 1
    fields   = ("image_preview", "image", "title_en", "title_fr", "title_ar", "position", "is_active")
    readonly_fields = ("image_preview",)
    ordering = ("position",)
    verbose_name        = "Company Image"
    verbose_name_plural = "Company Images"

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:60px; border-radius:4px;"/>', obj.image.url)
        return "No image"
    image_preview.short_description = "Preview"


@admin.register(Image)
class ImageAdmin(SimpleHistoryAdmin):
    list_display  = ("image_preview", "title_en", "title_fr", "title_ar", "project", "company", "position", "is_active")
    list_filter   = ("is_active",)
    search_fields = ("title_en", "title_fr", "title_ar")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:60px; border-radius:4px;"/>', obj.image.url)
        return "No image"
    image_preview.short_description = "Preview"