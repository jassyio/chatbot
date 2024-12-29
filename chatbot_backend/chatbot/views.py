import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from transformers import pipeline

# Initialize the Hugging Face pipeline
chatbot = pipeline('text-generation', model='gpt2')

def api_home(request):
    return JsonResponse({'message': 'Welcome to the Chatbot API!'})

@csrf_exempt
def chatbot_response(request):
    print(f"Requesting method: {request.method}")
    if request.method == 'POST':
        print("accessing the error handling method")
        try:
            if not request.body:
                return JsonResponse({'error': 'Empty request body'}, status=400)
            
            body = json.loads(request.body)
            user_input = body.get('message', '')

            # Generate a response using the Hugging Face pipeline
            response = chatbot(user_input, max_length=150, num_return_sequences=1, truncation=True)

            return JsonResponse({'response': response[0]['generated_text'].strip()})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'GET':
        return JsonResponse({'message': 'This endpoint only accepts POST requests'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)