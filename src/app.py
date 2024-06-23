from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import chatbot_response

app = Flask(__name__)
CORS(app,resources={r"/*": {"origins": ["https://finance-app-beta-umber.vercel.app/home"]}})

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    response = chatbot_response(user_input)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
