from django.contrib import admin
from django.utils.html import format_html, mark_safe
from simple_history.admin import SimpleHistoryAdmin
from apps.media.admin import ProjectImageInline
from .models import Project, ProjectStatus


@admin.register(Project)
class ProjectAdmin(SimpleHistoryAdmin):
    list_display    = ("title_en", "status", "is_featured", "start_date", "end_date", "is_active")
    list_filter     = ("is_active", "is_featured", "status")
    list_editable   = ("is_featured",)
    search_fields   = ("title_en", "title_fr", "title_ar")
    readonly_fields = ("images_preview",)
    inlines         = [ProjectImageInline]

    fieldsets = (
        ("English", {
            "fields": ("title_en", "description_en")
        }),
        ("French", {
            "fields": ("title_fr", "description_fr")
        }),
        ("Arabic", {
            "fields": ("title_ar", "description_ar")
        }),
        ("Details", {
            "fields": ("status", "start_date", "estimated_date", "end_date", "is_featured", "is_active")
        }),
        ("Images", {
            "fields": ("images_preview",)
        }),
    )

    def images_preview(self, obj):
        images = obj.images.filter(is_active=True).order_by("position")
        if not images.exists():
            return "No images yet"
        parts = []
        for img in images:
            if img.image:
                parts.append(format_html(
                    '<div style="display:inline-block; margin:5px; text-align:center;">'
                    '<img src="{}" style="height:100px; border-radius:4px; display:block;"/>'
                    '<small style="color:#666;">Position {}</small>'
                    '</div>',
                    img.image.url,
                    img.position
                ))
        return mark_safe("".join(parts)) if parts else "No images yet"  # ← fix here
    images_preview.short_description = "Current Images"

    def get_queryset(self, request):
        return Project.objects.all()


@admin.register(ProjectStatus)
class ProjectStatusAdmin(admin.ModelAdmin):
    list_display = ("status_en", "status_fr", "status_ar")