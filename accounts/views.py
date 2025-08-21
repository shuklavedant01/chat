# accounts/views.py

import json
import logging

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth import login as django_login
from django.contrib.auth.decorators import login_required
from .models import Role, Department, Designation
from django.views.decorators.http import require_http_methods

from utils.custom_utils import decrypt_data
from utils.rbac_utils import get_user_permissions
from django.contrib.sessions.models import Session

logger = logging.getLogger(__name__)
from django.contrib.sessions.models import Session

# Utility: Invalidate all sessions for a user (call after role/permission change)
def invalidate_user_sessions(user):
    for session in Session.objects.all():
        data = session.get_decoded()
        if data.get('_auth_user_id') == str(user.id):
            session.delete()
    
# Example: Only return data permitted for the user (QuerySet filtering)
def get_user_queryset(user, base_queryset):
    if user.is_superuser:
        return base_queryset
    # Example: filter by department
    if hasattr(user, 'department') and user.department:
        return base_queryset.filter(department=user.department)
    return base_queryset.none()
User = get_user_model()

@csrf_exempt
def login_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed."}, status=405)

    try:
        payload = json.loads(request.body)
        enc_username = payload.get("username")
        enc_password = payload.get("password")
        if not enc_username or not enc_password:
            raise ValueError("Missing username or password payload")
    except Exception as e:
        logger.warning("Bad request payload: %s", e)
        return JsonResponse({"error": "Bad request."}, status=400)

    # 1) Decrypt both values
    try:
        username = decrypt_data(enc_username)
        password = decrypt_data(enc_password)
    except Exception as e:
        logger.warning("Decryption failed: %s", e)
        return JsonResponse({"error": "Decryption failed."}, status=400)

    # 2) Locate the user by decrypting stored usernames
    user = None
    for candidate in User.objects.all():
        try:
            plain = decrypt_data({
                "iv":   candidate.username_iv,
                "data": candidate.username_encrypted
            })
        except Exception:
            continue
        if plain == username:
            user = candidate
            break

    if not user:
        return JsonResponse({"error": "Invalid username or password."}, status=401)

    # 3) Check the password using Django's built-in hasher
    if not user.check_password(password):
        return JsonResponse({"error": "Invalid username or password."}, status=401)

    # 4) Log the user in (creates the session cookie)
    django_login(request, user)

    # 5) Store all user details you want in session
    request.session['user'] = {
        'id':           user.id,
        'username':     user.get_username(),
        'email':        user.get_email(),
        'role':         str(user.role) if user.role else None,
        'department':   str(user.department) if user.department else None,
        'designation':  str(user.designation) if user.designation else None,
        # add any other fields here…
    }
    # Store permissions in session
    request.session['permissions'] = get_user_permissions(user)

    print('user.role-->',user.role)
    return JsonResponse({
        "success": True,
        "username": username,
        "role": str(user.role) if user.role else None,
        "permissions": request.session['permissions'],
        "department": str(user.department) if user.department else None,
        "designation": str(user.designation) if user.designation else None
    })

@login_required
def profile_api(request):
    """
    GET /accounts/api/profile/
    Returns the logged-in user’s details as JSON.
    """
    user = request.user
    print('user-->',user)

    # Only return fields the user is allowed to see
    data = {
        'id': user.id,
        'username': user.get_username(),
        'email': user.get_email(),
        'role': str(user.role) if user.role else None,
        'department': str(user.department) if user.department else None,
        'designation': str(user.designation) if user.designation else None,
    }
    # Example: double-check permission for sensitive info
    perms = get_user_permissions(user)
    if 'view_sensitive_profile' in perms:
        data['sensitive_field'] = '...'  # Only add if permitted
    else:
        logger.warning(f"Unauthorized sensitive profile access attempt by {user}")
    return JsonResponse({'user': data})

@csrf_exempt
def logout_api(request):
    """
    POST /accounts/api/logout/
    Logs out the user and clears the session.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed."}, status=405)

    # Clear the session
    request.session.flush()
    
    # Optionally, invalidate all sessions for this user
    if hasattr(request, 'user') and request.user.is_authenticated:
        invalidate_user_sessions(request.user)

    return JsonResponse({"success": True})


@login_required
def all_users_api(request):
    user = request.user
    print('Logged in user:', user)

    # Join with related tables
    users = User.objects.select_related('role', 'department', 'designation').all()

    user_list = []
    for u in users:
        user_list.append({
            'id': u.id,
            'username': u.get_username(),  # ← This should decrypt the value
            'email': u.get_email(),        # ← Same here
            # 'phone': u.get_phone(),
            # 'address': u.get_address(),
            'role': str(u.role) if u.role else None,
            'department': str(u.department) if u.department else None,
            'designation': str(u.designation) if u.designation else None,
        })

    return JsonResponse({'users': user_list})
            
@csrf_exempt
@login_required
def update_user_api(request, user_id):
    if request.method == 'PUT':
        try:
            user = User.objects.get(id=user_id)
            payload = json.loads(request.body)

            if 'role' in payload:
                user.role = Role.objects.get(name=payload['role'])

            if 'department' in payload:
                user.department = Department.objects.get(name=payload['department'])

            if 'designation' in payload:
                user.designation = Designation.objects.get(name=payload['designation'])

            user.save()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
@require_http_methods(["DELETE"])
@login_required
def delete_user_api(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return JsonResponse({'status': 'User deleted permanently.'})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)