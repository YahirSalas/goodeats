from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask
app = Flask(__name__)
CORS(app)  # Allow React to talk to Flask

# Connect to Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Test route
@app.route('/api/hello')
def hello():
    return jsonify({"message": "Hello from Flask!"})

# Example: Get all deals
@app.route('/api/deals', methods=['GET'])
def get_deals():
    response = supabase.table("deals").select("*").execute()
    return jsonify(response.data)

# Example: Add new deal
@app.route('/api/deals', methods=['POST'])
def add_deal():
    data = request.json
    response = supabase.table("deals").insert(data).execute()
    return jsonify(response.data)

@app.route('/')
def index():
    return 'Flask is running!'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
