import { useState, useEffect } from "react";
import { ChevronDown, RotateCw, Truck } from "lucide-react";

export default function OptimizeRoute({ routes }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStops, setSelectedStops] = useState([]);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedRoute) {
      const route = routes.find((r) => r.id === parseInt(selectedRoute));
      if (route) {
        setSelectedStops([...route.stops]);
      }
    } else {
      setSelectedStops([]);
    }
  }, [selectedRoute, routes]);

  const moveStopUp = (index) => {
    if (index === 0) return;
    const newStops = [...selectedStops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    setSelectedStops(newStops);
  };

  const moveStopDown = (index) => {
    if (index === selectedStops.length - 1) return;
    const newStops = [...selectedStops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    setSelectedStops(newStops);
  };

  const handleOptimize = () => {
    if (!selectedRoute) return;
    setLoading(true);
    setTimeout(() => {
      setOptimizationResult({
        distance: "21.2 miles",
        time: "38 minutes",
        fuel: "1.8 gallons",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-md text-white overflow-hidden">
          <div className="p-4 border-b border-neutral-700">
            <h3 className="text-lg font-medium">Route Optimization</h3>
            <p className="text-gray-400 text-sm">Optimize existing routes for efficiency</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Select Route to Optimize</label>
              <div className="relative">
                <select
                  value={selectedRoute || ""}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full h-10 px-3 bg-neutral-700 border border-neutral-600 rounded-md text-white appearance-none"
                >
                  <option value="" disabled>Choose a route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      RT-{route.id}: {route.origin.name} to {route.destination.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="p-4 rounded-md bg-neutral-700 border border-neutral-600">
              <h3 className="text-lg font-medium mb-2">Current Route Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Total Distance</p>
                  <p className="text-white font-medium">24.5 miles</p>
                </div>
                <div>
                  <p className="text-gray-400">Estimated Time</p>
                  <p className="text-white font-medium">45 minutes</p>
                </div>
                <div>
                  <p className="text-gray-400">Fuel Consumption</p>
                  <p className="text-white font-medium">2.1 gallons</p>
                </div>
                <div>
                  <p className="text-gray-400">Number of Stops</p>
                  <p className="text-white font-medium">{selectedStops.length} stops</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Bus Stop Sequence</h3>
              {selectedStops.length > 0 ? (
                selectedStops.map((stop, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-md border border-neutral-600 bg-neutral-700"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-neutral-600 text-white">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="text-white">{stop.name}</p>
                      <p className="text-sm text-gray-400">Coordinates: {stop.coordinates.join(", ")}</p>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      <button
                        onClick={() => moveStopUp(index)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-white disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveStopDown(index)}
                        disabled={index === selectedStops.length - 1}
                        className="text-gray-400 hover:text-white disabled:opacity-50"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Select a route to view stops</p>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-neutral-700 flex gap-4">
            <button
              onClick={handleOptimize}
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
              disabled={loading || !selectedRoute}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Optimizing...
                </span>
              ) : (
                <>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Run Optimization
                </>
              )}
            </button>
            <button className="flex-1 h-10 border border-neutral-600 text-white hover:bg-neutral-700 rounded-md">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-md text-white h-full">
          <div className="p-4 border-b border-neutral-700">
            <h3 className="text-lg font-medium">Optimization Results</h3>
            <p className="text-gray-400 text-sm">Comparison with current route</p>
          </div>
          <div className="p-6 space-y-6">
            {optimizationResult ? (
              <div className="p-4 rounded-md bg-neutral-700 border border-neutral-600">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-blue-400" />
                  Optimized Route
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-400">Total Distance</p>
                    <div className="flex items-center">
                      <p className="text-white font-medium">{optimizationResult.distance}</p>
                      <span className="ml-2 px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-md">-13.5%</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-400">Estimated Time</p>
                    <div className="flex items-center">
                      <p className="text-white font-medium">{optimizationResult.time}</p>
                      <span className="ml-2 px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-md">-15.6%</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-400">Fuel Consumption</p>
                    <div className="flex items-center">
                      <p className="text-white font-medium">{optimizationResult.fuel}</p>
                      <span className="ml-2 px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-md">-14.3%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">Run optimization to see results</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}