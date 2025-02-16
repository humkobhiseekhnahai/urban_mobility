from fastapi import FastAPI
from app.models.models import TransportInput, TransshipmentNode
from app.api.optimizer import identify_transshipment_nodes

app = FastAPI()

@app.post("/optimize-transit", response_model=list[TransshipmentNode])
def optimize_transit(data: TransportInput):
    transshipment_nodes = identify_transshipment_nodes(data.routes, data.traffic_data, data.max_passenger_load)
    return transshipment_nodes
