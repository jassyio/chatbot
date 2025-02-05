import json
import os
import logging
import uuid
from datetime import datetime

from django.http import JsonResponse
# from django.http import JsonResponse
from django.contrib.auth import authenticate
# from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
# from rest_framework.decorators import authentication_classes, permission_classes
from dotenv import load_dotenv
import cohere

from .serializers import UserRegistrationSerializer, UserLoginSerializer

# Load environment variables
load_dotenv()
cohere_api_key = os.getenv('COHERE_API_KEY')

# Initialize the Cohere client
co = cohere.Client(cohere_api_key)

# Configure logging
logger = logging.getLogger(__name__)

class UserRegistrationView(APIView):
    """Handle user registration with token creation"""
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                user = serializer.save()
                token, created = Token.objects.get_or_create(user=user) # Create auth token
                return Response(status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    """Handle user login and token authentication"""
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(
            request,
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

class ChatbotView(APIView):
    """Handle authenticated chatbot interactions"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = json.loads(request.body)
            user_input = data.get('message', '').strip()
            short_reply = data.get('short_reply', False)

            if not user_input:
                return Response(
                    {'error': 'Message is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Generate response with Cohere
            response = co.generate(
                model='command',
                prompt=f"User: {user_input}\nAssistant:",
                max_tokens=150 if not short_reply else 50,
                temperature=0.7,
                p=0.9,
            )

            bot_response = response.generations[0].text.strip()
            
            # Log interaction
            self._log_interaction(request.user, user_input, bot_response)

            return Response({
                'user_message': user_input,
                'bot_response': bot_response,
                'timestamp': datetime.now().isoformat()
            })

        except json.JSONDecodeError:
            return Response(
                {'error': 'Invalid JSON format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except cohere.CohereError as e:
            logger.error(f"Cohere API Error: {str(e)}")
            return Response(
                {'error': 'Chat service unavailable'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _log_interaction(self, user, user_input, bot_response):
        """Log user interactions with context"""
        logger.info(
            f"User {user.email} ({user.pk}) - Input: {user_input} | Response: {bot_response}",
            extra={
                'user_id': user.pk,
                'input': user_input,
                'response': bot_response,
                'timestamp': datetime.now().isoformat()
            }
        )

class SessionView(APIView):
    """Generate session tokens for anonymous users"""
    def get(self, request):
        if not request.session.session_key:
            request.session.create()
        return Response({
            'session_token': str(uuid.uuid4()),
            'session_key': request.session.session_key
        })

class ChatHistoryView(APIView):
    """Manage chat history storage"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            message = request.data.get('message')
            if not message:
                return Response(
                    {'error': 'Message is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            chat_history = request.session.get('chat_history', [])
            entry = {
                'message': message,
                'timestamp': datetime.now().isoformat(),
                'user': request.user.pk
            }
            chat_history.append(entry)
            request.session['chat_history'] = chat_history
            
            return Response({'status': 'success', 'entry': entry})

        except Exception as e:
            logger.error(f"Chat history error: {str(e)}")
            return Response(
                {'error': 'Failed to save chat history'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def api_home(request):
    return JsonResponse({'message': 'Welcome to the chatbot API!'})