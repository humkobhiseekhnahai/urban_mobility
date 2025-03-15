import { useState, useEffect, useRef } from "react";
import {
  RotateCw,
  Truck,
  Search,
  ChevronUp,
  ChevronDown,
  MapPin,
  Route as RouteIcon,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OptimizeRoute() {
  // State declarations
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStops, setSelectedStops] = useState([]);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [routeListOpen, setRouteListOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Ref for the last route element (for infinite scrolling)
  const lastRouteElementRef = useRef(null);

  // Fetch routes from the API endpoint
  const fetchRoutes = async (page = 1) => {
    setFetchingMore(true);
    const endpoint = `http://localhost:3001/api/bus-routes?page=${page}&limit=10`;
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      if (page === 1) {
        setRoutes(data.data);
      } else {
        setRoutes((prevRoutes) => [...prevRoutes, ...data.data]);
      }
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setTimeout(() => {
        setFetchingMore(false);
      }, 2000);
    }
  };

  // Infinite scroll setup
  useEffect(() => {
    if (!routeListOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && currentPage < totalPages && !fetchingMore) {
          fetchRoutes(currentPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = lastRouteElementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [routeListOpen, currentPage, totalPages, fetchingMore]);

  // Toggle the route dropdown
  const toggleRouteList = () => {
    setRouteListOpen((prev) => {
      const newState = !prev;
      if (newState) {
        setRoutes([]);
        setCurrentPage(1);
        setTotalPages(1);
        fetchRoutes(1);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
      return newState;
    });
  };

  // Filter routes based on the search query
  const filteredRoutes = routes.filter((route) => {
    const query = searchQuery.toLowerCase();
    return (
      route.routeName.toLowerCase().includes(query) ||
      route.routeNumber.toLowerCase().includes(query)
    );
  });

  // When a route is selected, parse its stops from mapJsonContent
  useEffect(() => {
    if (selectedRoute) {
      const route = routes.find((r) => r.id === parseInt(selectedRoute));
      if (route && route.mapJsonContent) {
        try {
          const parsedStops = JSON.parse(route.mapJsonContent);
          const stops = parsedStops.map((stop) => {
            const name = stop.busstop.split(",")[0].trim();
            const coordinates = stop.latlons.map(Number);
            return { name, coordinates };
          });
          setSelectedStops(stops);
        } catch (error) {
          console.error("Error parsing mapJsonContent:", error);
          setSelectedStops([]);
        }
      } else {
        setSelectedStops([]);
      }
    } else {
      setSelectedStops([]);
    }
  }, [selectedRoute, routes]);

  // Reorder stop: move up
  const moveStopUp = (index) => {
    if (index === 0) return;
    const newStops = [...selectedStops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    setSelectedStops(newStops);
  };

  // Reorder stop: move down
  const moveStopDown = (index) => {
    if (index === selectedStops.length - 1) return;
    const newStops = [...selectedStops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    setSelectedStops(newStops);
  };

  // Simulate route optimization with a 1-second delay
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

  // Refresh functionality (triggered by refresh icon in header)
  const handleRefresh = () => {
    setRoutes([]);
    setCurrentPage(1);
    setTotalPages(1);
    setSelectedRoute(null);
    setSearchQuery("");
    setSelectedStops([]);
    setOptimizationResult(null);
    setLoading(false);
    setFetchingMore(false);
    setRouteListOpen(false);
    fetchRoutes(1);
  };

  // Close dropdown when clicking outside (using event delegation)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        routeListOpen &&
        !event.target.closest(".route-dropdown") &&
        !event.target.closest(".search-box")
      ) {
        setRouteListOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [routeListOpen]);

  // Utility: get a consistent color based on route number
  const getRouteColor = (routeNumber) => {
    const hash = routeNumber.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Current route details for display
  const currentRouteObj = routes.find((r) => r.id === parseInt(selectedRoute));
  const origin = currentRouteObj?.origin || "N/A";
  const destination =
    selectedStops.length > 0 ? selectedStops[selectedStops.length - 1].name : "N/A";
  const numStops = selectedStops.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <motion.div
          className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg text-white overflow-hidden"
          whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Route Optimization
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Optimize existing routes for efficiency
              </p>
            </div>
            {/* Refresh Icon beside header */}
            <motion.div
              onClick={handleRefresh}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-500/10 p-2 rounded-full cursor-pointer"
            >
              <RotateCw className="h-5 w-5 text-blue-400" />
            </motion.div>
          </div>
          <div className="p-6 space-y-6 relative">
            {/* Search Box (click to toggle dropdown) */}
            <motion.div
              className="relative search-box"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="flex items-center h-11 pl-3 pr-4 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white cursor-pointer hover:border-blue-500/50 transition-all duration-200"
                onClick={toggleRouteList}
              >
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                {selectedRoute ? (
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                      style={{
                        backgroundColor: currentRouteObj
                          ? getRouteColor(currentRouteObj.routeNumber)
                          : "#3b82f6",
                      }}
                    >
                      <RouteIcon className="h-3 w-3 text-white" />
                    </div>
                    <span>
                      {currentRouteObj?.routeNumber}: {currentRouteObj?.routeName}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400">Select a route...</span>
                )}
                <Menu className="h-4 w-4 text-gray-400 ml-auto" />
              </div>

              <AnimatePresence>
                {routeListOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full mt-2 route-dropdown"
                  >
                    <div className="w-full bg-neutral-800/90 backdrop-blur-sm border border-neutral-700 rounded-lg shadow-xl overflow-hidden">
                      {/* Dropdown Search Input */}
                      <div className="relative border-b border-neutral-700">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search routes..."
                          className="w-full h-11 pl-10 pr-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                        />
                      </div>

                      {/* Routes List */}
                      <div className="max-h-60 overflow-y-auto">
                        {filteredRoutes.length > 0 ? (
                          <>
                            {filteredRoutes.map((route, index) => {
                              const isLast =
                                index === filteredRoutes.length - 1 && currentPage < totalPages;
                              const routeColor = getRouteColor(route.routeNumber);
                              return (
                                <motion.div
                                  key={route.id}
                                  ref={isLast ? lastRouteElementRef : null}
                                  className={`cursor-pointer p-3 border-b border-neutral-700/50 hover:bg-neutral-700/50 ${
                                    selectedRoute === route.id.toString()
                                      ? "bg-blue-500/10 border-l-4 border-l-blue-500"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedRoute(route.id.toString());
                                    setRouteListOpen(false);
                                  }}
                                  whileHover={{ x: 4 }}
                                  transition={{ duration: 0.1 }}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                      style={{ backgroundColor: routeColor }}
                                    >
                                      <RouteIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{route.routeName}</p>
                                      <p className="text-xs text-gray-400">
                                        Route {route.routeNumber}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                            {fetchingMore && (
                              <div className="flex justify-center py-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                                ></motion.div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="p-3 text-gray-400">No routes found</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Current Route Details */}
            <motion.div
              className="p-5 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-blue-400" />
                Current Route Details
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <p className="text-gray-400">Origin</p>
                  <p className="text-white font-medium ml-auto">{origin}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <p className="text-gray-400">Destination</p>
                  <p className="text-white font-medium ml-auto">{destination}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <p className="text-gray-400">Number of Stops</p>
                  <p className="text-white font-medium ml-auto">{numStops} stops</p>
                </div>
              </div>
            </motion.div>

            {/* Bus Stop Sequence */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Bus Stop Sequence</h3>
              {selectedStops.length > 0 ? (
                <div className="space-y-2">
                  {selectedStops.map((stop, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg border border-neutral-700 bg-neutral-800 hover:border-blue-500/50 transition-colors duration-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="text-white font-medium">{stop.name}</p>
                        <p className="text-xs text-gray-400">
                          Coordinates: {stop.coordinates?.join(", ") || "N/A"}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex gap-1">
                        <motion.button
                          onClick={() => moveStopUp(index)}
                          disabled={index === 0}
                          className="p-1 rounded-full bg-neutral-700 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 disabled:opacity-30 disabled:hover:bg-neutral-700 disabled:hover:text-gray-300 transition-colors duration-150"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => moveStopDown(index)}
                          disabled={index === selectedStops.length - 1}
                          className="p-1 rounded-full bg-neutral-700 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 disabled:opacity-30 disabled:hover:bg-neutral-700 disabled:hover:text-gray-300 transition-colors duration-150"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.p
                  className="text-gray-400 text-center py-8 italic border border-dashed border-neutral-700 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Select a route to view stops
                </motion.p>
              )}
            </div>
          </div>

          {/* Action Button: Run Optimization */}
          <div className="p-5 border-t border-neutral-800">
            <motion.button
              onClick={handleOptimize}
              className="w-full h-12 bg-gradient-to-r from-blue-6
00 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
              disabled={loading || !selectedRoute}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
            >
              {loading ? (
                <span className="flex items-center">
                  <motion.svg
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
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
                  </motion.svg>
                  Optimizing...
                </span>
              ) : (
                <>
                  <RotateCw className="mr-2 h-5 w-5" />
                  Run Optimization
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel: Optimization Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.div
          className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg text-white h-full"
          whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Optimization Results
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Comparison with current route
              </p>
            </div>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-green-500/10 p-2 rounded-full"
            >
              <Truck className="h-5 w-5 text-green-400" />
            </motion.div>
          </div>
          <div className="p-6 flex justify-center items-center h-full">
            <AnimatePresence mode="wait">
              {optimizationResult ? (
                <motion.div
                  className="w-full p-5 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-lg"
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Truck className="mr-3 h-6 w-6 text-green-400" />
                    Optimized Route
                  </h3>
                  <div className="space-y-4">
                    <motion.div
                      className="flex justify-between items-center p-3 rounded-lg bg-neutral-800/50"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="text-gray-300">Total Distance</p>
                      <div className="flex items-center">
                        <p className="text-white font-medium text-lg">
                          {optimizationResult.distance}
                        </p>
                        <motion.span
                          className="ml-3 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-md"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                        >
                          -13.5%
                        </motion.span>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex justify-between items-center p-3 rounded-lg bg-neutral-800/50"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-gray-300">Estimated Time</p>
                      <div className="flex items-center">
                        <p className="text-white font-medium text-lg">
                          {optimizationResult.time}
                        </p>
                        <motion.span
                          className="ml-3 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-md"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          -15.6%
                        </motion.span>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex justify-between items-center p-3 rounded-lg bg-neutral-800/50"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-gray-300">Fuel Consumption</p>
                      <div className="flex items-center">
                        <p className="text-white font-medium text-lg">
                          {optimizationResult.fuel}
                        </p>
                        <motion.span
                          className="ml-3 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-md"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                        >
                          -14.3%
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="text-center p-8"
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-40"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  >
                    <Truck size={64} />
                  </motion.div>
                  <p className="text-gray-400">Run optimization to see results</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}