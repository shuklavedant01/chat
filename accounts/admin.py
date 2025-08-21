
from django.contrib import admin
from .rbac_models import Role, Permission, Department, Designation

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    search_fields = ['name']
    list_display = ['name']

@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    search_fields = ['name']
    list_display = ['name']

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['code', 'description', 'department', 'designation']
    list_filter = ['department', 'designation']
    search_fields = ['code', 'description']

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    filter_horizontal = ['permissions']  # Easy multi-select UI
