from fastapi import FastAPI
from app.models.models import DeliveryRequest, DeliveryResponse
from app.api.routing import optimize_route
from app.api.loading import optimize_loading
app = FastAPI()
@app.post("/optimize_delivery", response_model=DeliveryResponse)
def optimize_delivery(request: DeliveryRequest):
    optimized_routes = optimize_route(request)
    loading_plan = optimize_loading(request)
    
    return {"optimized_routes": optimized_routes, "loading_plan": loading_plan}
@app.get("/")
def health_check():
    return {"status": "API is running"}