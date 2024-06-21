import requests
import csv
import json
import openai
import spacy
ALPHA_VANTAGE_API_KEY = "5QJVB1470YSOAI6Q"
openai.api_key = "1c08fb37f6msh75ab249d0d42ab1p1a7842jsn6eb7242580ba"
# Load SpaCy model
nlp = spacy.load("en_core_web_sm")

# Function to generate response using GPT-4 Turbo
def generate_gpt_response(user_input):
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful finance assistant."},
            {"role": "user", "content": user_input}
        ],
        max_tokens=100,
        temperature=0.7,
        n=1
    )
    return response['choices'][0]['message']['content'].strip()

# Function to fetch company data from Alpha Vantage
def fetch_company_data():
    url = f"https://www.alphavantage.co/query?function=LISTING_STATUS&apikey={ALPHA_VANTAGE_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        content_type = response.headers.get('Content-Type')
        if 'text/csv' in content_type or 'application/x-download' in content_type:
            companies = {}
            decoded_content = response.content.decode('utf-8')
            cr = csv.reader(decoded_content.splitlines(), delimiter=',')
            header = next(cr)

            for row in cr:
                symbol, name = row[0], row[1]
                if name:
                    companies[name.lower()] = symbol

            try:
                with open("company_data.json", "w") as file:
                    json.dump(companies, file, indent=4)
                    print("Company data saved to company_data.json")
            except Exception as e:
                print(f"Error saving data to file: {e}")
        else:
            print("Unexpected content type:", content_type)
    else:
        print("Failed to fetch company data:", response.status_code)

fetch_company_data()

# Function to get stock price from Alpha Vantage
def get_stock_price(symbol):
    try:
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={ALPHA_VANTAGE_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if "Time Series (1min)" in data:
            latest_time = list(data["Time Series (1min)"].keys())[0]
            latest_price = data["Time Series (1min)"][latest_time]["1. open"]
            return latest_price
        else:
            return None
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
        return None
    except Exception as err:
        print(f"Other error occurred: {err}")
        return None

# Function to identify stock symbols from company data
def get_stock_symbol(company_name):
    try:
        with open("company_data.json", "r") as file:
            company_data = json.load(file)
        return company_data.get(company_name.lower())
    except Exception as e:
        print(f"Error reading company data: {e}")
        return None

# Improved function to extract company names using NLP
def extract_company_name(doc):
    for ent in doc.ents:
        if ent.label_ == "ORG":
            return ent.text
    return None

# Example usage of chatbot response generation
def chatbot_response(user_input):
    # Extract possible stock symbol or company name from user input
    doc = nlp(user_input)
    company_name = extract_company_name(doc)
    stock_symbol = get_stock_symbol(company_name) if company_name else None

    # Generate response based on extracted symbol or user input
    if stock_symbol:
        price = get_stock_price(stock_symbol)
        if price:
            return f"The current price of {stock_symbol} is ${price}."
        else:
            return f"Sorry, I couldn't fetch the price for {stock_symbol} at the moment. Please try again later."
    else:
        return generate_gpt_response(user_input)

# Test the chatbot
user_input = "What is the stock price of AAPL?"
response = chatbot_response(user_input)
print("Chatbot Response:", response)

user_input = "tata motors"
response = chatbot_response(user_input)
print("Chatbot Response:", response)
