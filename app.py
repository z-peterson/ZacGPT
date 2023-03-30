from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import openai
from cli import Bot
from pprint import pprint
import socket

app = Flask(__name__)
CORS(app)

bot_instance = Bot()

cost_per_token = 0.00003

def find_available_port(starting_port):
    port = starting_port
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            result = sock.connect_ex(('localhost', port))
            if result != 0:
                return port
            port += 1


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data['user_input']
    response, metadata, current_tokens = bot_instance.generate_chat_response(user_input)  # Unpack the tuple

    metadata["monthly_token_count"] = bot_instance.token_count
    metadata["monthly_cost"] = metadata["monthly_token_count"] * cost_per_token
    metadata["current_tokens"] = current_tokens
    metadata["current_cost"] = current_tokens * cost_per_token

    return jsonify({'response': response, 'metadata': metadata})

@app.route('/api/get_monthly_summary', methods=['GET'])
def get_monthly_summary():
    result = bot_instance.read_total_tokens_and_costs()
    return jsonify(result)

@app.route('/api/start_conversation', methods=['POST'])
def start_conversation():
    data = request.get_json()
    model_id = data['model_id']
    system_prompt = data.get('system_prompt', None)
    conversation_id = bot_instance.start_conversation(model_id, system_prompt)
    return jsonify({"message": "Conversation started", "conversation_id": conversation_id})

@app.route('/api/models', methods=['GET'])
def list_models():
    models = openai.Model.list()
    return jsonify(models)

def find_available_port(starting_port):
    port = starting_port
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            result = sock.connect_ex(('localhost', port))
            if result != 0:
                return port
            port += 1
