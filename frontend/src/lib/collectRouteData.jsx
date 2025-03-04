// Import necessary modules
import { fetchLocationName } from "./fetch_location_name";
import { FetchRoadClosures } from "./fetch_traffic_incidents";

export const collectRouteData = async (stops, markers, vehicleCapacity, numVehicles) => {
    const parseCoordinates = (location) => {
        const coords = location.match(/-?\d+\.?\d*/g)?.slice(0, 2).map(Number);
        return coords?.length === 2 ? coords : null;
    };

    // --- CHANGE 1: Process starting point ---
    const startingCoords = parseCoordinates(stops[0]?.location || "");
    let startingName = "Unknown location";
    if (startingCoords) {
        try {
            startingName = await fetchLocationName(startingCoords[0], startingCoords[1]);
        } catch (error) {
            console.error("Error fetching starting point name:", error);
        }
    }

    // --- CHANGE 2: Process delivery locations excluding starting point and add priority ---
    const deliveryLocations = await Promise.all(
        stops.slice(1).map(async (stop, index) => { // Changed from stops.map to stops.slice(1)
            const coords = parseCoordinates(stop.location);
            if (!coords) return null;

            let address = stop.location;
            try {
                address = await fetchLocationName(coords[0], coords[1]);
            } catch (error) {
                console.error(`Error fetching address for stop ${index + 1}:`, error);
            }

            // Capitalize priority if provided, default to "Low"
            const priority = stop.priority 
                ? stop.priority.charAt(0).toUpperCase() + stop.priority.slice(1).toLowerCase()
                : "Low";

            return {
                lat: coords[0],
                lon: coords[1],
                address: address,
                priority: priority, // Added priority field
                load_weight: stop.capacity || 0,
            };
        })
    );

    // --- CHANGE 3: Update real_time_data structure ---
    let realTimeData = {
        traffic: {}, // Changed from traffic_conditions: "unknown" to traffic: {}
        road_closures: [],
        // Removed weather_conditions and traffic_alerts
    };

    try {
        // --- CHANGE 4: Include starting point in traffic calculation ---
        if (deliveryLocations.length >= 1) { // Changed condition to >= 1 since we have starting point
            const start = { lat: startingCoords[0], lon: startingCoords[1], address: startingName };
            const locations = [start, ...deliveryLocations.filter(Boolean)]; // Combine starting point with delivery locations

            const traffic = {}; // Renamed from trafficConditions for clarity
            const roadClosureList = [];

            for (let i = 0; i < locations.length - 1; i++) {
                const current = locations[i];
                const next = locations[i + 1];

                if (tomtomApiKey && current && current.lat && current.lon && next && next.lat && next.lon) {
                    const incidentData = await FetchRoadClosures(current.lat, current.lon, next.lat, next.lon);
                    
                    if (incidentData?.real_time_data) {
                        const trafficDetails = incidentData.real_time_data.traffic;
                        const roadClosures = incidentData.real_time_data.road_closures;

                        traffic[`${current.address} to ${next.address}`] = trafficDetails;

                        if (roadClosures.length > 0) {
                            roadClosureList.push(...roadClosures);
                        }
                    }
                } else {
                    console.warn("TomTom API key not available or coordinates missing.");
                }
            }

            realTimeData.traffic = traffic; // Changed from traffic_conditions to traffic
            realTimeData.road_closures = roadClosureList;
        }
    } catch (error) {
        console.error("Error fetching real-time traffic data:", error);
        // traffic remains an empty object if fetch fails, which is fine for the desired format
    }

    // --- CHANGE 5: Add starting_point to the return object ---
    return {
        starting_point: startingName, // Added starting_point
        num_vehicles: numVehicles || 1,
        vehicle_capacity: vehicleCapacity || 100,
        delivery_locations: deliveryLocations.filter(Boolean),
        real_time_data: realTimeData,
    };
};