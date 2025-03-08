import DeliveryResult_multiple from './delivery_versions/multiple_vehicles';
import DeliveryResult_single from "./delivery_versions/single_vehicle"

const DeliveryResult = ({ totalCapacity, numberOfVehicles, setIsOptimized }) => {
  if (numberOfVehicles > 1) {
    return (
      <DeliveryResult_multiple totalCapacity={totalCapacity} numberOfVehicles={numberOfVehicles} setIsOptimized={setIsOptimized} />
    );
  } else {
    return (
      <DeliveryResult_single totalCapacity={totalCapacity} numberOfVehicles={numberOfVehicles} setIsOptimized={setIsOptimized} />
    );
  }
};
export default DeliveryResult;
