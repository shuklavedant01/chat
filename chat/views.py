
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import ChatRoom, Membership, Message, UserStatus
from .serializers import MessageSerializer, UserStatusSerializer
from .tasks import send_message_to_room, update_user_status

User = get_user_model()

# Create or fetch private chat room between two users
@api_view(['POST'])
@permission_classes([AllowAny])
def create_private_room_between_users(request):
    user1_id = request.data.get('user1_id')
    user2_id = request.data.get('user2_id')

    if not user1_id or not user2_id:
        return Response({'error': 'user1_id and user2_id are required'}, status=400)

    if user1_id == user2_id:
        return Response({'error': 'Cannot create private room with the same user.'}, status=400)

    try:
        user1 = User.objects.get(id=user1_id)
        user2 = User.objects.get(id=user2_id)
    except User.DoesNotExist:
        return Response({'error': 'One or both users not found.'}, status=404)

    existing_room = ChatRoom.objects.filter(
        is_private=True,
        membership__user=user1
    ).filter(
        membership__user=user2
    ).distinct().first()

    if existing_room:
        return Response({'room_id': existing_room.id})

    # Create new private room
    room = ChatRoom.objects.create(is_private=True)
    Membership.objects.bulk_create([
        Membership(room=room, user=user1),
        Membership(room=room, user=user2),
    ])
    return Response({'room_id': room.id})

# Send a message to a room (handled by WebSocket now)
@api_view(['POST'])
@permission_classes([AllowAny])
def send_message(request):
    room_id = request.data.get("room_id")
    text = request.data.get("text")
    sender_id = request.data.get("sender_id")

    if not room_id or not text or sender_id is None:
        return Response({"error": "room_id, text, and sender_id are required."}, status=400)

    try:
        room = ChatRoom.objects.get(id=room_id)
    except ChatRoom.DoesNotExist:
        return Response({"error": "Chat room does not exist."}, status=404)

    try:
        user = User.objects.get(id=sender_id)
    except (User.DoesNotExist, ValueError, TypeError):
        user = None

    # Save message in database
    message = Message.objects.create(
        room=room,
        user=user,
        text=text
    )

    # Prepare message data for real-time broadcast
    message_data = {
        'id': message.id,
        'text': message.text,
        'user': {
            'id': message.user.id if message.user else None,
            'username': message.user.username if message.user else 'Guest'
        },
        'timestamp': message.timestamp.isoformat(),
        'room_id': room_id
    }
    
    # Send message to room via Celery task
    send_message_to_room.delay(room_id, message_data)

    serializer = MessageSerializer(message)
    return Response({"status": "Message saved and sent in real-time", "message": serializer.data})

# Retrieve all messages from a room
@api_view(['GET'])
@permission_classes([AllowAny])
def get_room_messages(request, room_id):
    try:
        room = ChatRoom.objects.get(id=room_id)
    except ChatRoom.DoesNotExist:
        return Response({"error": "Room not found."}, status=404)

    messages = Message.objects.filter(room=room).order_by('timestamp')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

# Get user status
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_status(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        status, created = UserStatus.objects.get_or_create(user=user)
        serializer = UserStatusSerializer(status)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

# Update user status
@api_view(['POST'])
@permission_classes([AllowAny])
def update_user_online_status(request):
    user_id = request.data.get('user_id')
    is_online = request.data.get('is_online', False)
    
    if not user_id:
        return Response({'error': 'user_id is required'}, status=400)
    
    update_user_status.delay(user_id, is_online)
    return Response({'status': 'User status update initiated'})

# Get all users with their status
@api_view(['GET'])
@permission_classes([AllowAny])
def get_users_with_status(request):
    users = User.objects.select_related('userstatus').all()
    user_list = []
    
    for user in users:
        try:
            status = user.userstatus
        except UserStatus.DoesNotExist:
            status = UserStatus.objects.create(user=user)
        
        user_list.append({
            'id': user.id,
            'username': user.get_username(),
            'email': user.get_email(),
            'is_online': status.is_online,
            'last_seen': status.last_seen.isoformat()
        })
    
    return Response({'users': user_list})
