import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import axios from 'axios';
import { apiResponseAtom, deliveryStopsAtom, startingLocationAtom, markerAtom } from '../../hooks/atoms/atom';
import RouteInput from './routeInput';
import DeliveryMap from './deliveryMap';
import { Inventory } from './inventory';
import { collectRouteData } from '../../lib/collectRouteData';
import DeliveryResult from './delivery_result';

export const Delivery_new = () => {
  const [numberOfVehicles, setNumberOfVehicles] = useState(1);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const [attemptedOptimize, setAttemptedOptimize] = useState(false);
  const [apiResponse, setApiResponse] = useAtom(apiResponseAtom);

  const startingLocation = useAtomValue(startingLocationAtom);
  const deliveryStops = useAtomValue(deliveryStopsAtom);
  const markers = useAtomValue(markerAtom);

  // Calculate total weight of delivery stops
  const totalWeight = deliveryStops.reduce((sum, stop) => sum + (stop.capacity || 0), 0);

  // Validation checks
  const isStartingLocationValid = startingLocation.trim() !== '';
  const allStopsValid = deliveryStops.every(
    stop => stop.location.trim() !== '' && stop.capacity > 0
  );
  const isVehicleInfoValid = numberOfVehicles >= 1 && totalCapacity > 0;
  const isCapacitySufficient = totalCapacity * numberOfVehicles >= totalWeight;
  // New constraint: no single delivery weight exceeds truck capacity
  const isIndividualCapacityValid = deliveryStops.every(stop => stop.capacity <= totalCapacity);
  const isFormValid = isStartingLocationValid && allStopsValid && isVehicleInfoValid && isCapacitySufficient && isIndividualCapacityValid;

  const handleOptimize = async () => {
    setAttemptedOptimize(true);
    if (!isFormValid) return;

    try {
      setLoading(true);
      setError(null);
      setApiResponse(null);

      const stops = [
        { location: startingLocation, capacity: 0 },
        ...deliveryStops,
      ];

      const data = await collectRouteData(stops, markers, totalCapacity, numberOfVehicles);

      const response = await axios.post(
        'http://127.0.0.1:8000/optimize_delivery?method=ga',
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setApiResponse(response.data);
      setIsOptimized(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-900 overflow-x-hidden">
      {isOptimized ? (
        <DeliveryResult totalCapacity={totalCapacity} numberOfVehicles={numberOfVehicles} setIsOptimized={setIsOptimized} />
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          {/* Route Planner Section */}
          <motion.div className="pt-8 pb-6 border-b border-neutral-700">
            <h1 className="text-2xl font-light text-gray-200 mb-2">Route Planner</h1>
            <RouteInput attemptedOptimize={attemptedOptimize} />
          </motion.div>

          {/* Map Section */}
          <motion.div className="my-6 h-[300px] md:h-[550px] flex-shrink-0">
            <div className="text-white border border-neutral-700 rounded-lg overflow-hidden h-full w-full">
              <DeliveryMap />
            </div>
          </motion.div>

          {/* Inputs Section */}
          <motion.div className="mt-8 -mx-4 md:mx-0">
            <div className="flex flex-col md:flex-row md:justify-center md:space-x-4">
              <div className="flex-1 md:max-w-xs border-b border-neutral-700 md:border-b-0 px-4 md:px-0 py-4 md:py-0">
                <label className="block text-sm text-gray-400 mb-1">Vehicle Type</label>
                <input
                  disabled
                  value="Sample Truck"
                  className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex-1 md:max-w-xs border-b border-neutral-700 md:border-b-0 px-4 md:px-0 py-4 md:py-0">
                <label className="block text-sm text-gray-400 mb-1">Capacity (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter capacity"
                  onChange={(e) => setTotalCapacity(Number(e.target.value))}
                  className={`w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 ${
                    attemptedOptimize && totalCapacity <= 0 ? 'border-red-500' : ''
                  }`}
                />
              </div>
              <div className="flex-1 md:max-w-xs border-b border-neutral-700 md:border-b-0 px-4 md:px-0 py-4 md:py-0">
                <label className="block text-sm text-gray-400 mb-1">Number of Vehicles</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter quantity"
                  onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
                  className={`w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 ${
                    attemptedOptimize && numberOfVehicles < 1 ? 'border-red-500' : ''
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Inventory - Pass totalCapacity */}
          <motion.div>
            <Inventory attemptedOptimize={attemptedOptimize} totalCapacity={totalCapacity} />
          </motion.div>

          {/* Optimize Button */}
          <motion.div className="flex justify-center my-8">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-light py-3 px-16 rounded-lg transition-colors disabled:opacity-50"
              onClick={handleOptimize}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Optimizing...
                </span>
              ) : (
                'OPTIMIZE ROUTE'
              )}
            </motion.button>
          </motion.div>

          {/* Error Messages */}
          {attemptedOptimize && !isFormValid && (
            <div className="bg-red-900/20 border border-red-500 text-red-500 p-4 rounded-lg mt-4">
              <p className="font-semibold">Please correct the following errors:</p>
              <ul className="list-disc list-inside">
                {!isStartingLocationValid && <li>Please provide the warehouse location.</li>}
                {!allStopsValid && <li>All delivery stops must have both location and weight greater than 0.</li>}
                {!isVehicleInfoValid && <li>Please provide valid vehicle information (number of vehicles >= 1 and capacity > 0).</li>}
                {!isCapacitySufficient && <li>Total vehicle capacity must be greater than or equal to the total delivery weight.</li>}
                {!isIndividualCapacityValid && <li>No single delivery weight should exceed the truck's capacity.</li>}
              </ul>
            </div>
          )}

          {/* API Error Display */}
          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        </div>
      )}
    </div>
  );
};