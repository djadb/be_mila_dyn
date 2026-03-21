from django.db import models
from simple_history.models import HistoricalRecords


class Image(models.Model):
    title_en  = models.CharField(max_length=50, blank=True, null=True)
    title_fr  = models.CharField(max_length=50, blank=True, null=True)
    title_ar  = models.CharField(max_length=50, blank=True, null=True)
    image     = models.ImageField(upload_to="uploads/%Y/%m/")
    position  = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    hidden    = models.BooleanField(default=False)

    project = models.ForeignKey(
        "projects.Project",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="images"
    )
    company = models.ForeignKey(
        "companies.Company",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="images"
    )

    history = HistoricalRecords()

    class Meta:
        db_table = "image"
        ordering = ["position"]

    def __str__(self):
        return self.title_en or f"Image {self.id}"

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def hard_delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)