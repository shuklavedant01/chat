import sys
import os
import django
import json
from kafka import KafkaConsumer
from django.core.exceptions import ObjectDoesNotExist

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from chat.models import Message, ChatRoom
from django.contrib.auth import get_user_model
User = get_user_model()

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

        Message.objects.create(
            room=room,
            sender=sender,
            content=content
        )

        print(f"✅ Message saved: '{content}' from {sender.username} in room {room_id}")

    except ObjectDoesNotExist:
        print(f"❌ Room or sender not found for message: {data}")
    except Exception as e:
        print(f"❌ Error saving message: {e}")
