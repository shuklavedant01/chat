
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import ChatRoom, Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"✅ WebSocket connected to room {self.room_id}")

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"🔌 WebSocket disconnected from room {self.room_id}")

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['text']
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_id': self.scope['user'].id if self.scope['user'].is_authenticated else None,
                    'timestamp': str(timezone.now().isoformat())
                }
            )
        except Exception as e:
            print(f"❌ Error in WebSocket receive: {e}")

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'text': event['message'],
            'sender_id': event['sender_id'],
            'timestamp': event['timestamp']
        }))
