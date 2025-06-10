from pymongo import MongoClient
from dotenv import load_dotenv
import os


load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
print("📡 Mongo URI from .env:", MONGO_URI) 

client = MongoClient(MONGO_URI)

try:
    print("MongoDB Databases:", client.list_database_names())
except Exception as e:
    print(" MongoDB connection failed:", e)

db = client["human_rights_mis"]