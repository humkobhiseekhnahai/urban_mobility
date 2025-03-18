//delivery_results
import DeliveryResult_multiple from './delivery_versions/multiple_vehicles';
import DeliveryResult_single from "./delivery_versions/single_vehicle"

const DeliveryResult = ({ totalCapacity, numberOfVehicles, setIsOptimized }) => {
  // Responsive wrapper with consistent padding
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {numberOfVehicles > 1 ? (
        <DeliveryResult_multiple 
          totalCapacity={totalCapacity} 
          numberOfVehicles={numberOfVehicles} 
          setIsOptimized={setIsOptimized} 
        />
      ) : (
        <DeliveryResult_multiple 
          totalCapacity={totalCapacity} 
          numberOfVehicles={numberOfVehicles} 
          setIsOptimized={setIsOptimized} 
        />
      )}
    </div>
  );
};

export default DeliveryResult;
