import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os

# Initialize the Hugging Face model and tokenizer
MODEL_NAME = "microsoft/DialoGPT-medium"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

# Optionally, move model to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Initialize chat history
chat_history_ids = None
max_history_length = 6  # Number of previous turns to keep

def api_home(request):
    return JsonResponse({'message': 'Welcome to the Chatbot API!'})

@csrf_exempt
def chatbot_response(request):
    global chat_history_ids
    print(f"Requesting method: {request.method}")
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'error': 'Empty request body'}, status=400)
            
            body = json.loads(request.body)
            user_input = body.get('message', '')

            if not user_input:
                return JsonResponse({'error': 'Message is required'}, status=400)

            # Encode the new user input, add the eos_token and return a tensor
            new_user_input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors='pt').to(device)

            # Append the new user input tokens to the chat history
            if chat_history_ids is not None:
                chat_history_ids = torch.cat([chat_history_ids, new_user_input_ids], dim=-1)
            else:
                chat_history_ids = new_user_input_ids

            # Generate a response
            response_ids = model.generate(
                chat_history_ids,
                max_length=1000,
                pad_token_id=tokenizer.eos_token_id,
                no_repeat_ngram_size=3,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                temperature=0.7
            )

            # Decode the response, skip the prompt
            bot_response = tokenizer.decode(response_ids[:, chat_history_ids.shape[-1]:][0], skip_special_tokens=True)

            # Optionally, limit the chat history
            if chat_history_ids.shape[-1] > 1000:
                chat_history_ids = new_user_input_ids

            return JsonResponse({'response': bot_response})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'GET':
        return JsonResponse({'message': 'This endpoint only accepts POST requests'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
