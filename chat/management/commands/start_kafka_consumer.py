from django.core.management.base import BaseCommand
from chat.kafka_consumer import start_kafka_listener  # Your function in kafka_consumer.py

class Command(BaseCommand):
    help = 'Starts Kafka consumer to listen for chat messages'

    def handle(self, *args, **options):
        start_kafka_listener()

