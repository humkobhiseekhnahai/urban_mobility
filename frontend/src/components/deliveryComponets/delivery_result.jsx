import { useAtomValue } from 'jotai';
import { apiResponseAtom } from '../../hooks/atoms/atom';
import TruckLoadingBar from './TruckLoadingBar'; // Your pre-made component
import DeliveryMap from './deliveryMap';

const DeliveryResult = ({ totalCapacity, setIsOptimized }) => {
  const apiResponse = useAtomValue(apiResponseAtom);
  if (!apiResponse) return null;

  const { optimized_routes, loading_plan } = apiResponse;

  // Create a map of items by location for easy lookup
  const itemMap = {};
  loading_plan.forEach((bin) => {
    bin.items.forEach((item) => {
      const key = `${item.lat},${item.lon}`;
      itemMap[key] = { weight: item.weight, address: item.address };
    });
  });

  // Calculate total weight for each route
  const routeWeights = optimized_routes.map((route) => {
    let totalWeight = 0;
    route.forEach((point) => {
      const key = `${point.lat},${point.lon}`;
      if (itemMap[key]) {
        totalWeight += itemMap[key].weight;
      }
    });
    return totalWeight;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-neutral-900 text-gray-200">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light">Optimized Delivery Routes</h1>
        <button
          onClick={() => setIsOptimized(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-light py-2 px-4 rounded-lg transition-colors"
        >
          Back to Input
        </button>
      </div>

      {/* Main Map */}
      <div className="mb-8 border border-neutral-700 rounded-lg overflow-hidden">
        <DeliveryMap routes={optimized_routes} />
      </div>

      {/* Vehicle Sections */}
      {optimized_routes.map((route, index) => {
        const totalWeight = routeWeights[index];
        const percentage = totalCapacity > 0 ? (totalWeight / totalCapacity) * 100 : 0;

        return (
          <div key={index} className="mb-8 p-4 bg-neutral-800 rounded-lg">
            <h2 className="text-xl font-light mb-4">Vehicle {index + 1}</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Truck Capacity Visualization */}
              <div className="w-full md:w-1/2">
                <h3 className="text-lg mb-2">Current Truck Capacity</h3>
                <TruckLoadingBar percentage={percentage} />
              </div>

              {/* Route Details */}
              <div className="w-full md:w-1/2">
                <h3 className="text-lg mb-2">Route Stops</h3>
                <ul className="list-disc list-inside text-gray-400">
                  {route.map((point, idx) => {
                    const key = `${point.lat},${point.lon}`;
                    const item = itemMap[key];
                    return (
                      <li key={idx}>
                        {item ? item.address : `Lat: ${point.lat}, Lon: ${point.lon}`}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-2">
                  Total Weight: {totalWeight} kg ({percentage.toFixed(2)}% of {totalCapacity} kg)
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeliveryResult;