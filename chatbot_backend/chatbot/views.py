from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import openai

# Create your views here.

openai.api_key = ""


def api_home(request):
    return JsonResponse({'message': 'Welcome to the Chatbot API!'})
@csrf_exempt
def chatbot_response(request):
    if  request.method == 'POST':
        try:
            body = json.loads(request.body)
            user_input = body.get('message', '')

            response = openai.Completion.create(
                model="gpt-3.5-turbo",
                prompt=user_input,
                max_tokens=150
            )

            return JsonResponse({'response': response.choices[0].text.strip()})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)