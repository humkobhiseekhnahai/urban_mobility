//delivery_main
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Route Planner Section */}
          <motion.div className="pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-neutral-700">
            <h1 className="text-xl sm:text-2xl font-light text-gray-200 mb-2">Route Planner</h1>
            <RouteInput attemptedOptimize={attemptedOptimize} />
          </motion.div>

          {/* Map Section */}
          <motion.div className="my-4 sm:my-6 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[550px] w-full">
            <div className="text-white border border-neutral-700 rounded-lg overflow-hidden h-full w-full">
              <DeliveryMap />
            </div>
          </motion.div>

          {/* Inputs Section */}
          <motion.div className="mt-6 sm:mt-8 -mx-4 sm:mx-0">
            <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4">
              <div className="flex-1 sm:max-w-xs border-b border-neutral-700 sm:border-b-0 px-4 sm:px-0 py-3 sm:py-4">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1">Vehicle Type</label>
                <input
                  disabled
                  value="Sample Truck"

                  className="w-full bg-neutral-800 text-gray-300 border-b border-neutral-600 py-1 sm:py-2 px-1 focus:outline-none cursor-not-allowed text-sm sm:text-base"

                />
              </div>
              <div className="flex-1 sm:max-w-xs border-b border-neutral-700 sm:border-b-0 px-4 sm:px-0 py-3 sm:py-4">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1">Capacity (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter capacity"
                  onChange={(e) => setTotalCapacity(Number(e.target.value))}

                  className={`w-full bg-neutral-800 text-gray-200 border-b border-gray-600 py-1 sm:py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 text-sm sm:text-base ${
                    attemptedOptimize && totalCapacity <= 0 ? "border-red-500 ring-1 ring-red-500" : ""

                  }`}
                />
              </div>
              <div className="flex-1 sm:max-w-xs border-b border-neutral-700 sm:border-b-0 px-4 sm:px-0 py-3 sm:py-4">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1">Number of Vehicles</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter quantity"
                  onChange={(e) => setNumberOfVehicles(Number(e.target.value))}

                  className={`w-full bg-neutral-800 text-gray-200 border-b border-gray-600 py-1 sm:py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 text-sm sm:text-base ${
                    attemptedOptimize && numberOfVehicles < 1 ? "border-red-500 ring-1 ring-red-500" : ""

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
          <motion.div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-6 sm:my-8">
            {/* Optimize Route Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}

              className="bg-blue-600 hover:bg-blue-700 text-white font-light py-2 sm:py-3 px-8 sm:px-12 rounded-lg transition-colors disabled:bg-blue-800disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base"

              onClick={handleOptimize}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
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

            {/* Eco Mode Toggle Button */}
            <div className="flex items-center mt-3 sm:mt-0">
              <motion.button
                onClick={toggleEcoMode}
                title="Toggle Eco Mode: Optimizes for fuel efficiency"

                className={`relative flex items-center justify-center h-8 sm:h-7 w-[90px] sm:w-[50px] rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-inner ${
                  ecoMode ? "bg-green-500 shadow-[0_0_10px_2px_rgba(34,197,94,0.5)] focus:ring-green-500" : "bg-neutral-600 focus:ring-blue-500"

                }`}
                whileTap={{ scale: 0.95 }}
                aria-pressed={ecoMode}
                aria-label="Toggle eco mode"
              >
                {/* ECO Text Centered */}
                {/* <span
                  className={`text-xs sm:text-sm font-semibold select-none z-[1] pointer-events-none ${
                    ecoMode ? "text-white" : "text-gray-600"
                  }`}
                >
                  ECO
                </span> */}

                {/* Leaf Icon Moving Circle */}
                <motion.div
<motion.div
  className="absolute flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-md"
  initial={false}
  animate={{ x: ecoMode ? "calc(100% - 20px)" : "2px" }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
    className="w-3 h-3"
  >
    <g id="SVGRepo_iconCarrier">
      <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z"></path>
      <rect width="24" height="24" fill="none"></rect>
    </g>
  </svg>
</motion.div>

<span
  className={`absolute text-xs font-bold transition-opacity duration-300 ease-in-out ${
    ecoMode ? "opacity-100 text-white right-2" : "opacity-0"
  }`}
>
  Eco Mode
</span>

                  }`}
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] transition-colors duration-300 ${
                      ecoMode ? "fill-green-500" : "fill-gray-400"
                    }`}
                    animate={{
                      rotate: ecoMode ? [0, -15, 15, -5, 0] : [0],
                      scale: ecoMode ? [1, 1.2, 1] : [1],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3c-1,.2-8,.45-13,.45S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z" />
                  </motion.svg>
                </motion.div>
              </motion.button>
            </div>
          </motion.div>

          {/* Error Messages */}
          {attemptedOptimize && !isFormValid && (

            <div className="bg-red-900/30 border border-red-500/70 text-red-400 p-3 sm:p-4 rounded-lg mt-4 max-w-full overflow-auto text-xs sm:text-sm">

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

          {error && <div className="bg-red-900/30 border border-red-500/70 text-red-400 text-center mt-4 text-sm sm:text-base">{error}</div>}

        </div>
      )}
    </div>
  );
};
