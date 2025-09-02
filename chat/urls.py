
from django.urls import path
from . import views

urlpatterns = [
    path('create-private-room/', views.create_private_room_between_users, name='create_private_room'),
    path('send-message/', views.send_message, name='send_message'),
    path('room-messages/<int:room_id>/', views.get_room_messages, name='get_room_messages'),
    path('user-status/<int:user_id>/', views.get_user_status, name='get_user_status'),
    path('update-user-status/', views.update_user_online_status, name='update_user_status'),
    path('users-with-status/', views.get_users_with_status, name='users_with_status'),
]
