import numpy as np
import random
from scipy.spatial.distance import euclidean
from app.models.models import DeliveryRequest

def calculate_distance(route):
    """Calculate total route distance."""
    return sum(euclidean(route[i], route[i + 1]) for i in range(len(route) - 1))

def create_initial_population(locations, population_size=50):
    """Generate initial random population of routes."""
    return [random.sample(locations, len(locations)) for _ in range(population_size)]

def crossover(parent1, parent2):
    """Crossover function to create a new route."""
    start, end = sorted(random.sample(range(len(parent1)), 2))
    child = [None] * len(parent1)
    child[start:end] = parent1[start:end]
    
    remaining = [gene for gene in parent2 if gene not in child]
    pointer = 0
    for i in range(len(child)):
        if child[i] is None:
            child[i] = remaining[pointer]
            pointer += 1
    
    return child

def mutate(route, mutation_rate=0.1):
    """Randomly swap two locations in the route."""
    if random.random() < mutation_rate:
        idx1, idx2 = random.sample(range(len(route)), 2)
        route[idx1], route[idx2] = route[idx2], route[idx1]
    return route

def genetic_algorithm(request: DeliveryRequest, generations=200, population_size=50):
    """Optimize delivery routes using Genetic Algorithm."""
    locations = [(loc.lat, loc.lon) for loc in request.delivery_locations]

    if len(locations) < 2:
        return [[{"lat": loc[0], "lon": loc[1]}] for loc in locations]  # Wrap in list

    population = create_initial_population(locations, population_size)
    
    for _ in range(generations):
        population = sorted(population, key=calculate_distance)
        next_gen = population[:10]  # Keep top 10
        for _ in range(population_size - 10):
            parent1, parent2 = random.sample(next_gen, 2)
            child = crossover(parent1, parent2)
            child = mutate(child)
            next_gen.append(child)

        population = next_gen
    
    best_route = population[0]
    return [[{"lat": lat, "lon": lon}] for lat, lon in best_route]
