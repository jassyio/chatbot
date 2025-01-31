from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    ChatbotView,
    SessionView,
    ChatHistoryView,
    APIHomeView,
)

urlpatterns = [
    path('', APIHomeView.as_view(), name='api_home'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    path('session/', SessionView.as_view(), name='session'),
    path('history/', ChatHistoryView.as_view(), name='history'),
]