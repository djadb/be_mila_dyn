from django.db import models
from simple_history.models import HistoricalRecords
from django_ckeditor_5.fields import CKEditor5Field


class ProjectStatus(models.Model):
    status_en = models.CharField(max_length=50, unique=True)
    status_fr = models.CharField(max_length=50, unique=True)
    status_ar = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = "project_status"
        verbose_name_plural = "Project Statuses"

    def __str__(self):
        return self.status_en


class Project(models.Model):
    title_en       = models.CharField(max_length=50)
    title_fr       = models.CharField(max_length=50)
    title_ar       = models.CharField(max_length=50)
    description_en = CKEditor5Field(blank=True, null=True, config_name="default") 
    description_fr = CKEditor5Field(blank=True, null=True, config_name="default") 
    description_ar = CKEditor5Field(blank=True, null=True, config_name="default") 
    start_date     = models.DateTimeField(blank=True, null=True)
    estimated_date = models.DateTimeField(blank=True, null=True)
    end_date       = models.DateTimeField(blank=True, null=True)
    is_featured    = models.BooleanField(default=False)
    is_active      = models.BooleanField(default=True)

    status = models.ForeignKey(
        ProjectStatus,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="projects"
    )

    history = HistoricalRecords()

    class Meta:
        db_table = "project"

    def __str__(self):
        return self.title_en

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def hard_delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)