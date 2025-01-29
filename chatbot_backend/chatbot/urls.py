from django.urls import path
from . import views


urlpatterns = [
    path('chatbot/', views.chatbot_response, name='chatbot-response'),
    path('', views.api_home, name='api-home'),
    path('api/session/', views.session_view, name='session'),
    path('api/login', views.login_view, name='login'),
]