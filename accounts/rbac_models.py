from django.db import models
from django.conf import settings

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Designation(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Permission(models.Model):
    code = models.CharField(max_length=100, unique=True)  # e.g., 'view_dashboard'
    description = models.CharField(max_length=255, blank=True)
    department = models.ForeignKey(Department, null=True, blank=True, on_delete=models.SET_NULL)
    designation = models.ForeignKey(Designation, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.code

class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)  # e.g., 'admin', 'L1'
    permissions = models.ManyToManyField(Permission, blank=True)

    def __str__(self):
        return self.name
