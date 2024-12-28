from django.urls import path, include
from . import views


urlpatterns = [
    path('chatbot/', views.chatbot_response, name='chatbot-response'),
    path('', views.api_home, name='api-home'),
]