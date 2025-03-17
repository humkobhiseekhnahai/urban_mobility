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
  Clock,
  ArrowRight,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MapComponent from "./map_optimize";

export default function OptimizeRoute() {
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
  const [departureTime, setDepartureTime] = useState("");
  const [contentHeight, setContentHeight] = useState("auto");
  const [panelsHeight, setPanelsHeight] = useState("auto");

  const searchInputRef = useRef(null);
  const lastRouteElementRef = useRef(null);
  const resultsRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const panelsContainerRef = useRef(null);

  // Set up ResizeObserver for equal panel heights
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const containerHeight = entries[0].contentRect.height;
      if (containerHeight > 0) {
        setPanelsHeight(`${containerHeight}px`);
      }
    });

    if (panelsContainerRef.current) {
      observer.observe(panelsContainerRef.current);
    }

    return () => {
      if (panelsContainerRef.current) {
        observer.unobserve(panelsContainerRef.current);
      }
      observer.disconnect();
    };
  }, []);

  // Fetch routes from API
  const fetchRoutes = async (page = 1, query = "") => {
    setFetchingMore(true);
    const isLikelyRouteNumber = /^\d+$/.test(query);
    let endpoint = `http://localhost:3001/api/bus-routes?page=${page}&limit=10`;
    if (query) {
      endpoint += isLikelyRouteNumber ? `&routeNumber=${query}` : `&routeName=${query}`;
    }

    console.log("Fetching routes from:", endpoint);

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      console.log("Routes data received:", data);

      if (data && Array.isArray(data.data)) {
        if (page === 1) {
          setRoutes(data.data);
        } else {
          setRoutes((prevRoutes) => [...prevRoutes, ...data.data]);
        }
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("Invalid data format received:", data);
        setRoutes([]);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
      setRoutes([]);
    } finally {
      setFetchingMore(false);
    }
  };

  // Infinite scroll for pagination
  useEffect(() => {
    if (!routeListOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && currentPage < totalPages && !fetchingMore) {
          fetchRoutes(currentPage + 1, searchQuery);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = lastRouteElementRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [routeListOpen, currentPage, totalPages, fetchingMore, searchQuery]);

  // Toggle route list dropdown
  const toggleRouteList = () => {
    setRouteListOpen((prev) => {
      const newState = !prev;
      if (newState) {
        setRoutes([]);
        setCurrentPage(1);
        setTotalPages(1);
        fetchRoutes(1, searchQuery);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      return newState;
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchRoutes(1, query);
  };

  // Parse stops when a route is selected
  useEffect(() => {
    if (selectedRoute) {
      const route = routes.find((r) => r.id === Number.parseInt(selectedRoute));
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

  // Reorder stops
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

  // Handle route optimization
  const handleOptimize = async () => {
    if (!selectedRoute || !departureTime) {
      alert("Please select a route and departure time.");
      return;
    }
    setLoading(true);
    try {
      const route = routes.find((r) => r.id === Number.parseInt(selectedRoute));
      const response = await fetch("http://localhost:4000/optimize_transit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route_no: route.routeNumber,
          departure_time: departureTime,
        }),
      });
      if (!response.ok) throw new Error("Failed to optimize route");
      const data = await response.json();
      setOptimizationResult(data.optimized_route.optimized_route);

      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    } catch (error) {
      console.error("Error optimizing route:", error);
      alert("Failed to optimize route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh functionality
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
    setDepartureTime("");
    fetchRoutes(1, "");
  };

  // Close dropdown on outside click
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

  // Utility: Get consistent color for route
  const getRouteColor = (routeNumber) => {
    const hash = routeNumber.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Current route details
  const currentRouteObj = routes.find((r) => r.id === Number.parseInt(selectedRoute));
  const origin = currentRouteObj?.origin || "N/A";
  const destination = selectedStops.length > 0 ? selectedStops[selectedStops.length - 1].name : "N/A";
  const numStops = selectedStops.length;

  // Measure height for bus stop sequence list
  useEffect(() => {
    const updateContentHeight = () => {
      if (leftPanelRef.current) {
        const panelHeight = leftPanelRef.current.clientHeight;
        const availableHeight = panelHeight - 450;
        setContentHeight(`${Math.max(100, availableHeight)}px`);
      }
    };

    updateContentHeight();
    window.addEventListener("resize", updateContentHeight);
    return () => window.removeEventListener("resize", updateContentHeight);
  }, [selectedStops]);

  return (
    <div className="flex flex-col w-full h-full">
      <div ref={panelsContainerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 h-full">
        {/* Left Panel: Route Selection and Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full flex flex-col"
          ref={leftPanelRef}
          style={{ height: panelsHeight }}
        >
          <motion.div
            className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg text-white overflow-hidden h-full flex flex-col"
            whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Route Configuration
                </h3>
                <p className="text-gray-400 text-sm mt-1">Select a route and set departure time</p>
              </div>
              <motion.div
                onClick={handleRefresh}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="bg-blue-500/10 p-2 rounded-full cursor-pointer"
              >
                <RotateCw className="h-5 w-5 text-blue-400" />
              </motion.div>
            </div>
            <div className="p-6 space-y-6 flex-1 overflow-auto">
              {/* Search Box */}
              <motion.div className="relative search-box" whileHover={{ scale: 1.01 }}>
                <div
                  className="flex items-center h-11 pl-3 pr-4 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white cursor-pointer hover:border-blue-500/50"
                  onClick={toggleRouteList}
                >
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  {selectedRoute ? (
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                        style={{
                          backgroundColor: currentRouteObj ? getRouteColor(currentRouteObj.routeNumber) : "#3b82f6",
                        }}
                      >
                        <RouteIcon className="h-3 w-3 text-white" />
                      </div>
                      <span className="truncate">
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
                      className="absolute z-10 w-full mt-2 route-dropdown"
                    >
                      <div className="w-full bg-neutral-800/90 backdrop-blur-sm border border-neutral-700 rounded-lg shadow-xl overflow-hidden">
                        <div className="relative border-b border-neutral-700">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search routes by number or name..."
                            className="w-full h-11 pl-10 pr-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {routes.length > 0 ? (
                            <>
                              {routes.map((route, index) => {
                                const isLast = index === routes.length - 1 && currentPage < totalPages;
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
                                        <p className="text-xs text-gray-400">Route {route.routeNumber}</p>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                              {fetchingMore && (
                                <div className="flex justify-center py-2">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="p-3 text-gray-400">
                              {fetchingMore ? "Loading routes..." : "No routes found"}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Departure Time Input */}
              <div className="mt-4">
                <label className="text-gray-400 flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Departure Time
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                />
              </div>

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
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <p className="text-gray-400">Origin</p>
                    <p className="text-white font-medium ml-auto truncate max-w-[200px]">{origin}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <p className="text-gray-400">Destination</p>
                    <p className="text-white font-medium ml-auto truncate max-w-[200px]">{destination}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <p className="text-gray-400">Number of Stops</p>
                    <p className="text-white font-medium ml-auto">{numStops} stops</p>
                  </div>
                </div>
              </motion.div>

              {/* Bus Stop Sequence */}
              <div className="space-y-4 flex-1 flex flex-col min-h-0">
                <h3 className="text-lg font-semibold flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-indigo-400" />
                  Bus Stop Sequence
                </h3>
                {selectedStops.length > 0 ? (
                  <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1" style={{ flex: 1 }}>
                    {selectedStops.map((stop, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg border border-neutral-700 bg-neutral-800 hover:border-blue-500/50"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <p className="text-white font-medium truncate">{stop.name}</p>
                          <p className="text-xs text-gray-400 truncate">
                            Coordinates: {stop.coordinates?.join(", ") || "N/A"}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex gap-1">
                          <motion.button
                            onClick={() => moveStopUp(index)}
                            disabled={index === 0}
                            className="p-1 rounded-full bg-neutral-700 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 disabled:opacity-30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => moveStopDown(index)}
                            disabled={index === selectedStops.length - 1}
                            className="p-1 rounded-full bg-neutral-700 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 disabled:opacity-30"
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
            <div className="p-5 border-t border-neutral-800 mt-auto">
              <motion.button
                onClick={handleOptimize}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
                disabled={loading || !selectedRoute || !departureTime}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center">
                    <motion.svg
                      className="h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
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
          className="h-full flex flex-col"
          ref={rightPanelRef}
          style={{ height: panelsHeight }}
        >
          <motion.div
            className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg text-white overflow-hidden h-full flex flex-col"
            whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Optimized Route Results
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {optimizationResult ? "Optimized route details and map" : "Run optimization to see results"}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {optimizationResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 flex flex-col h-full overflow-auto"
                  ref={resultsRef}
                >
                  {/* Map */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-lg overflow-hidden border border-neutral-700 mb-6"
                    style={{ minHeight: "300px", height: "350px", maxHeight: "350px" }}
                  >
                    <MapComponent optimizationResult={optimizationResult} />
                  </motion.div>

                  {/* Results Card */}
                  <motion.div
                    className="p-5 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-lg flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Truck className="mr-3 h-6 w-6 text-green-400" />
                      Optimized Transit Route
                    </h3>

                    <div className="space-y-6" style={{ maxHeight: "calc(100% - 60px)" }}>
                      {/* Route 1 */}
                      {optimizationResult.route_1 && (
                        <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
                          <h4 className="font-medium flex items-center text-blue-400 mb-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                            Route 1: {optimizationResult.route_1.route_no || "N/A"}
                          </h4>
                          <div className="pl-6 space-y-1">
                            {optimizationResult.route_1.stops &&
                              optimizationResult.route_1.stops.map((stop, index) => (
                                <div key={index} className="flex items-center text-gray-300">
                                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mr-2">
                                    {index + 1}
                                  </span>
                                  <span className="truncate">{stop.busstop}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Transfer Point */}
                      {optimizationResult.transfer_point && (
                        <>
                          <div className="flex items-center">
                            <div className="flex-grow h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
                            <div className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 font-medium flex items-center mx-2">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Transfer
                            </div>
                            <div className="flex-grow h-px bg-gradient-to-l from-green-500 to-transparent"></div>
                          </div>

                          <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
                            <h4 className="font-medium flex items-center text-red-400 mb-2">
                              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                              Transfer Details
                            </h4>
                            <div className="pl-6 space-y-1">
                              <div className="flex items-center text-gray-300">
                                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs mr-2">
                                  T
                                </span>
                                <span>Transfer Point: {optimizationResult.transfer_point}</span>
                              </div>
                              <div className="flex items-center text-gray-300">
                                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs mr-2">
                                  R
                                </span>
                                <span>Transfer Route: {optimizationResult.transfer_route || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Route 2 */}
                      {optimizationResult.route_2?.stops?.length > 0 && (
                        <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
                          <h4 className="font-medium flex items-center text-green-400 mb-2">
                            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                            Route 2: {optimizationResult.route_2.route_no || "N/A"}
                          </h4>
                          <div className="pl-6 space-y-1">
                            {optimizationResult.route_2.stops.map((stop, index) => (
                              <div key={index} className="flex items-center text-gray-300">
                                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs mr-2">
                                  {index + 1}
                                </span>
                                <span className="truncate">{stop.busstop}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center p-12 flex-grow"
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-24 h-24 text-gray-600 opacity-40 mb-6"
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
                  >
                    <Truck size={96} />
                  </motion.div>
                  <p className="text-gray-400 text-lg mb-2">No optimization results yet</p>
                  <p className="text-gray-500 text-center max-w-md">
                    Select a route and departure time, then click "Run Optimization" to see the optimized route and map
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
}