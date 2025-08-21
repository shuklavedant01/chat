
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from utils.custom_utils import *
from accounts.rbac_models import Role, Department, Designation

class Command(BaseCommand):
    help = 'Create a new superuser with role Admin'

    def handle(self, *args, **options):
        User = get_user_model()
        username = input('Username: ').strip()
        email = input('Email: ').strip()
        password = input('Password: ').strip()

        # Prompt for role
        role_name = input('Role (default: Admin): ').strip() or 'Admin'
        role, _ = Role.objects.get_or_create(name=role_name)

        # Prompt for department
        dept_name = input('Department (optional): ').strip()
        department = None
        if dept_name:
            department, _ = Department.objects.get_or_create(name=dept_name)

        # Prompt for designation
        desig_name = input('Designation (optional): ').strip()
        designation = None
        if desig_name:
            designation, _ = Designation.objects.get_or_create(name=desig_name)

        try:
            user = User.objects.create_superuser(
                plain_username=username,
                plain_email=email,
                password=password,
                role=role,
                department=department,
                designation=designation
            )
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Failed to create superuser: {e}'))
            raise CommandError('Superuser creation aborted.')
        else:
            self.stdout.write(self.style.SUCCESS(
                f'Superuser "{username}" created with role {role_name}, department {dept_name or "-"}, designation {desig_name or "-"}.'
            ))