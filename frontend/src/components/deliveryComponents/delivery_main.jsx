

import { useState } from "react";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import axios from "axios";
import { apiResponseAtom, deliveryStopsAtom, startingLocationAtom, markerAtom } from "../../hooks/atoms/atom";
import RouteInput from "./routeInput";
import DeliveryMap from "./deliveryMap";
import { Inventory } from "./inventory";
import { collectRouteData } from "../../lib/collectRouteData";
import DeliveryResult from "./delivery_result";

export const Delivery_new = () => {
  const [numberOfVehicles, setNumberOfVehicles] = useState(1);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const [attemptedOptimize, setAttemptedOptimize] = useState(false);
  const [apiResponse, setApiResponse] = useAtom(apiResponseAtom);
  const [ecoMode, setEcoMode] = useState(false);

  const startingLocation = useAtomValue(startingLocationAtom);
  const deliveryStops = useAtomValue(deliveryStopsAtom);
  const markers = useAtomValue(markerAtom);

  const totalWeight = deliveryStops.reduce((sum, stop) => sum + (stop.capacity || 0), 0);

  const isStartingLocationValid = startingLocation.trim() !== "";
  const allStopsValid = deliveryStops.every(
    (stop) => stop.location.trim() !== "" && stop.capacity > 0
  );
  const isVehicleInfoValid = numberOfVehicles >= 1 && totalCapacity > 0;
  const isCapacitySufficient = totalCapacity * numberOfVehicles >= totalWeight;
  const isIndividualCapacityValid = deliveryStops.every((stop) => stop.capacity <= totalCapacity);
  const isFormValid =
    isStartingLocationValid &&
    allStopsValid &&
    isVehicleInfoValid &&
    isCapacitySufficient &&
    isIndividualCapacityValid;

  const handleOptimize = async () => {
    setAttemptedOptimize(true);
    if (!isFormValid) return;

    try {
      setLoading(true);
      setError(null);
      setApiResponse(null);

      const stops = [{ location: startingLocation, capacity: 0 }, ...deliveryStops];
      const data = await collectRouteData(stops, markers, totalCapacity, numberOfVehicles);
      const url = ecoMode
        ? "http://127.0.0.1:8000/optimize_delivery?ecomode=true"
        : "http://127.0.0.1:8000/optimize_delivery?method=ga";
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
      });

      setApiResponse(response.data);
      setIsOptimized(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEcoMode = () => setEcoMode(!ecoMode);

  return (
    <div className="w-full min-h-screen bg-neutral-950 overflow-x-hidden">
      {isOptimized ? (
        <DeliveryResult
          totalCapacity={totalCapacity}
          numberOfVehicles={numberOfVehicles}
          setIsOptimized={setIsOptimized}
        />
      ) : (

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Route Planner Section */}
          <motion.div className="pb-6 border-b border-neutral-700 mb-8">
            <h1 className="text-2xl font-medium text-white mb-4">Route Planner</h1>

            <RouteInput attemptedOptimize={attemptedOptimize} />
          </motion.div>

          {/* Map Section */}

          <motion.div className="my-6 h-[300px] md:h-[400px] lg:h-[500px] w-full">
            <div className="h-full w-full border border-neutral-700 rounded-lg overflow-hidden">

              <DeliveryMap />
            </div>
          </motion.div>

          {/* Inputs Section */}

          <motion.div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Vehicle Type</label>
                <input
                  disabled
                  value="Sample Truck"
                  className="w-full bg-neutral-800 text-gray-200 border border-neutral-700 rounded-md px-3 py-2 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Capacity (kg)</label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter capacity"
                  onChange={(e) => setTotalCapacity(Number(e.target.value))}

                  className={`w-full bg-neutral-800 text-gray-200 border ${
                    attemptedOptimize && totalCapacity <= 0 ? "border-red-500" : "border-neutral-700"
                  } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Number of Vehicles</label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter quantity"
                  onChange={(e) => setNumberOfVehicles(Number(e.target.value))}

                  className={`w-full bg-neutral-800 text-gray-200 border ${
                    attemptedOptimize && numberOfVehicles < 1 ? "border-red-500" : "border-neutral-700"
                  } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}

                />
              </div>
            </div>
          </motion.div>


          {/* Inventory Section */}
          <motion.div className="mt-6">
            <Inventory attemptedOptimize={attemptedOptimize} totalCapacity={totalCapacity} />
          </motion.div>

          {/* Optimize Button and Eco Toggle Section */}
        <motion.div className="mt-8 mb-10">
           <div className="max-w-md mx-auto bg-neutral-800 rounded-lg p-6 shadow-sm border border-neutral-700">
            {/* Eco Mode Toggle */}
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                      <motion.svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  className={`w-5 h-5 transition-colors duration-300 ${
    ecoMode ? "text-green-500" : "text-white"
  }`}
  fill="currentColor" // Add this line
  animate={{
    rotate: ecoMode ? [0, -15, 15, -5, 0] : [0],
    scale: ecoMode ? [1, 1.2, 1] : [1],
  }}
  transition={{ duration: 0.5 }}
>
  <path 
    d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3c-1,.2-8,.45-13,.45S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z" 
    fill="currentColor" // And/or add this line
  />
</motion.svg>

        <span className="text-sm text-gray-200">Eco-Friendly Routing</span>
      </div>
      <motion.button
        onClick={toggleEcoMode}
        title="Toggle Eco Mode: Optimizes for fuel efficiency"
        className="relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        whileTap={{ scale: 0.95 }}
        aria-pressed={ecoMode}
        aria-label="Toggle eco mode"
      >
        <span
          className={`absolute h-6 w-11 rounded-full transition-colors duration-300 ${
            ecoMode ? "bg-green-500" : "bg-neutral-700"
          }`}
        />
        <span
          className={`${
            ecoMode ? "translate-x-5" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
        />
      </motion.button>
    </div>

    {/* Optimize Button */}
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200 flex items-center justify-center"
      onClick={handleOptimize}
      disabled={loading || !isFormValid}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Optimizing...
        </span>
      ) : (
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Optimize Delivery Route
        </span>
      )}
    </motion.button>

    {/* Additional Info */}
    <p className="mt-4 text-xs text-center text-gray-400">
      {ecoMode
        ? "Eco mode enabled: Optimizing for reduced emissions and fuel efficiency"
        : "Standard optimization: Balancing time and distance"}
    </p>
  </div>
</motion.div>


          {/* Form Error Messages */}

          {attemptedOptimize && !isFormValid && (
            <div className="bg-red-900/20 border border-red-500 text-red-500 p-3 sm:p-4 rounded-lg mt-4 max-w-full overflow-auto text-xs sm:text-sm">
              <p className="font-semibold">Please correct the following errors:</p>
              <ul className="list-disc list-inside mt-1 sm:mt-2">
                {!isStartingLocationValid && <li>Please provide the warehouse location.</li>}
                {!allStopsValid && <li>All delivery stops must have both location and weight greater than 0.</li>}
                {!isVehicleInfoValid && (
                  <li>Please provide valid vehicle information (number of vehicles &gt;= 1 and capacity &gt; 0).</li>
                )}
                {!isCapacitySufficient && (
                  <li>Total vehicle capacity must be greater than or equal to the total delivery weight.</li>
                )}
                {!isIndividualCapacityValid && <li>No single delivery weight should exceed the truck's capacity.</li>}
              </ul>
            </div>
          )}


          {/* API Error Display */}
          {error && <div className="mt-4 text-center text-sm text-red-600">{error}</div>}
        </div>
      )}
    </div>
  );
};

