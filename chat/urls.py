from django.urls import path
from . import views

urlpatterns = [
    path('create-private-room/', views.create_private_room_between_users, name='create_private_room'),
    path('send-message/', views.send_message, name='send_message'),
    path('room-messages/<int:room_id>/', views.get_room_messages, name='get_room_messages'),
    # path('all-chat-data/', views.get_all_chat_data, name='get_all_chat_data'),  # <- Dev only
]
