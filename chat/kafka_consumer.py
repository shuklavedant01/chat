
import sys
import os
import django
import json
import asyncio
from kafka import KafkaConsumer
from django.core.exceptions import ObjectDoesNotExist
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from chat.models import Message, ChatRoom
from django.contrib.auth import get_user_model
User = get_user_model()

# Get channel layer for WebSocket broadcasting
channel_layer = get_channel_layer()

# Kafka Consumer
consumer = KafkaConsumer(
    'chat_messages',
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    group_id='chat_group',
    enable_auto_commit=True
)

print("✅ Kafka consumer started. Listening to 'chat_messages'...")

for msg in consumer:
    data = msg.value
    room_id = data.get("room_id")
    sender_id = data.get("sender_id")
    content = data.get("text")

    if not (room_id and sender_id and content):
        print("⚠️  Invalid data received:", data)
        continue

    try:
        room = ChatRoom.objects.get(id=room_id)
        sender = User.objects.get(id=sender_id)

        # Save message to database
        message = Message.objects.create(
            room=room,
            user=sender,
            text=content
        )

        # Broadcast to WebSocket group
        room_group_name = f'chat_{room_id}'
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'chat_message',
                'message': content,
                'sender_id': sender_id,
                'message_id': message.id,
                'timestamp': message.timestamp.isoformat()
            }
        )
        
        print(f"✅ Message saved and broadcasted to WebSocket room {room_id}")

    except ObjectDoesNotExist as e:
        print(f"❌ Database error: {e}")
    except Exception as e:
        print(f"❌ Error processing Kafka message: {e}")
        
        print(f"✅ Message saved: '{content}' from {sender.username} in room {room_id}")

        # Broadcast to WebSocket clients
        room_group_name = f'chat_{room_id}'
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'chat_message',
                'message': content,
                'sender_id': sender_id,
                'message_id': message.id,
                'timestamp': message.timestamp.isoformat()
            }
        )
        print(f"📡 Broadcasted message to WebSocket group: {room_group_name}")

    except ObjectDoesNotExist:
        print(f"❌ Room or sender not found for message: {data}")
    except Exception as e:
        print(f"❌ Error saving message: {e}")
