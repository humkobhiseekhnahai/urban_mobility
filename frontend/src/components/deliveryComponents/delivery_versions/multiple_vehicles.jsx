//multiple_vehicles
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { apiResponseAtom, startingLocationAtom } from '../../../hooks/atoms/atom';
import TruckLoadingBar from '../truckLoadingBar';
import RouteMap from '../routeDeliveryMap';
import { getRouteCoordinates } from '../../../lib/getRouteCoordinates';

const DeliveryResult_multiple = ({ totalCapacity, numberOfVehicles, setIsOptimized }) => {
    const apiResponse = useAtomValue(apiResponseAtom);
    const startingLocation = useAtomValue(startingLocationAtom);

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

    const routeData = getRouteCoordinates(startingLocation, apiResponse);
    console.log(routeData);

    // Create itemMap for weight and address lookup
    const itemMap = {};
    loading_plan.forEach((bin) => {
        bin.items.forEach((item) => {
            const key = `${item.lat},${item.lon}`;
            itemMap[key] = { weight: item.weight, address: item.address };
        });
    });

    // Calculate total weight for each route based on items in the route
    const routeWeights = optimized_routes.map((route) => {
        return route.reduce((sum, point) => {
            const key = `${point.lat},${point.lon}`;
            const item = itemMap[key];
            return sum + (item ? item.weight : 0);
        }, 0);
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 bg-neutral-900 text-gray-200 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                <h1 className="text-xl sm:text-2xl font-light">Optimized Delivery Routes</h1>
                <button
                    onClick={() => setIsOptimized(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-light py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                >
                    Back to Input
                </button>
            </div>

            {optimized_routes.length > numberOfVehicles && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-600 text-white rounded-lg text-xs sm:text-sm">
                    Warning: The backend returned {optimized_routes.length} routes, but only {numberOfVehicles} vehicle(s) are specified. Displaying the first {numberOfVehicles} route(s).
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:gap-8">
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
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-light mb-3 sm:mb-4">Vehicle {index + 1}</h2>
                                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                                    <div className="w-full md:w-1/2 space-y-3 sm:space-y-4">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-light mb-1 sm:mb-2">Current Truck Capacity</h3>
                                            <div className="h-[100px] sm:h-[120px] md:h-[150px]">
                                                <TruckLoadingBar percentage={percentage} />
                                            </div>
                                            <p className="mt-1 sm:mt-2 text-gray-400 text-xs sm:text-sm">
                                                Total Weight: {totalWeight} kg ({percentage.toFixed(2)}% of {totalCapacity} kg)
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-light mb-1 sm:mb-2">Route Stops</h3>
                                            <ul className="list-disc list-inside text-gray-400 space-y-1 text-xs sm:text-sm">
                                                {route.map((point, idx) => (
                                                    <li key={idx} className="truncate">
                                                        {point.address || `Lat: ${point.lat}, Lon: ${point.lon}`}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-[350px] mt-3 md:mt-0">
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
