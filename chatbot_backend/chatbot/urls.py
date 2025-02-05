from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    ChatbotView,
    SessionView,
    ChatHistoryView,
    api_home,
)

urlpatterns = [
    path('', api_home, name='api_home'),
    path('register/', UserRegistrationView.as_view()),
    path('login/', UserLoginView.as_view(), name='login'),
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    path('session/', SessionView.as_view(), name='session'),
    path('history/', ChatHistoryView.as_view(), name='history'),
]