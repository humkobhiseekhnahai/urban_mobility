from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.models import DeliveryRequest, DeliveryResponse
from app.api.routing import optimize_route
from app.api.loading import optimize_loading
from app.api.genetic import genetic_algorithm  # Import GA module
from app.api.ecomode import eco_friendly_route  # Import Eco Mode

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with frontend origin for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/optimize_delivery", response_model=DeliveryResponse)
def optimize_delivery(request: DeliveryRequest, method: str = "kmeans", eco_mode: bool = False):
    """Optimizes delivery routes using K-Means+TSP, Genetic Algorithm, or Eco Mode."""
    try:
        if eco_mode:
            optimized_routes = eco_friendly_route(request)
        elif method == "ga":
            optimized_routes = genetic_algorithm(request)
        else:
            optimized_routes = optimize_route(request)

        loading_plan = optimize_loading(request, optimized_routes)

        return {"optimized_routes": optimized_routes, "loading_plan": loading_plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health_check():
    """Health check endpoint."""
    return {"status": "API is running"}
