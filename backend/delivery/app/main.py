from fastapi import FastAPI
from app.models.models import DeliveryRequest, DeliveryResponse
from app.api.routing import optimize_route
from app.api.loading import optimize_loading
from app.api.genetic import genetic_algorithm  # Import GA module

app = FastAPI()

@app.post("/optimize_delivery", response_model=DeliveryResponse)
def optimize_delivery(request: DeliveryRequest, method: str = "kmeans"):
    """Optimizes delivery routes using either K-Means+TSP or Genetic Algorithm."""
    if method == "ga":
        optimized_routes = genetic_algorithm(request)
    else:
        optimized_routes = optimize_route(request)
    
    loading_plan = optimize_loading(request)
    
    return {"optimized_routes": optimized_routes, "loading_plan": loading_plan}

@app.get("/")
def health_check():
    """Health check endpoint."""
    return {"status": "API is running"}
