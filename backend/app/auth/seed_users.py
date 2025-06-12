# seed_users.py
from passlib.context import CryptContext
from pymongo import MongoClient

# Setup bcrypt hasher
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["hr_monitor"]
users = db["users"]

# Clear existing users
users.delete_many({})

# Insert users with hashed passwords
users.insert_many([
    {
        "username": "ehab",
        "email": "ehab@example.com",
        "hashed_password": pwd_context.hash("ehab123"),
        "role": "admin"
    },
    {
        "username": "rami",
        "email": "rami@example.com",
        "hashed_password": pwd_context.hash("rami123"),
        "role": "employee"
    },
    {
        "username": "areen",
        "email": "areen@example.com",
        "hashed_password": pwd_context.hash("areen123"),
        "role": "anonymous_reporter"
    }
])

print("✅ Users inserted with hashed passwords.")