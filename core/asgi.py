"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat.routing import websocket_urlpatterns  # 👈 your chat app's WebSocket routes

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# ASGI application to handle HTTP and WebSocket
application = ProtocolTypeRouter({
    "http": django.core.asgi.get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
