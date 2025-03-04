import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import axios from 'axios';
import { apiResponseAtom, inputAtom, markerAtom } from '../../hooks/atoms/atom';
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
  const [isOptimized, setIsOptimized] = useState(false); // New state
  const [apiResponse, setApiResponse] = useAtom(apiResponseAtom);
  const [routeData, setRouteData] = useState(null); // State to hold route data

  const stops = useAtomValue(inputAtom);
  const markers = useAtomValue(markerAtom);

  const handleOptimize = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiResponse(null);

      const data = await collectRouteData(
        stops,
        markers,
        totalCapacity,
        numberOfVehicles
      );

      setRouteData(data); // Store route data in state

      const response = await axios.post(
        'http://127.0.0.1:8000/optimize_delivery?method=ga',
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setApiResponse(response.data);
      setIsOptimized(true); // Switch to result page
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error('API Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-900 overflow-x-hidden">
      {isOptimized ? (
        <DeliveryResult
          totalCapacity={totalCapacity}
          setIsOptimized={setIsOptimized}
        />
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          {/* Route Planner Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-8 pb-6 border-b border-neutral-700"
          >
            <h1 className="text-2xl font-light text-gray-200 mb-2">Route Planner</h1>
            <RouteInput />
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="my-6 h-[300px] md:h-[550px] flex-shrink-0"
          >
            <div className="text-white border border-neutral-700 rounded-lg overflow-hidden h-full w-full">
              <DeliveryMap />
            </div>
          </motion.div>

          {/* Inputs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 -mx-4 md:mx-0"
          >
            <div className="flex flex-col md:flex-row md:justify-center md:space-x-4">
              <div className="flex-1 md:max-w-xs border-b border-neutral-700 md:border-b-0 px-4 md:px-0 py-4 md:py-0">
                <label className="block text-sm text-gray-400 mb-1">Vehicle Type</label>
                <input
                  disabled
                  value="Sample Truck"
                  className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors duration-300 cursor-not-allowed"
                />
              </div>
              <div className="flex-1 md:max-w-xs border-b border-neutral-700 md:border-b-0 px-4 md:px-0 py-4 md:py-0">
                <label className="block text-sm text-gray-400 mb-1">Capacity (kg)</label>
                <input
                  type="number"
                  placeholder="Enter capacity"
                  onChange={(e) => setTotalCapacity(Number(e.target.value))}
                  className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors duration-300 placeholder-gray-500"
                />
              </div>
              <div className="flex-1 md:max-w-xs border-b border-neutral-700 md:border-b-0 px-4 md:px-0 py-4 md:py-0">
                <label className="block text-sm text-gray-400 mb-1">Number of Vehicles</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
                  className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors duration-300 placeholder-gray-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Inventory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Inventory />
          </motion.div>

          {/* Route Data Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="my-6"
          >
            {routeData && (
              <div className="text-white">
                <h2 className="text-lg font-light mb-2">Route Data:</h2>
                <pre className="bg-neutral-800 p-4 rounded-lg">
                  {JSON.stringify(routeData, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>

          {/* Optimize Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center my-8"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-light py-3 px-16 rounded-lg transition-colors disabled:opacity-50"
              onClick={handleOptimize}
              disabled={loading}
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

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </div>
      )}
    </div>
  );
};
