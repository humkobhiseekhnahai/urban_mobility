import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { apiResponseAtom, startingLocationAtom } from '../../hooks/atoms/atom';
import TruckLoadingBar from './TruckLoadingBar';
import RouteMap from './routeDeliveryMap';

const DeliveryResult = ({ totalCapacity, numberOfVehicles, setIsOptimized }) => {
    const apiResponse = useAtomValue(apiResponseAtom);
    const startingLocation = useAtomValue(startingLocationAtom); // e.g., { lat: 17.385, lon: 78.4867 }

    // Return null if no API response
    if (!apiResponse) return null;

    const { optimized_routes, loading_plan } = apiResponse;

    // Create a map of items by location for weight and address lookup
    const itemMap = {};
    loading_plan.forEach((bin) => {
        bin.items.forEach((item) => {
            const key = `${item.lat},${item.lon}`;
            itemMap[key] = { weight: item.weight, address: item.address };
        });
    });

    // Since backend returns only stops, prepend starting location to each route
    const fullRoutes = optimized_routes.map((route) => [startingLocation, ...route]);

    // Limit the number of routes to numberOfVehicles
    const limitedRoutes = fullRoutes.slice(0, numberOfVehicles);

    // Calculate total weight for each route (exclude starting location)
    const routeWeights = limitedRoutes.map((route) => {
        let totalWeight = 0;
        route.forEach((point, index) => {
            const key = `${point.lat},${point.lon}`;
            // Skip the starting location (first point in each route)
            if (index > 0 && itemMap[key]) {
                totalWeight += itemMap[key].weight;
            }
        });
        return totalWeight;
    });

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-neutral-900 text-gray-200 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-light">Optimized Delivery Routes</h1>
                <button
                    onClick={() => setIsOptimized(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-light py-2 px-4 rounded-lg transition-colors"
                >
                    Back to Input
                </button>
            </div>

            {/* Warning if routes exceed numberOfVehicles */}
            {optimized_routes.length > numberOfVehicles && (
                <div className="mb-6 p-4 bg-yellow-600 text-white rounded-lg">
                    Warning: The backend returned {optimized_routes.length} routes, but only {numberOfVehicles} vehicle(s) are specified. Displaying the first {numberOfVehicles} route(s).
                </div>
            )}

            {/* Truck Cards with Maps */}
            <div className="grid grid-cols-1 gap-8">
                {limitedRoutes.map((route, index) => {
                    const totalWeight = routeWeights[index];
                    const percentage = totalCapacity > 0 ? (totalWeight / totalCapacity) * 100 : 0;

                    return (
                        <div
                            key={index}
                            className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-light mb-4">Vehicle {index + 1}</h2>
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Truck Visualization and Route Details */}
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
                                                {route.map((point, idx) => {
                                                    const key = `${point.lat},${point.lon}`;
                                                    const item = itemMap[key];
                                                    const label = idx === 0 ? 'Warehouse' : (item ? item.address : `Lat: ${point.lat}, Lon: ${point.lon}`);
                                                    return <li key={idx}>{label}</li>;
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    {/* Map for this Route */}
                                    <div className="w-full md:w-1/2 h-80">
                                        <RouteMap
                                            route={route}
                                        />
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

export default DeliveryResult;