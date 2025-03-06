export const getRouteCoordinates = (startingLocation, apiResponse) => {
    // Parse startingLocation if it's a string
    let parsedStartingLocation = { lat: 0, lon: 0 };
    if (typeof startingLocation === 'string') {
        const [lat, lon] = startingLocation.split(',').map(Number);
        parsedStartingLocation = { lat, lon };
    } else if (typeof startingLocation === 'object' && startingLocation.lat && startingLocation.lon) {
        parsedStartingLocation = startingLocation;
    } else {
        console.error('Invalid starting location:', startingLocation);
        return [];
    }

    // Extract optimized_routes with safety checks
    const optimizedRoutes = apiResponse?.optimized_routes || [];
    
    if (!Array.isArray(optimizedRoutes)) {
        console.error('Invalid optimized_routes format:', optimizedRoutes);
        return [];
    }

    return optimizedRoutes.map(route => [
        [parsedStartingLocation.lat, parsedStartingLocation.lon], 
        ...route.map(point => [point.lat, point.lon])
    ]);
};
