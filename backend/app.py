from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Connect to Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Test route
@app.route('/api/hello')
def hello():
    return jsonify({"message": "Hello from Flask!"})

# Get all deals with restaurant info
@app.route('/api/deals', methods=['GET'])
def get_deals():
    response = supabase.table("deals").select("*, restaurants(*)").execute()
    return jsonify(response.data)

# Submit a new deal
@app.route('/api/deals', methods=['POST'])
def add_deal():
    data = request.json
    response = supabase.table("deals").insert(data).execute()
    return jsonify(response.data)

# Check if restaurant exists by place_id
@app.route('/api/restaurants/check', methods=['POST'])
def check_restaurant():
    data = request.json
    place_id = data.get("place_id")

    result = supabase.table("restaurants").select("*").eq("place_id", place_id).single().execute()
    if result.data:
        return jsonify({ "exists": True, "restaurant": result.data })
    else:
        return jsonify({ "exists": False })

# Create a new restaurant
@app.route('/api/restaurants/create', methods=['POST'])
def create_restaurant():
    data = request.json
    new_restaurant = {
        "name": data["name"],
        "address": data["address"],
        "place_id": data["place_id"],
        "latitude": data["coordinates"]["lat"],
        "longitude": data["coordinates"]["lng"]
    }

    result = supabase.table("restaurants").insert(new_restaurant).execute()
    return jsonify(result.data[0])

# Get a single restaurant and its deals
@app.route('/api/restaurants/<int:restaurant_id>', methods=['GET'])
def get_restaurant_details(restaurant_id):
    restaurant_res = supabase.table("restaurants").select("*").eq("id", restaurant_id).single().execute()
    if not restaurant_res.data:
        return jsonify({ "error": "Restaurant not found" }), 404

    deals_res = supabase.table("deals").select("*").eq("restaurant_id", restaurant_id).execute()

    return jsonify({
        "restaurant": restaurant_res.data,
        "deals": deals_res.data
    })

@app.route('/')
def index():
    return 'Flask is running!'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
