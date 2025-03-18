import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Clock,
  Plus,
  Search,
  X,
  Database,
  MapPinOff,
  RouteIcon,
  RotateCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RouteMap from "../deliveryComponents/routeDeliveryMap";
import axios from "axios";

function validateCoordinate(value, type) {
  const num = Number.parseFloat(value);
  if (isNaN(num)) return false;
  if (type === "lat" && (num < -90 || num > 90)) return false;
  if (type === "lng" && (num < -180 || num > 180)) return false;
  return true;
}

function getTimeframe(time) {
  if (!time) return "Unknown";
  const hour = Number.parseInt(time.split(":")[0], 10) || 0;
  if (hour >= 5 && hour < 12) return "Morning Bus";
  if (hour >= 12 && hour < 17) return "Afternoon Bus";
  if (hour >= 17 && hour < 20) return "Evening Bus";
  if (hour >= 20 || hour < 5) return "Night Bus";
  return "Unknown";
}

const SERVER_URL_BUS=import.meta.env.VITE_SERVER_URL

export default function CreateRoute({ setRoutes }) {
  // State declarations
  const [origin, setOrigin] = useState({ name: "", lon: "", lat: "" });
  const [destination, setDestination] = useState({ name: "", lon: "", lat: "" });
  const [stops, setStops] = useState([]);
  const [startTimes, setStartTimes] = useState([""]);
  const [errors, setErrors] = useState({});
  const [showStopSelector, setShowStopSelector] = useState(false);
  const [stopSearchQuery, setStopSearchQuery] = useState("");
  const [isAddingNewStop, setIsAddingNewStop] = useState(false);
  const [newStop, setNewStop] = useState({ name: "", lon: "", lat: "" });
  const [showOriginSelector, setShowOriginSelector] = useState(false);
  const [showDestinationSelector, setShowDestinationSelector] = useState(false);
  const [isAddingNewOrigin, setIsAddingNewOrigin] = useState(false);
  const [isAddingNewDestination, setIsAddingNewDestination] = useState(false);
  const [pointSearchQuery, setPointSearchQuery] = useState("");
  const [fetchedStops, setFetchedStops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [routeExistsError, setRouteExistsError] = useState("");

  // Refs
  const searchInputRef = useRef(null);
  const originSearchInputRef = useRef(null);
  const destinationSearchInputRef = useRef(null);
  const sentinelRef = useRef(null);

  // Unified styling constants
  const cardStyle = "bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg";
  const inputStyle =
    "w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const buttonStyle =
    "flex items-center justify-center gap-2 bg-neutral-800/50 border border-neutral-700 hover:border-blue-500/50 text-white rounded-lg transition-all duration-200";
  const headerGradient = "bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent";

  // Effects for focusing inputs and scrolling
  useEffect(() => {
    if (showStopSelector && searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (showOriginSelector && originSearchInputRef.current) {
      originSearchInputRef.current.focus();
      originSearchInputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (showDestinationSelector && destinationSearchInputRef.current) {
      destinationSearchInputRef.current.focus();
      destinationSearchInputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [showStopSelector, showOriginSelector, showDestinationSelector]);

  // Fetch stops from the backend
  const fetchStops = async (searchQuery, page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${SERVER_URL_BUS}/api/bus-routes/stops?search=${searchQuery || "jay"}&page=${page}&limit=10`
      );
      const data = await response.json();
      const parsedStops = data.map((stop, index) => ({
        id: `${page}-${index}`,
        name: stop.name,
        lon: stop.lon || "",
        lat: stop.lat || "",
      }));
      setFetchedStops((prev) => (page === 1 ? parsedStops : [...prev, ...parsedStops]));
      setHasMore(data.length === 10);
    } catch (error) {
      console.error("Error fetching stops:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  useEffect(() => {
    if (showStopSelector || showOriginSelector || showDestinationSelector) {
      fetchStops(stopSearchQuery || pointSearchQuery, currentPage);
    }
  }, [showStopSelector, showOriginSelector, showDestinationSelector, stopSearchQuery, pointSearchQuery, currentPage]);

  useEffect(() => {
    if (showStopSelector || showOriginSelector || showDestinationSelector) {
      setCurrentPage(1);
    }
  }, [stopSearchQuery, pointSearchQuery]);

  // Infinite scrolling
  useEffect(() => {
    if (showStopSelector || showOriginSelector || showDestinationSelector) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            setCurrentPage((prev) => prev + 1);
          }
        },
        { threshold: 1.0 }
      );
      if (sentinelRef.current) observer.observe(sentinelRef.current);
      return () => observer.disconnect();
    }
  }, [showStopSelector, showOriginSelector, showDestinationSelector, hasMore, isLoading]);

  // Filter stops based on search queries
  const filteredStops = fetchedStops.filter((stop) =>
    stop.name.toLowerCase().includes(stopSearchQuery.toLowerCase())
  );
  const filteredOriginStops = fetchedStops.filter((stop) =>
    stop.name.toLowerCase().includes(pointSearchQuery.toLowerCase())
  );
  const filteredDestinationStops = fetchedStops.filter((stop) =>
    stop.name.toLowerCase().includes(pointSearchQuery.toLowerCase())
  );

  // Route coordinates for map
  const routeCoordinates = [
    validateCoordinate(origin.lon, "lng") && validateCoordinate(origin.lat, "lat")
      ? [Number.parseFloat(origin.lon), Number.parseFloat(origin.lat)]
      : null,
    ...stops.map((stop) =>
      validateCoordinate(stop.lon, "lng") && validateCoordinate(stop.lat, "lat")
        ? [Number.parseFloat(stop.lon), Number.parseFloat(stop.lat)]
        : null
    ),
    validateCoordinate(destination.lon, "lng") && validateCoordinate(destination.lat, "lat")
      ? [Number.parseFloat(destination.lon), Number.parseFloat(destination.lat)]
      : null,
  ].filter((point) => point !== null);

  // Handler functions
  const addStartTime = () => setStartTimes([...startTimes, ""]);
  const removeStartTime = (index) => setStartTimes(startTimes.filter((_, i) => i !== index));
  const addExistingStop = (stop) => {
    setStops([...stops, { name: stop.name, lon: stop.lon, lat: stop.lat }]);
    setShowStopSelector(false);
    setStopSearchQuery("");
  };
  const selectExistingOrigin = (stop) => {
    setOrigin({ name: stop.name, lon: stop.lon, lat: stop.lat });
    setShowOriginSelector(false);
    setPointSearchQuery("");
  };
  const selectExistingDestination = (stop) => {
    setDestination({ name: stop.name, lon: stop.lon, lat: stop.lat });
    setShowDestinationSelector(false);
    setPointSearchQuery("");
  };
  const addCustomStop = () => {
    if (newStop.name && newStop.lon && newStop.lat) {
      setStops([...stops, { ...newStop }]);
      setNewStop({ name: "", lon: "", lat: "" });
      setIsAddingNewStop(false);
    }
  };
  const removeStop = (index) => setStops(stops.filter((_, i) => i !== index));
  const moveStopUp = (index) => {
    if (index === 0) return;
    const newStops = [...stops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    setStops(newStops);
  };
  const moveStopDown = (index) => {
    if (index === stops.length - 1) return;
    const newStops = [...stops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    setStops(newStops);
  };

  const resetForm = () => {
    setOrigin({ name: "", lon: "", lat: "" });
    setDestination({ name: "", lon: "", lat: "" });
    setStops([]);
    setStartTimes([""]);
    setErrors({});
    setResponseData(null);
    setErrorMessage("");
    setRouteExistsError("");
  };

  const handleCreateRoute = async () => {
    const newErrors = {};
    if (!origin.name) newErrors.originName = "Origin name is required";
    if (!validateCoordinate(origin.lon, "lng")) newErrors.originLon = "Valid longitude (-180 to 180)";
    if (!validateCoordinate(origin.lat, "lat")) newErrors.originLat = "Valid latitude (-90 to 90)";
    if (!destination.name) newErrors.destinationName = "Destination name is required";
    if (!validateCoordinate(destination.lon, "lng")) newErrors.destinationLon = "Valid longitude (-180 to 180)";
    if (!validateCoordinate(destination.lat, "lat")) newErrors.destinationLat = "Valid latitude (-90 to 90)";

    const timeValues = new Set();
    startTimes.forEach((time, index) => {
      if (!time) newErrors[`time_${index}`] = "Time is required";
      else if (timeValues.has(time)) newErrors[`time_${index}`] = "Duplicate time";
      else timeValues.add(time);
    });

    stops.forEach((stop, index) => {
      if (!stop.name) newErrors[`stop_${index}_name`] = "Stop name is required";
      if (!validateCoordinate(stop.lon, "lng")) newErrors[`stop_${index}_lon`] = "Valid longitude required";
      if (!validateCoordinate(stop.lat, "lat")) newErrors[`stop_${index}_lat`] = "Valid latitude required";
    });

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    const routeData = {
      start: origin.name,
      stop: destination.name,
      intermediate: stops.map((stop) => stop.name),
      departure_time: startTimes.join(","),
    };

    setIsSubmitting(true);
    setErrorMessage("");
    setRouteExistsError("");
    setResponseData(null);

    try {
      const response = await axios.post(`${SERVER_URL_BUS}/custom/create-custom-route`, routeData, {
        validateStatus: (status) => status < 500,
      });

      if (response.status === 409) {
        setRouteExistsError(response.data.message || "Route already exists. Please choose different parameters.");
        return;
      }

      if (response.status !== 200) {
        throw new Error("Failed to create route");
      }

      const { message, route_no } = response.data;

      startTimes.forEach((time) => {
        const newRoute = {
          id: `${route_no}-${time}`,
          route_no: route_no,
          origin: { name: origin.name, coordinates: [Number.parseFloat(origin.lon), Number.parseFloat(origin.lat)] },
          destination: {
            name: destination.name,
            coordinates: [Number.parseFloat(destination.lon), Number.parseFloat(destination.lat)],
          },
          stops: stops.map((stop) => ({
            name: stop.name,
            coordinates: [Number.parseFloat(stop.lon), Number.parseFloat(stop.lat)],
          })),
          startTime: time,
          timeframe: getTimeframe(time),
        };
        setRoutes((prev) => [...prev, newRoute]);
      });

      setResponseData({ message, route_no });
    } catch (error) {
      console.error("Error creating route:", error);
      setErrorMessage("Failed to create route. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex md:flex-row flex-col h-full gap-6 p-4 overflow-hidden">
      {/* Left Panel - Scrollable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="md:w-1/2 w-full overflow-y-auto pr-2"
      >
        <motion.div
          className={`${cardStyle} text-white overflow-hidden`}
          whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
          transition={{ duration: 0.2 }}
        >
          {responseData ? (
            <div className="p-6 overflow-y-auto max-h-screen">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-5 border border-green-500/30">
                <div className="flex items-start">
                  <div className="bg-green-500/20 p-2 rounded-full mr-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Route Created Successfully!</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-400 w-32">Route Number:</span>
                        <span className="text-white font-medium bg-neutral-700/50 px-3 py-1 rounded">
                          {responseData.route_no}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-400 w-32">Origin:</span>
                        <div className="text-white">
                          <span className="font-medium">{origin.name}</span>
                          <div className="text-xs text-gray-400 mt-1">
                            Coordinates: {origin.lat}, {origin.lon}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-400 w-32">Destination:</span>
                        <div className="text-white">
                          <span className="font-medium">{destination.name}</span>
                          <div className="text-xs text-gray-400 mt-1">
                            Coordinates: {destination.lat}, {destination.lon}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-400 w-32">Stops:</span>
                        <div className="text-white">
                          <span className="font-medium">{stops.length} intermediate stops</span>
                          {stops.length > 0 && (
                            <div className="text-xs text-gray-400 mt-1 space-y-1">
                              {stops.map((stop, index) => (
                                <div key={index}>• {stop.name}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-400 w-32">Departure Times:</span>
                        <div className="text-white">
                          <div className="flex flex-wrap gap-2">
                            {startTimes.map((time, index) => (
                              <span key={index} className="bg-neutral-700/50 px-3 py-1 rounded text-sm">
                                {time} ({getTimeframe(time)})
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <button
                        onClick={resetForm}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md flex items-center justify-center"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Create Another Route
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-semibold ${headerGradient}`}>Create New Route</h3>
                  <p className="text-gray-400 text-sm mt-1">Define bus routes with stops and schedules</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Origin Section */}
                <motion.div
                  className="p-5 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-blue-400" />
                    Origin Point
                  </h3>
                  <div className="space-y-3">
                    {origin.name && (
                      <div className="p-3 rounded-md bg-neutral-700 border border-neutral-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-blue-600 w-3 h-3 rounded-full mr-3"></div>
                            <div>
                              <p className="font-medium">{origin.name}</p>
                              <p className="text-xs text-gray-400">
                                {origin.lat}, {origin.lon}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setOrigin({ name: "", lon: "", lat: "" })}
                            className="text-red-400 hover:bg-neutral-600 p-1 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                    {!showOriginSelector && !isAddingNewOrigin && (
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => {
                            setShowOriginSelector(true);
                            setIsAddingNewOrigin(false);
                            setShowDestinationSelector(false);
                            setIsAddingNewDestination(false);
                            setPointSearchQuery("");
                          }}
                          className={buttonStyle}
                        >
                          <Database size={16} />
                          <span>Select Existing Bus Stop</span>
                        </button>
                      </div>
                    )}
                    {showOriginSelector && (
                      <div className="border border-neutral-600 rounded-md overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-neutral-700 border-b border-neutral-600">
                          <h4 className="font-medium">Select Origin Stop</h4>
                          <button
                            onClick={() => {
                              setShowOriginSelector(false);
                              setPointSearchQuery("");
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="p-3 bg-neutral-750">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              ref={originSearchInputRef}
                              autoFocus
                              value={stopSearchQuery}
                              onChange={(e) => setStopSearchQuery(e.target.value)}
                              placeholder="Search bus stops..."
                              className={`${inputStyle} pl-10`}
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredOriginStops.length > 0 ? (
                            filteredOriginStops.map((stop) => (
                              <button
                                key={stop.id}
                                onClick={() => selectExistingOrigin(stop)}
                                className="w-full p-3 flex items-start hover:bg-neutral-700 border-b border-neutral-600 text-left"
                              >
                                <div className="mr-3 mt-1">
                                  <MapPin size={16} className="text-blue-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{stop.name}</p>
                                  <p className="text-xs text-gray-400">
                                    Lat: {stop.lat}, Lon: {stop.lon}
                                  </p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-400">
                              <MapPinOff className="mx-auto mb-2 text-gray-500" size={24} />
                              <p>No bus stops found</p>
                            </div>
                          )}
                          {isLoading && <div className="p-4 text-center text-gray-400">Loading...</div>}
                          <div ref={sentinelRef} className="h-1" />
                        </div>
                      </div>
                    )}
                    {isAddingNewOrigin && (
                      <div className="border border-neutral-600 rounded-md overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-neutral-700 border-b border-neutral-600">
                          <h4 className="font-medium">Add New Origin</h4>
                          <button onClick={() => setIsAddingNewOrigin(false)} className="text-gray-400 hover:text-white">
                            <X size={18} />
                          </button>
                        </div>
                        <div className="p-4 space-y-3">
                          <input
                            value={origin.name}
                            onChange={(e) => setOrigin({ ...origin, name: e.target.value })}
                            placeholder="Enter stop name"
                            className={inputStyle}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="number"
                              step="0.0001"
                              value={origin.lon}
                              onChange={(e) => setOrigin({ ...origin, lon: e.target.value })}
                              placeholder="Longitude"
                              className={inputStyle}
                            />
                            <input
                              type="number"
                              step="0.0001"
                              value={origin.lat}
                              onChange={(e) => setOrigin({ ...origin, lat: e.target.value })}
                              placeholder="Latitude"
                              className={inputStyle}
                            />
                          </div>
                          <button
                            onClick={() => setIsAddingNewOrigin(false)}
                            disabled={!origin.name || !origin.lon || !origin.lat}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:text-gray-400 rounded-lg transition-colors"
                          >
                            Set Origin
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.originName && <p className="text-red-500 text-sm mt-2">{errors.originName}</p>}
                  {errors.originLon && <p className="text-red-500 text-sm mt-2">{errors.originLon}</p>}
                  {errors.originLat && <p className="text-red-500 text-sm mt-2">{errors.originLat}</p>}
                </motion.div>

                {/* Destination Section */}
                <motion.div
                  className="p-5 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-red-400" />
                    Destination Point
                  </h3>
                  <div className="space-y-3">
                    {destination.name && (
                      <div className="p-3 rounded-md bg-neutral-700 border border-neutral-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-red-600 w-3 h-3 rounded-full mr-3"></div>
                            <div>
                              <p className="font-medium">{destination.name}</p>
                              <p className="text-xs text-gray-400">
                                {destination.lat}, {destination.lon}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setDestination({ name: "", lon: "", lat: "" })}
                            className="text-red-400 hover:bg-neutral-600 p-1 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                    {!showDestinationSelector && !isAddingNewDestination && (
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => {
                            setShowDestinationSelector(true);
                            setIsAddingNewDestination(false);
                            setShowOriginSelector(false);
                            setIsAddingNewOrigin(false);
                            setPointSearchQuery("");
                          }}
                          className={buttonStyle}
                        >
                          <Database size={16} />
                          <span>Select Existing Bus Stop</span>
                        </button>
                      </div>
                    )}
                    {showDestinationSelector && (
                      <div className="border border-neutral-600 rounded-md overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-neutral-700 border-b border-neutral-600">
                          <h4 className="font-medium">Select Destination Stop</h4>
                          <button
                            onClick={() => {
                              setShowDestinationSelector(false);
                              setPointSearchQuery("");
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="p-3 bg-neutral-750">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              ref={destinationSearchInputRef}
                              autoFocus
                              value={stopSearchQuery}
                              onChange={(e) => setStopSearchQuery(e.target.value)}
                              placeholder="Search bus stops..."
                              className={`${inputStyle} pl-10`}
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredDestinationStops.length > 0 ? (
                            filteredDestinationStops.map((stop) => (
                              <button
                                key={stop.id}
                                onClick={() => selectExistingDestination(stop)}
                                className="w-full p-3 flex items-start hover:bg-neutral-700 border-b border-neutral-600 text-left"
                              >
                                <div className="mr-3 mt-1">
                                  <MapPin size={16} className="text-red-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{stop.name}</p>
                                  <p className="text-xs text-gray-400">
                                    Lat: {stop.lat}, Lon: {stop.lon}
                                  </p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-400">
                              <MapPinOff className="mx-auto mb-2 text-gray-500" size={24} />
                              <p>No bus stops found</p>
                            </div>
                          )}
                          {isLoading && <div className="p-4 text-center text-gray-400">Loading...</div>}
                          <div ref={sentinelRef} className="h-1" />
                        </div>
                      </div>
                    )}
                    {isAddingNewDestination && (
                      <div className="border border-neutral-600 rounded-md overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-neutral-700 border-b border-neutral-600">
                          <h4 className="font-medium">Add New Destination</h4>
                          <button
                            onClick={() => setIsAddingNewDestination(false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="p-4 space-y-3">
                          <input
                            value={destination.name}
                            onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                            placeholder="Enter stop name"
                            className={inputStyle}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="number"
                              step="0.0001"
                              value={destination.lon}
                              onChange={(e) => setDestination({ ...destination, lon: e.target.value })}
                              placeholder="Longitude"
                              className={inputStyle}
                            />
                            <input
                              type="number"
                              step="0.0001"
                              value={destination.lat}
                              onChange={(e) => setDestination({ ...destination, lat: e.target.value })}
                              placeholder="Latitude"
                              className={inputStyle}
                            />
                          </div>
                          <button
                            onClick={() => setIsAddingNewDestination(false)}
                            disabled={!destination.name || !destination.lon || !destination.lat}
                            className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-neutral-600 disabled:text-gray-400 rounded-lg transition-colors"
                          >
                            Set Destination
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.destinationName && <p className="text-red-500 text-sm mt-2">{errors.destinationName}</p>}
                  {errors.destinationLon && <p className="text-red-500 text-sm mt-2">{errors.destinationLon}</p>}
                  {errors.destinationLat && <p className="text-red-500 text-sm mt-2">{errors.destinationLat}</p>}
                </motion.div>

                {/* Stops Section */}
                <motion.div
                  className="p-5 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <RouteIcon className="mr-2 h-5 w-5 text-green-400" />
                    Intermediate Stops
                  </h3>
                  {stops.length > 0 && (
                    <div className="mb-4">
                      <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                        {stops.map((stop, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-md bg-neutral-700 border border-neutral-600 group"
                          >
                            <div className="flex items-center">
                              <div className="bg-green-600 w-3 h-3 rounded-full mr-3"></div>
                              <div>
                                <p className="font-medium">{stop.name}</p>
                                <p className="text-xs text-gray-400">
                                  {stop.lat}, {stop.lon}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => moveStopUp(index)}
                                disabled={index === 0}
                                className="p-1 hover:bg-neutral-600 rounded disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveStopDown(index)}
                                disabled={index === stops.length - 1}
                                className="p-1 hover:bg-neutral-600 rounded disabled:opacity-30"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => removeStop(index)}
                                className="p-1 text-red-400 hover:bg-neutral-600 rounded"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!showStopSelector && !isAddingNewStop && (
                    <div className="flex flex-col gap-3">
                      <button onClick={() => setShowStopSelector(true)} className={buttonStyle}>
                        <Database size={16} />
                        <span>Select Existing Bus Stop</span>
                      </button>
                    </div>
                  )}
                  {showStopSelector && (
                    <div className="border border-neutral-600 rounded-md overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-neutral-700 border-b border-neutral-600">
                        <h4 className="font-medium">Select Existing Stop</h4>
                        <button
                          onClick={() => {
                            setShowStopSelector(false);
                            setStopSearchQuery("");
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="p-3 bg-neutral-750">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            ref={searchInputRef}
                            autoFocus
                            value={stopSearchQuery}
                            onChange={(e) => setStopSearchQuery(e.target.value)}
                            placeholder="Search bus stops..."
                            className={`${inputStyle} pl-10`}
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredStops.length > 0 ? (
                          filteredStops.map((stop) => (
                            <button
                              key={stop.id}
                              onClick={() => addExistingStop(stop)}
                              className="w-full p-3 flex items-start hover:bg-neutral-700 border-b border-neutral-600 text-left"
                            >
                              <div className="mr-3 mt-1">
                                <MapPin size={16} className="text-green-500" />
                              </div>
                              <div>
                                <p className="font-medium">{stop.name}</p>
                                <p className="text-xs text-gray-400">
                                  Lat: {stop.lat}, Lon: {stop.lon}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-400">
                            <MapPinOff className="mx-auto mb-2 text-gray-500" size={24} />
                            <p>No bus stops found</p>
                          </div>
                        )}
                        {isLoading && <div className="p-4 text-center text-gray-400">Loading...</div>}
                        <div ref={sentinelRef} className="h-1" />
                      </div>
                    </div>
                  )}
                  {isAddingNewStop && (
                    <div className="border border-neutral-600 rounded-md overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-neutral-700 border-b border-neutral-600">
                        <h4 className="font-medium">Add New Bus Stop</h4>
                        <button
                          onClick={() => {
                            setIsAddingNewStop(false);
                            setNewStop({ name: "", lon: "", lat: "" });
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="p-4 space-y-3">
                        <input
                          value={newStop.name}
                          onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
                          placeholder="Enter stop name"
                          className={inputStyle}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            step="0.0001"
                            value={newStop.lon}
                            onChange={(e) => setNewStop({ ...newStop, lon: e.target.value })}
                            placeholder="Longitude"
                            className={inputStyle}
                          />
                          <input
                            type="number"
                            step="0.0001"
                            value={newStop.lat}
                            onChange={(e) => setNewStop({ ...newStop, lat: e.target.value })}
                            placeholder="Latitude"
                            className={inputStyle}
                          />
                        </div>
                        <button
                          onClick={addCustomStop}
                          disabled={!newStop.name || !newStop.lon || !newStop.lat}
                          className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 disabled:text-gray-400 rounded-lg transition-colors"
                        >
                          Add Stop
                        </button>
                      </div>
                    </div>
                  )}
                  {stops.map((_, index) => (
                    <div key={index}>
                      {errors[`stop_${index}_name`] && (
                        <p className="text-red-500 text-sm mt-2">{errors[`stop_${index}_name`]}</p>
                      )}
                      {errors[`stop_${index}_lon`] && (
                        <p className="text-red-500 text-sm mt-2">{errors[`stop_${index}_lon`]}</p>
                      )}
                      {errors[`stop_${index}_lat`] && (
                        <p className="text-red-500 text-sm mt-2">{errors[`stop_${index}_lat`]}</p>
                      )}
                    </div>
                  ))}
                </motion.div>

                {/* Schedule Section */}
                <motion.div
                  className="p-5 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-purple-400" />
                    Departure Schedule
                  </h3>
                  <div className="space-y-3">
                    {startTimes.map((time, index) => (
                      <div key={index} className="p-3 rounded-md border border-neutral-600 bg-neutral-700">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-sm font-medium text-white">Time {index + 1}</h5>
                          {startTimes.length > 1 && (
                            <button
                              onClick={() => removeStartTime(index)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => {
                              const newTimes = [...startTimes];
                              newTimes[index] = e.target.value;
                              setStartTimes(newTimes);
                            }}
                            className={`${inputStyle} pl-10 ${errors[`time_${index}`] ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors[`time_${index}`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`time_${index}`]}</p>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addStartTime}
                      className="w-full py-2.5 border border-dashed border-neutral-600 text-neutral-400 hover:bg-neutral-700 rounded-lg flex items-center justify-center"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Time
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Create Button and Error Display */}
              <div className="p-5 border-t border-neutral-800">
                <AnimatePresence>
                  {errorMessage || routeExistsError ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-5"
                    >
                      <div className="bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-lg p-5 border border-red-500/30">
                        <div className="flex items-start">
                          <div className="bg-red-500/20 p-2 rounded-full mr-4">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">Error Creating Route</h3>
                            {errorMessage && <p className="text-gray-300">{errorMessage}</p>}
                            {routeExistsError && <p className="text-yellow-300 mt-2">{routeExistsError}</p>}
                            <button
                              onClick={() => {
                                setErrorMessage("");
                                setRouteExistsError("");
                              }}
                              className="mt-4 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                            >
                              Try Again
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateRoute}
                  disabled={isSubmitting}
                  className={`w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <RotateCw className="animate-spin mr-2" size={18} />
                      <span>Creating Route...</span>
                    </div>
                  ) : (
                    "Create Route"
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Right Panel - Route Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="md:w-1/2 w-full"
      >
        <motion.div
          className={`${cardStyle} h-full flex flex-col`}
          whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-semibold ${headerGradient}`}>Route Preview</h3>
            </div>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-blue-500/10 p-2 rounded-full"
            >
              <MapPin className="h-5 w-5 text-blue-400" />
            </motion.div>
          </div>
          <div className="flex-1 p-6">
            <div className="w-full h-64 md:h-full">
              <RouteMap route={routeCoordinates} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}