import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from transformers import AutoTokenizer, AutoModelForCausalLM

# Initialize the Hugging Face model and tokenizer
MODEL_NAME = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

# Assign the eos_token as the pad_token if it's not already set
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

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

            # Tokenize the input and generate a response
            inputs = tokenizer(user_input, return_tensors="pt", truncation=True, padding=True)
            outputs = model.generate(
                inputs['input_ids'], 
                max_length=150, 
                num_return_sequences=1, 
                pad_token_id=tokenizer.pad_token_id,  # Use the defined pad_token_id
                attention_mask=inputs['attention_mask']
            )
            bot_response = tokenizer.decode(outputs[0], skip_special_tokens=True)

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
