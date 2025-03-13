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
  const allStopsValid = deliveryStops.every((stop) => stop.location.trim() !== "" && stop.capacity > 0);
  const isVehicleInfoValid = numberOfVehicles >= 1 && totalCapacity > 0;
  const isCapacitySufficient = totalCapacity * numberOfVehicles >= totalWeight;
  const isIndividualCapacityValid = deliveryStops.every((stop) => stop.capacity <= totalCapacity);
  const isFormValid =
    isStartingLocationValid && allStopsValid && isVehicleInfoValid && isCapacitySufficient && isIndividualCapacityValid;

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
        ? "http://127.0.0.1:8000/optimize_delivery?method=ga&ecomode=true"
        : "http://127.0.0.1:8000/optimize_delivery?method=ga";
      const response = await axios.post(url, data, { headers: { "Content-Type": "application/json" } });

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
    <div className="w-full min-h-screen bg-neutral-900 overflow-x-hidden">
      {isOptimized ? (
        <DeliveryResult
          totalCapacity={totalCapacity}
          numberOfVehicles={numberOfVehicles}
          setIsOptimized={setIsOptimized}
        />
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          {/* Route Planner Section */}
          <motion.div className="pt-8 pb-6 border-b border-neutral-700">
            <h1 className="text-2xl font-light text-gray-200 mb-2">Route Planner</h1>
            <RouteInput attemptedOptimize={attemptedOptimize} />
          </motion.div>

          {/* Map Section */}
          <motion.div className="my-6 h-[200px] sm:h-[300px] md:h-[550px] w-full">
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
                    attemptedOptimize && totalCapacity <= 0 ? "border-red-500" : ""
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
                    attemptedOptimize && numberOfVehicles < 1 ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Inventory */}
          <motion.div>
            <Inventory attemptedOptimize={attemptedOptimize} totalCapacity={totalCapacity} />
          </motion.div>

          {/* Optimize Button and Eco Toggle */}
          <motion.div className="flex justify-center items-center gap-4 my-8">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-light py-3 px-12 rounded-lg transition-colors disabled:opacity-50"
              onClick={handleOptimize}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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
                "OPTIMIZE ROUTE"
              )}
            </motion.button>

            <div className="flex items-center">
              <motion.button
                onClick={toggleEcoMode}
                title="Toggle Eco Mode: Optimizes for fuel efficiency"
                className={`relative flex items-center h-7 w-16 rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${
                  ecoMode ? "bg-green-500 shadow-[0_0_10px_2px_rgba(34,197,94,0.5)]" : "bg-gray-600"
                }`}
                whileTap={{ scale: 0.95 }}
                aria-pressed={ecoMode}
                aria-label="Toggle eco mode"
              >
                <span
                  className={`absolute text-xs font-bold transition-opacity duration-300 ease-in-out ${
                    ecoMode ? "opacity-0" : "opacity-100 text-gray-300 left-2"
                  }`}
                >
                  ECO
                </span>
                <motion.div
                  className="absolute flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-md"
                  initial={false}
                  animate={{ x: ecoMode ? "calc(100% - 20px)" : "2px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z"></path> <rect width="24" height="24" fill="none"></rect> </g></svg>
                </motion.div>
                <span
                  className={`absolute text-xs font-bold transition-opacity duration-300 ease-in-out ${
                    ecoMode ? "opacity-100 text-white right-2" : "opacity-0"
                  }`}
                >
                  ECO
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Error Messages */}
          {attemptedOptimize && !isFormValid && (
            <div className="bg-red-900/20 border border-red-500 text-red-500 p-4 rounded-lg mt-4 max-w-full overflow-auto">
              <p className="font-semibold">Please correct the following errors:</p>
              <ul className="list-disc list-inside">
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
          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        </div>
      )}
    </div>
  );
};