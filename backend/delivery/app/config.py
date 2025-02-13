import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///db.sqlite3")
API_KEY = os.getenv("API_KEY", "your_api_key")
