import openai
import datetime
import time
from pathlib import Path
import csv
import uuid

openai.organization = 
openai.api_key = 

# Define the cost per token for the GPT-4 model
cost_per_token = 0.00003  # Adjust this value according to the actual cost

class Bot:
    def __init__(self):
        self.model = "gpt-4"
        self.messages = []
        self.token_count = 0
        self.start_date = datetime.date.today()

    def reset_token_count(self):
        self.token_count = 0
        self.start_date = datetime.date.today()

    def generate_chat_response(self, prompt):
        current_date = datetime.date.today()
        days_passed = (current_date - self.start_date).days
        if days_passed >= 30:
            self.reset_token_count()

        self.messages.append({"role": "user", "content": prompt})
        start_time = time.time()
        
        try:
            response = openai.ChatCompletion.create(model=self.model, messages=self.messages)
        except openai.error.InvalidRequestError as e:
            return "\nError: " + e.http_body + "\nPlease try again or start a new conversation with !new."
            
        end_time = time.time()
        elapsed_time = end_time - start_time

        self.token_count += response["usage"]["total_tokens"]
        token_info = f"Tokens used this month: {self.token_count} | Current cost: ${self.token_count * cost_per_token:.2f}\n"

        reply = response["choices"][0]["message"]["content"]
        self.messages.append({"role": "assistant", "content": reply})

        metadata = {
            "elapsed_time": elapsed_time,
            "tokens_used": response["usage"]["total_tokens"],
        }
        self.update_token_count_csv(response["usage"]["total_tokens"])

        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open("conversation_history.txt", "a") as history_file:
            history_file.write(f"{timestamp} You: {prompt}\n")
            history_file.write(f"{timestamp} Response: {reply}\n")

        return reply, metadata, response["usage"]["total_tokens"]

    def update_token_count_csv(self, tokens_added):
        file_name = 'monthly_tokens.csv'
        
        if not Path(file_name).is_file():
            # Initialize CSV file with headers if it doesn't exist
            with open(file_name, 'w', newline='') as csvfile:
                fieldnames = ['date', 'tokens', 'cost']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()

        with open(file_name, 'a', newline='') as csvfile:
            fieldnames = ['date', 'tokens', 'cost']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writerow({'date': self.start_date, 'tokens': tokens_added, 'cost': tokens_added * cost_per_token})

    def read_total_tokens_and_costs(self):
        file_name = 'monthly_tokens.csv'

        if not Path(file_name).is_file():
            return {
                'message': 'No data found.',
                'total_tokens': 0,
                'total_cost': 0.0
            }
        
        total_tokens = 0
        total_cost = 0.0

        with open(file_name, 'r', newline='') as csvfile:
            fieldnames = ['date', 'tokens', 'cost']
            reader = csv.DictReader(csvfile, fieldnames=fieldnames)
            next(reader, None)  # Skip the header
            for row in reader:
                total_tokens += int(row['tokens'])
                total_cost += float(row['cost'])

        return {
            'message': 'Data retrieved successfully.',
            'total_tokens': total_tokens,
            'total_cost': total_cost
        }

    def start_conversation(self, model_id, system_prompt=None):
        self.model = model_id
        self.messages = []
        conversation_id = str(uuid.uuid4())  # Generate a unique conversation_id
        if system_prompt:
            self.messages.append({"role": "system", "content": system_prompt})
        return conversation_id
 
bot_instance = Bot()

def main():
    while True:
        user_input = input("You: ")

        response, metadata = bot_instance.generate_chat_response(user_input)  # Unpack the tuple
        print(f"Sanjay: {response}")

        # Append the conversation history to a text file with timestamp
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open("conversation_history.txt", "a") as history_file:
            history_file.write(f"{timestamp} You: {user_input}\n")
            history_file.write(f"{timestamp} Sanjay: {response}\n")

if __name__ == '__main__':
    main()