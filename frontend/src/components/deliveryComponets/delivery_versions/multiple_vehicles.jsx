import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { apiResponseAtom, startingLocationAtom } from '../../../hooks/atoms/atom';
import TruckLoadingBar from '../TruckLoadingBar';
import RouteMap from '../routeDeliveryMap';
import { getRouteCoordinates } from '../../../lib/getRouteCoordinates';

const DeliveryResult_multiple = ({ totalCapacity, numberOfVehicles, setIsOptimized }) => {
    const apiResponse = useAtomValue(apiResponseAtom);
    const startingLocation = useAtomValue(startingLocationAtom); // e.g., { lat: 12.9784, lon: 77.6419 }

    if (!apiResponse) return null;

    const { optimized_routes, loading_plan } = apiResponse;

    // Parse startingLocation
    let parsedStartingLocation;
    if (typeof startingLocation === 'string') {
        const [lon, lat] = startingLocation.split(',').map(Number);
        parsedStartingLocation = { lat, lon, address: 'Warehouse' };
    } else if (startingLocation && typeof startingLocation === 'object' && 'lat' in startingLocation && 'lon' in startingLocation) {
        parsedStartingLocation = { ...startingLocation, address: 'Warehouse' };
    } else {
        console.error('Invalid startingLocation:', startingLocation);
        return null;
    }

    const routeData = getRouteCoordinates(startingLocation,apiResponse);
    console.log(routeData)
    // Create itemMap for weight and address lookup
    const itemMap = {};
    loading_plan.forEach((bin) => {
        bin.items.forEach((item) => {
            const key = `${item.lat},${item.lon}`;
            itemMap[key] = { weight: item.weight, address: item.address };
        });
    });

    // Construct fullRoutes with addresses
    const fullRoutes = optimized_routes.map((route) => [
        parsedStartingLocation,
        ...route.map((point) => {
            const key = `${point.lat},${point.lon}`;
            const item = itemMap[key];
            return { ...point, address: item ? item.address : 'Unknown' };
        }),
    ]);

    const limitedRoutes = fullRoutes.slice(0, numberOfVehicles);

    // Calculate total weight for each route (exclude starting location)
    const routeWeights = limitedRoutes.map((route) => {
        let totalWeight = 0;
        const visitedStops = new Set(); // Track visited stops to avoid duplicates
    
        route.forEach((point, index) => {
            if (index > 0) { // Skip starting location
                const key = `${point.lat},${point.lon}`;
                if (itemMap[key] && !visitedStops.has(key)) {
                    totalWeight += itemMap[key].weight;
                    visitedStops.add(key); // Mark stop as visited
                }
            }
        });
    
        // Ensure weight does not exceed truck capacity
        return Math.min(totalWeight, totalCapacity);
    });
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-neutral-900 text-gray-200 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-light">Optimized Delivery Routes</h1>
                <button
                    onClick={() => setIsOptimized(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-light py-2 px-4 rounded-lg transition-colors"
                >
                    Back to Input
                </button>
            </div>

            {optimized_routes.length > numberOfVehicles && (
                <div className="mb-6 p-4 bg-yellow-600 text-white rounded-lg">
                    Warning: The backend returned {optimized_routes.length} routes, but only {numberOfVehicles} vehicle(s) are specified. Displaying the first {numberOfVehicles} route(s).
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {limitedRoutes.map((route, index) => {
                    const totalWeight = routeWeights[index];
                    const percentage = totalCapacity > 0
                        ? Math.min((totalWeight / totalCapacity) * 100, 100)
                        : 0;

                    return (
                        <div
                            key={index}
                            className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-light mb-4">Vehicle {index + 1}</h2>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/2 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-light mb-2">Current Truck Capacity</h3>
                                            <TruckLoadingBar percentage={percentage} />
                                            <p className="mt-2 text-gray-400">
                                                Total Weight: {totalWeight} kg ({percentage.toFixed(2)}% of {totalCapacity} kg)
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-light mb-2">Route Stops</h3>
                                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                                                {route.map((point, idx) => (
                                                    <li key={idx}>{point.address || `Lat: ${point.lat}, Lon: ${point.lon}`}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <RouteMap route={routeData[index]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DeliveryResult_multiple;