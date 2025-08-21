from kafka import KafkaProducer
import json

# Kafka Producer Setup
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',  # Update if Kafka is hosted elsewhere
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Function to send message
def send_chat_message_to_kafka(room_id, sender_id, text):
    message = {
        "room_id": room_id,
        "sender_id": sender_id,
        "text": text
    }
    producer.send('chat_messages', value=message)  # ✅ FIXED: added `value=` explicitly
    print(f"📤 Sent message to Kafka: {message}")
