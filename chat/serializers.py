from rest_framework import serializers
from .models import Message, ChatRoom

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'room', 'user', 'sender_username', 'text', 'timestamp']

    def get_sender_username(self, obj):
        return obj.user.username if obj.user else "Guest"

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'is_private']
