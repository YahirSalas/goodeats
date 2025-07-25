from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

print("SUPABASE_URL:", os.getenv("SUPABASE_URL"))
print("SUPABASE_SERVICE_ROLE_KEY:", os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

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

# GET all deals (with restaurant info)
@app.route('/api/deals', methods=['GET'])
def get_deals():
    response = supabase.table("deals") \
        .select("*, restaurants (name, address, place_id, coordinates)") \
        .execute()
    return jsonify(response.data)

# POST a new deal
@app.route('/api/deals', methods=['POST'])
def add_deal():
    data = request.json
    place_id = data.get("place_id")

    if not place_id:
        return jsonify({"error": "Missing place_id"}), 400

    # 1. Check if restaurant already exists
    existing_rest = supabase.table("restaurants") \
        .select("id") \
        .eq("place_id", place_id) \
        .execute()

    if existing_rest.data:
        restaurant_id = existing_rest.data[0]["id"]
    else:
        # 2. If not, insert restaurant
        rest_data = {
            "place_id": place_id,
            "name": data.get("restaurant"),
            "address": data.get("address"),
            "coordinates": data.get("coordinates")  # should be dict { lat, lng }
        }
        new_rest = supabase.table("restaurants").insert(rest_data).execute()
        restaurant_id = new_rest.data[0]["id"]

    # 3. Insert the deal with FK to restaurant
    deal_data = {
        "restaurant_id": restaurant_id,
        "title": data.get("title"),
        "description": data.get("description"),
        "price": data.get("price"),
        "discount": data.get("discount"),
        "availability": data.get("availability"),
        "food_types": data.get("foodTypes"),  # e.g. "Pizza"
        "created_by": data.get("user_id")  # optional
    }

    inserted = supabase.table("deals").insert(deal_data).execute()
    return jsonify(inserted.data)

# Root route
@app.route('/')
def index():
    return 'Flask is running!'

# Run app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
