from django.db import models
from simple_history.models import HistoricalRecords
from apps.media.models import Image
from django_ckeditor_5.fields import CKEditor5Field


class DomainActivity(models.Model):
    name_en        = models.CharField(max_length=50)
    name_fr        = models.CharField(max_length=50, blank=True, null=True)
    name_ar        = models.CharField(max_length=50, blank=True, null=True)
    icon    = models.ForeignKey(
        Image,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="domain_icons"
    )

    history = HistoricalRecords()

    class Meta:
        db_table = "domain_activity"
        verbose_name_plural = "Domains of Activity"

    def __str__(self):
        return self.name_en


class CompanyQuality(models.Model):
    name_en        = models.CharField(max_length=50)
    name_fr        = models.CharField(max_length=50, blank=True, null=True)
    name_ar        = models.CharField(max_length=50, blank=True, null=True)
    icon    = models.ForeignKey(
        Image,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="quality_icons"
    )

    history = HistoricalRecords()

    class Meta:
        db_table = "company_quality"
        verbose_name_plural = "Company Qualities"

    def __str__(self):
        return self.name_en


class Company(models.Model):
    name_en        = models.TextField()
    name_fr        = models.TextField(blank=True, null=True)
    name_ar        = models.TextField(blank=True, null=True)
    description_en = CKEditor5Field(blank=True, null=True, config_name="default")
    description_fr = CKEditor5Field(blank=True, null=True, config_name="default")
    description_ar = CKEditor5Field(blank=True, null=True, config_name="default")
    logo           = models.ForeignKey(         
        Image,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="company_logos"
    )
    website        = models.TextField(blank=True, null=True)
    is_active      = models.BooleanField(default=True)

    domains    = models.ManyToManyField(
        DomainActivity,
        blank=True,
        related_name="companies"
    )
    qualities  = models.ManyToManyField(
        CompanyQuality,
        blank=True,
        related_name="companies"
    )
    partners   = models.ManyToManyField(
        "self",
        blank=True,
        symmetrical=True,
        related_name="partnered_with"
    )

    history = HistoricalRecords()

    class Meta:
        db_table = "company"
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.name_en

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def hard_delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)


class CompanyPhone(models.Model):
    PHONE_TYPES = [
        ("mobile", "Mobile"),
        ("landline", "Landline"),
        ("fax", "Fax"),
    ]

    company        = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="phones"
    )
    phone_number   = models.CharField(max_length=50)
    phone_type_en  = models.CharField(max_length=50, blank=True, null=True)
    phone_type_fr  = models.CharField(max_length=50, blank=True, null=True)
    phone_type_ar  = models.CharField(max_length=50, blank=True, null=True)
    is_primary     = models.BooleanField(default=False)
    is_active      = models.BooleanField(default=True)

    history = HistoricalRecords()

    class Meta:
        db_table = "company_phone"

    def __str__(self):
        return f"{self.phone_number} ({self.company.name_en})"

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def hard_delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)


class CompanyEmail(models.Model):
    EMAIL_TYPES = [
        ("general", "General"),
        ("support", "Support"),
        ("billing", "Billing"),
        ("hr", "HR"),
    ]

    company        = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="emails"
    )
    email          = models.EmailField()
    email_type_en = models.CharField(max_length=50, blank=True, null=True)
    email_type_fr = models.CharField(max_length=50, blank=True, null=True)
    email_type_ar = models.CharField(max_length=50, blank=True, null=True)
    is_primary     = models.BooleanField(default=False)
    is_active      = models.BooleanField(default=True)

    history = HistoricalRecords()

    class Meta:
        db_table = "company_email"

    def __str__(self):
        return f"{self.email} ({self.company.name_en})"

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def hard_delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)


class CompanyAddress(models.Model):
    ADDRESS_TYPES = [
        ("headquarters", "Headquarters"),
        ("branch", "Branch"),
        ("warehouse", "Warehouse"),
    ]

    company        = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="addresses"
    )
    # address lines kept as-is, no translation needed
    address_line1_en = models.TextField()
    address_line1_fr = models.TextField()
    address_line1_ar = models.TextField()
    address_line2_en = models.TextField(blank=True, null=True)
    address_line2_fr = models.TextField(blank=True, null=True)
    address_line2_ar = models.TextField(blank=True, null=True)
    city_en        = models.CharField(max_length=50, blank=True, null=True)
    city_fr        = models.CharField(max_length=50, blank=True, null=True)
    city_ar        = models.CharField(max_length=50, blank=True, null=True)
    state_en       = models.CharField(max_length=50, blank=True, null=True)
    state_fr       = models.CharField(max_length=50, blank=True, null=True)
    state_ar       = models.CharField(max_length=50, blank=True, null=True)
    country_en     = models.CharField(max_length=50, blank=True, null=True)
    country_fr     = models.CharField(max_length=50, blank=True, null=True)
    country_ar     = models.CharField(max_length=50, blank=True, null=True)
    postcode       = models.CharField(max_length=20, blank=True, null=True)
    address_type_en  = models.CharField(max_length=50, blank=True, null=True) 
    address_type_fr  = models.CharField(max_length=50, blank=True, null=True)
    address_type_ar  = models.CharField(max_length=50, blank=True, null=True)
    is_primary     = models.BooleanField(default=False)
    is_active      = models.BooleanField(default=True)

    history = HistoricalRecords()

    class Meta:
        db_table = "company_address"
        verbose_name_plural = "Company Addresses"

    def __str__(self):
        return f"{self.address_line1} ({self.company.name_en})"

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def hard_delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
