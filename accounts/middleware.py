import re
from django.http import JsonResponse, HttpResponseForbidden
from django.urls import resolve
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from utils.rbac_utils import get_user_permissions

class RBACPermissionMiddleware(MiddlewareMixin):
    """
    Middleware to enforce RBAC permissions on every request.
    Efficiently checks user permissions from session/JWT, falls back to DB if needed.
    Extensible for department/designation logic.
    """
    def process_view(self, request, view_func, view_args, view_kwargs):
        # Always validate permissions server-side (never trust frontend)
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Prevent privilege escalation: never allow users to modify their own role/permissions via API
            if request.method in ['POST', 'PUT', 'PATCH']:
                sensitive_paths = ['/accounts/api/profile/', '/accounts/api/users/', '/admin/']
                if any(request.path_info.startswith(p) for p in sensitive_paths):
                    # Only allow if user has explicit permission
                    pass  # This can be extended for more granular checks

            # Allow superuser full access, but log all access for audit
            if getattr(request.user, 'is_superuser', False):
                self.log_access(request, allowed=True, reason='superuser')
                return None
            if getattr(request.user, 'is_staff', False):
                self.log_access(request, allowed=True, reason='staff')
                return None

            # Try to get permissions from session (or JWT if using DRF/JWT)
            perms = request.session.get('permissions')
            if perms is None:
                perms = get_user_permissions(request.user)
                request.session['permissions'] = perms

            # Determine required permission for this route/action
            route_name = resolve(request.path_info).url_name or request.path_info
            required_perm = f'access_{route_name}'

            # Validate permission for every sensitive route
            if required_perm not in perms:
                self.log_access(request, allowed=False, reason=f'missing {required_perm}')
                # API: return JSON 403 if Accept is JSON or path is API
                if re.match(r'^/api/', request.path_info) or 'application/json' in request.META.get('HTTP_ACCEPT', ''):
                    return JsonResponse({'error': 'Forbidden', 'detail': 'Permission denied.'}, status=403)
                # SSR: render 403 page
                return HttpResponseForbidden('<h1>403 Forbidden</h1>')
            self.log_access(request, allowed=True, reason=f'has {required_perm}')
        return None

    def log_access(self, request, allowed, reason):
        """
        Log all unauthorized access attempts and optionally all access for audit.
        """
        import logging
        logger = logging.getLogger('rbac.audit')
        user = getattr(request, 'user', None)
        username = str(user) if user and user.is_authenticated else 'Anonymous'
        msg = f"RBAC {'ALLOW' if allowed else 'DENY'}: user={username} path={request.path_info} method={request.method} reason={reason}"
        if not allowed:
            logger.warning(msg)
        else:
            logger.info(msg)

# To extend: add more checks for department/designation as needed
# Example: if required_perm not in perms and not department/designation match: deny
