
import sys
import os
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Starts Kafka consumer to listen for chat messages'

    def handle(self, *args, **options):
        # Import here to avoid Django setup issues
        from chat.kafka_consumer import consumer, channel_layer
        
        self.stdout.write("Starting Kafka consumer...")
        
        try:
            # The consumer loop is already in kafka_consumer.py
            # We just need to import and let it run
            exec(open('chat/kafka_consumer.py').read())
        except KeyboardInterrupt:
            self.stdout.write("Kafka consumer stopped.")
        except Exception as e:
            self.stdout.write(f"Error in Kafka consumer: {e}")
