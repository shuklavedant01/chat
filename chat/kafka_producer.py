
import redis
import json

# Redis client for publishing messages
redis_client = redis.Redis(host='localhost', port=6379, db=1, decode_responses=True)

def publish_message_to_redis(room_id, message_data):
    """Publish message to Redis for real-time processing"""
    try:
        channel = f"chat_room_{room_id}"
        redis_client.publish(channel, json.dumps(message_data))
        print(f"📤 Published message to Redis channel: {channel}")
        return True
    except Exception as e:
        print(f"❌ Error publishing to Redis: {e}")
        return False
