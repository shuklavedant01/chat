from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import ChatRoom, Membership, Message
from .serializers import MessageSerializer
from .kafka_producer import send_chat_message_to_kafka

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


# Send a message to a room via Kafka
@api_view(['POST'])
@permission_classes([AllowAny])
def send_message(request):
    room_id = request.data.get("room_id")
    text = request.data.get("text")
    sender_id = request.data.get("sender_id")  # <-- sender id from frontend

    if not room_id or not text or sender_id is None:
        return Response({"error": "room_id, text, and sender_id are required."}, status=400)

    try:
        room = ChatRoom.objects.get(id=room_id)
    except ChatRoom.DoesNotExist:
        return Response({"error": "Chat room does not exist."}, status=404)

    # Try to get the User instance by sender_id, or None if not found
    try:
        user = User.objects.get(id=sender_id)
    except (User.DoesNotExist, ValueError, TypeError):
        user = None

    # Save message in database
    message = Message.objects.create(
        room=room,
        user=user,  # can be None if invalid sender_id
        text=text
    )

    # Send to Kafka with sender_id from frontend
    send_chat_message_to_kafka(room_id, sender_id, text)

    serializer = MessageSerializer(message)
    return Response({"status": "Message saved and sent via Kafka", "message": serializer.data})



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


# @api_view(['GET'])
# @permission_classes([AllowAny])
# def get_all_chat_data(request):
#     rooms = ChatRoom.objects.all().values()
#     memberships = Membership.objects.all().values()
#     messages = Message.objects.all().values()
#     users = User.objects.all().values('id', 'username', 'email')

#     return Response({
#         "users": list(users),
#         "chat_rooms": list(rooms),
#         "memberships": list(memberships),
#         "messages": list(messages)
#     })
