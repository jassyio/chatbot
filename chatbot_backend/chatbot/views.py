import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

def api_home(request):
    return JsonResponse({'message': 'Welcome to the Chatbot API!'})

@csrf_exempt
def chatbot_response(request):
    print(f"Requesting method: {request.method}")
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'error': 'Empty request body'}, status=400)
            
            body = json.loads(request.body)
            user_input = body.get('message', '')

            if not user_input:
                return JsonResponse({'error': 'Message is required'}, status=400)

            # Call OpenAI's Chat API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",  # or "gpt-4"
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_input},
                ],
                max_tokens=150,
                temperature=0.7,
                top_p=0.9,
            )

            bot_response = response.choices[0].message['content'].strip()

            return JsonResponse({'response': bot_response})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except openai.error.OpenAIError as e:
            print(f"Error communicating with OpenAI: {e}")
            return JsonResponse({'error': f"Error communicating with OpenAI: {e}"}, status=500)
        except Exception as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'GET':
        return JsonResponse({'message': 'This endpoint only accepts POST requests'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)