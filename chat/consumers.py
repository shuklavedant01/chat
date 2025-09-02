
import json
import redis
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message, UserStatus, Membership
from .tasks import send_message_to_room, update_user_status

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_id = None
        self.room_group_name = None
        self.user = None
        self.redis_client = redis.Redis(host='localhost', port=6379, db=1, decode_responses=True)

    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Update user online status if authenticated
        if self.scope["user"].is_authenticated:
            self.user = self.scope["user"]
            update_user_status.delay(self.user.id, True)

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # Update user offline status
        if self.user:
            update_user_status.delay(self.user.id, False)

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_text = text_data_json['text']
            sender_id = text_data_json.get('sender_id')
            
            if not message_text:
                return
            
            # Save message to database
            message = await self.save_message(self.room_id, sender_id, message_text)
            
            if message:
                # Prepare message data
                message_data = {
                    'id': message.id,
                    'text': message.text,
                    'user': {
                        'id': message.user.id if message.user else None,
                        'username': message.user.username if message.user else 'Guest'
                    },
                    'timestamp': message.timestamp.isoformat(),
                    'room_id': self.room_id
                }
                
                # Send message to room group via Celery task
                send_message_to_room.delay(self.room_id, message_data)
                
        except json.JSONDecodeError:
            pass
        except Exception as e:
            await self.send(text_data=json.dumps({
                'error': f'Error processing message: {str(e)}'
            }))

    async def chat_message(self, event):
        """Handle chat message from room group"""
        message = event['message']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message
        }))

    async def user_status_update(self, event):
        """Handle user status update from room group"""
        status = event['status']
        
        # Send status update to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'user_status_update',
            'status': status
        }))

    @database_sync_to_async
    def save_message(self, room_id, sender_id, text):
        try:
            room = ChatRoom.objects.get(id=room_id)
            user = None
            if sender_id:
                try:
                    user = User.objects.get(id=sender_id)
                except User.DoesNotExist:
                    pass
            
            message = Message.objects.create(
                room=room,
                user=user,
                text=text
            )
            return message
        except Exception as e:
            print(f"Error saving message: {e}")
            return None
