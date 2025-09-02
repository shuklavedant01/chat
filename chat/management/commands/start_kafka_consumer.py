
from django.core.management.base import BaseCommand
from chat.kafka_consumer import start_redis_listener

class Command(BaseCommand):
    help = 'Starts Redis subscriber to listen for chat messages'

    def handle(self, *args, **options):
        start_redis_listener()
