from django.urls import path

from accounts.views import *
from accounts.rbac_api import RoleListAPI, PermissionListAPI, RolePermissionsAPI
from accounts.rbac_dept_api import DepartmentListAPI, DesignationListAPI, RoleDepartmentDesignationAPI

urlpatterns = [
    path('api/login/', login_api, name='login_api'),
    path('api/profile/', profile_api, name='profile_api'),
    path('api/logout/', logout_api, name='logout_api'),
    path('api/all_users/', all_users_api, name='all_users_api'),
    path('api/update_user/<int:user_id>/', update_user_api, name='update_user_api'), 
    path('api/delete_user/<int:user_id>/', delete_user_api, name='delete_user_api'),


    # RBAC management APIs for React admin panel
    path('api/roles/', RoleListAPI.as_view(), name='role_list_api'),
    path('api/permissions/', PermissionListAPI.as_view(), name='permission_list_api'),
    path('api/roles/<int:role_id>/permissions/', RolePermissionsAPI.as_view(), name='role_permissions_api'),

    # Department/Designation mapping APIs
    path('api/departments/', DepartmentListAPI.as_view(), name='department_list_api'),
    path('api/designations/', DesignationListAPI.as_view(), name='designation_list_api'),
    path('api/roles/<int:role_id>/map/', RoleDepartmentDesignationAPI.as_view(), name='role_dept_desig_map_api'),
]