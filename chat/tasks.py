
from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from .models import Message, ChatRoom, UserStatus
import json

User = get_user_model()
channel_layer = get_channel_layer()

@shared_task
def send_message_to_room(room_id, message_data):
    """Send message to all clients in a room via WebSocket"""
    try:
        async_to_sync(channel_layer.group_send)(
            f"chat_{room_id}",
            {
                "type": "chat_message",
                "message": message_data
            }
        )
        return f"Message sent to room {room_id}"
    except Exception as e:
        return f"Error sending message: {str(e)}"

@shared_task
def update_user_status(user_id, is_online):
    """Update user online status and notify all relevant rooms"""
    try:
        user = User.objects.get(id=user_id)
        status, created = UserStatus.objects.get_or_create(user=user)
        status.is_online = is_online
        status.save()
        
        # Get all rooms this user is in
        from .models import Membership
        memberships = Membership.objects.filter(user=user)
        
        status_data = {
            'user_id': user_id,
            'username': user.username,
            'is_online': is_online,
            'last_seen': status.last_seen.isoformat()
        }
        
        # Notify all rooms about status change
        for membership in memberships:
            async_to_sync(channel_layer.group_send)(
                f"chat_{membership.room.id}",
                {
                    "type": "user_status_update",
                    "status": status_data
                }
            )
        
        return f"Status updated for user {user_id}"
    except Exception as e:
        return f"Error updating status: {str(e)}"
