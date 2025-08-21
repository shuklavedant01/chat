from django.urls import path
from .views import frontend_view

urlpatterns = [
    path('', frontend_view, name='frontend'),
]
