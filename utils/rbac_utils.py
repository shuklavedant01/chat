from typing import List, Dict
from accounts.rbac_models import Permission

def get_user_permissions(user) -> List[str]:
    """
    Returns a list of permission codes for the given user, considering their role,
    department, and designation.
    """
    if not user or not user.role:
        return []

    # Permissions directly from role
    perms = Permission.objects.filter(role=user.role)

    # Department/Designation-specific permissions
    if user.department:
        perms = perms | Permission.objects.filter(department=user.department)
    if user.designation:
        perms = perms | Permission.objects.filter(designation=user.designation)

    # Remove duplicates
    perms = perms.distinct()
    return list(perms.values_list('code', flat=True))

# Example usage after login (e.g., in login_api view):
# from utils.rbac_utils import get_user_permissions
# perms = get_user_permissions(user)
# request.session['permissions'] = perms
# # Or for JWT: jwt_claims['permissions'] = perms
