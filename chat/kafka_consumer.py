
import sys
import os
import django
import json
import redis
from django.core.exceptions import ObjectDoesNotExist

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from chat.models import Message, ChatRoom, UserStatus
from django.contrib.auth import get_user_model
User = get_user_model()

# Redis Subscriber
redis_client = redis.Redis(host='localhost', port=6379, db=1, decode_responses=True)
pubsub = redis_client.pubsub()

def start_redis_listener():
    """Start Redis listener for chat messages"""
    pubsub.psubscribe('chat_room_*')
    print("✅ Redis subscriber started. Listening to chat channels...")
    
    try:
        for message in pubsub.listen():
            if message['type'] == 'pmessage':
                try:
                    data = json.loads(message['data'])
                    process_chat_message(data)
                except json.JSONDecodeError:
                    print("⚠️  Invalid JSON received")
                except Exception as e:
                    print(f"❌ Error processing message: {e}")
    except KeyboardInterrupt:
        print("🛑 Redis subscriber stopped")
    finally:
        pubsub.close()

def process_chat_message(data):
    """Process incoming chat message"""
    room_id = data.get("room_id")
    sender_id = data.get("sender_id")
    content = data.get("text")

    if not (room_id and content):
        print("⚠️  Invalid data received:", data)
        return

    try:
        room = ChatRoom.objects.get(id=room_id)
        sender = None
        if sender_id:
            try:
                sender = User.objects.get(id=sender_id)
            except User.DoesNotExist:
                pass

        # Message is already saved by the consumer, this is for additional processing if needed
        print(f"✅ Message processed: '{content}' from {sender.username if sender else 'Guest'} in room {room_id}")

    except ObjectDoesNotExist:
        print(f"❌ Room not found for message: {data}")
    except Exception as e:
        print(f"❌ Error processing message: {e}")

if __name__ == "__main__":
    start_redis_listener()
