import { fetchLocationName } from "./fetch_location_name";
import { FetchRoadClosures } from "./fetch_traffic_incidents";

// collectRouteData.js
export const collectRouteData = async (stops, markers, vehicleCapacity, numVehicles) => {
    const parseCoordinates = (location) => {
        const coords = location.match(/-?\d+\.?\d*/g)?.slice(0, 2).map(Number);
        return coords?.length === 2 ? coords : null;
    };

    // Process starting point
    const startingCoords = parseCoordinates(stops[0]?.location || "");
    let startingName = "Unknown location";
    if (startingCoords) {
        try {
            startingName = await fetchLocationName(startingCoords[0], startingCoords[1]);
        } catch (error) {
            console.error("Error fetching starting point name:", error);
        }
    }

    // Process delivery locations
    const deliveryLocations = await Promise.all(
        stops.slice(1).map(async (stop, index) => {
            const coords = parseCoordinates(stop.location);
            if (!coords) return null;
            
            let address = stop.location;
            try {
                address = await fetchLocationName(coords[0], coords[1]);
            } catch (error) {
                console.error(`Error processing stop ${index + 1}:`, error);
            }

            // Capitalize priority if provided, default to "Low"
            const priority = stop.priority 
                ? stop.priority.charAt(0).toUpperCase() + stop.priority.slice(1).toLowerCase() 
                : "Low";

            return {
                lat: coords[0],
                lon: coords[1],
                address: address,
                priority: priority,
                load_weight: stop.capacity || 0
            };
        })
    );

    // Get real-time traffic data
    let realTimeData = { traffic: "unknown", road_closures: [] };
    try {
        if (deliveryLocations.length >= 2) {
            const start = deliveryLocations[0];
            const end = deliveryLocations[deliveryLocations.length - 1];
            realTimeData = await FetchRoadClosures(start.lat, start.lon, end.lat, end.lon);
        }
    } catch (error) {
        console.error("Error fetching traffic data:", error);
    }

    return {
        starting_point: startingName,
        delivery_locations: deliveryLocations.filter(Boolean),
        num_vehicles: numVehicles || 1,
        vehicle_capacity: vehicleCapacity || 0,
        real_time_data: realTimeData // Fixed: no array wrapper
    };
};