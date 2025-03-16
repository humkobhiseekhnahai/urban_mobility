import os
import json
from typing import Dict, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from app.api.optimizer import find_optimized_route, get_routes_and_mappings, load_routes, build_stop_routes_map
from app.models.models import  CreateCustomRouteRequest, TransitRequest

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
ROUTES_PATH = os.path.join(BASE_DIR, "data", "busRoutes.json")
OPTIMIZEROUTEBACKEND = "http://localhost:3001/api/optimize-route"
@app.post("/optimize_transit")
def optimize_transit(data: TransitRequest):
    try:
        print(f"Received request: Route No: {data.route_no}, Departure Time: {data.departure_time}")
        optimized_route = find_optimized_route(data.route_no)

        if not optimized_route:
            raise HTTPException(status_code=404, detail=f"No valid route found for {data.route_no}")

        # Send optimized route to Node.js backend for storage
        payload = {"route_no": data.route_no, "optimized_route": optimized_route}
        response = requests.post(OPTIMIZEROUTEBACKEND, json=payload)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to store optimized route in Node.js backend")

        return {"optimized_route": optimized_route}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    
NODE_BACKEND_URL = "http://localhost:3001/custom/create-custom-route"
@app.post("/create_custom_route")
def create_custom_route(data: CreateCustomRouteRequest):
    try:
        # Convert `intermediate_points` to `intermediate`
        payload = data.dict()
        payload["intermediate"] = payload.pop("intermediate_points")  # Rename key

        print("Payload Sent to Node.js:", payload)  # Debugging

        response = requests.post(NODE_BACKEND_URL, json=payload)

        if response.status_code != 200:
            print("Error from Node.js:", response.json())  # Debugging
            raise HTTPException(status_code=response.status_code, detail=response.json())

        return response.json()

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request to Node.js server failed: {str(e)}")
