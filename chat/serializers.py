
from rest_framework import serializers
from .models import Message, ChatRoom, UserStatus

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'room', 'user', 'sender_username', 'text', 'timestamp']

    def get_sender_username(self, obj):
        return obj.user.get_username() if obj.user else "Guest"

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'is_private']

class UserStatusSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserStatus
        fields = ['user', 'username', 'is_online', 'last_seen']
