from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.models import TransportInput, TransshipmentNode
from app.api.optimizer import identify_transshipment_nodes

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific frontend origins for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/optimize_transit", response_model=list[TransshipmentNode])
def optimize_transit(data: TransportInput):

    transshipment_nodes = identify_transshipment_nodes(data.routes, data.traffic_data, data.max_passenger_load)
    return transshipment_nodes

