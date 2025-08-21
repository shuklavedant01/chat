from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views import View
from accounts.rbac_models import Department, Designation, Role
from django.utils.decorators import method_decorator
import json

# List all departments
class DepartmentListAPI(View):
    def get(self, request):
        depts = Department.objects.all()
        data = [{"id": d.id, "name": d.name} for d in depts]
        return JsonResponse(data, safe=False)

# List all designations
class DesignationListAPI(View):
    def get(self, request):
        desigs = Designation.objects.all()
        data = [{"id": d.id, "name": d.name} for d in desigs]
        return JsonResponse(data, safe=False)

# Assign/unassign a role to a department or designation
@method_decorator(csrf_exempt, name='dispatch')
class RoleDepartmentDesignationAPI(View):
    def post(self, request, role_id):
        try:
            role = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            return JsonResponse({'error': 'Role not found'}, status=404)
        try:
            payload = json.loads(request.body)
            dept_id = payload.get('department_id')
            desig_id = payload.get('designation_id')
        except Exception:
            return JsonResponse({'error': 'Invalid payload'}, status=400)
        if dept_id:
            try:
                dept = Department.objects.get(id=dept_id)
                role.department = dept
            except Department.DoesNotExist:
                return JsonResponse({'error': 'Department not found'}, status=404)
        if desig_id:
            try:
                desig = Designation.objects.get(id=desig_id)
                role.designation = desig
            except Designation.DoesNotExist:
                return JsonResponse({'error': 'Designation not found'}, status=404)
        role.save()
        return JsonResponse({'success': True})
