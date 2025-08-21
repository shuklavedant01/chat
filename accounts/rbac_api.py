from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views import View
from accounts.rbac_models import Role, Permission
from django.forms.models import model_to_dict
from django.utils.decorators import method_decorator
from django.db.models import Prefetch

# List all roles
class RoleListAPI(View):
    def get(self, request):
        roles = Role.objects.all()
        data = [
            {"id": r.id, "name": r.name} for r in roles
        ]
        return JsonResponse(data, safe=False)

# List all permissions
class PermissionListAPI(View):
    def get(self, request):
        perms = Permission.objects.all()
        data = [
            {"id": p.id, "code": p.code, "description": p.description} for p in perms
        ]
        return JsonResponse(data, safe=False)

# Get or update permissions for a role
@method_decorator(csrf_exempt, name='dispatch')
class RolePermissionsAPI(View):
    def get(self, request, role_id):
        try:
            role = Role.objects.prefetch_related('permissions').get(id=role_id)
        except Role.DoesNotExist:
            return JsonResponse({'error': 'Role not found'}, status=404)
        perm_ids = list(role.permissions.values_list('id', flat=True))
        return JsonResponse(perm_ids, safe=False)

    def post(self, request, role_id):
        import json
        try:
            role = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            return JsonResponse({'error': 'Role not found'}, status=404)
        try:
            payload = json.loads(request.body)
            perm_id = payload['permission_id']
            action = payload['action']
        except Exception:
            return JsonResponse({'error': 'Invalid payload'}, status=400)
        try:
            perm = Permission.objects.get(id=perm_id)
        except Permission.DoesNotExist:
            return JsonResponse({'error': 'Permission not found'}, status=404)
        if action == 'add':
            role.permissions.add(perm)
        elif action == 'remove':
            role.permissions.remove(perm)
        else:
            return JsonResponse({'error': 'Invalid action'}, status=400)
        return JsonResponse({'success': True})
