import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Clock,
  ChevronDown,
  Plus,
  Search,
  X,
  Database,
  MapPinOff,
  Route as RouteIcon,
  RotateCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RouteMap from "../deliveryComponets/routeDeliveryMap";

function validateCoordinate(value, type) {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (type === "lat" && (num < -90 || num > 90)) return false;
  if (type === "lng" && (num < -180 || num > 180)) return false;
  return true;
}

function getTimeframe(time) {
  if (!time) return "Unknown";
  const hour = parseInt(time.split(":")[0], 10) || 0;
  if (hour >= 5 && hour < 12) return "Morning Bus";
  if (hour >= 12 && hour < 17) return "Afternoon Bus";
  if (hour >= 17 && hour < 20) return "Evening Bus";
  if (hour >= 20 || hour < 5) return "Night Bus";
  return "Unknown";
}

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
  const headerGradient =
    "bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent";

  // Effects for focusing inputs and scrolling into view
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
        `http://localhost:3001/api/bus-routes/stops?search=${searchQuery || "jay"}&page=${page}&limit=10`
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
  }, [
    showStopSelector,
    showOriginSelector,
    showDestinationSelector,
    stopSearchQuery,
    pointSearchQuery,
    currentPage,
  ]);

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
      ? [parseFloat(origin.lon), parseFloat(origin.lat)]
      : null,
    ...stops.map((stop) =>
      validateCoordinate(stop.lon, "lng") && validateCoordinate(stop.lat, "lat")
        ? [parseFloat(stop.lon), parseFloat(stop.lat)]
        : null
    ),
    validateCoordinate(destination.lon, "lng") && validateCoordinate(destination.lat, "lat")
      ? [parseFloat(destination.lon), parseFloat(destination.lat)]
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

  const handleCreateRoute = () => {
    const newErrors = {};
    if (!origin.name) newErrors.originName = "Origin name is required";
    if (!validateCoordinate(origin.lon, "lng"))
      newErrors.originLon = "Valid longitude (-180 to 180)";
    if (!validateCoordinate(origin.lat, "lat"))
      newErrors.originLat = "Valid latitude (-90 to 90)";
    if (!destination.name) newErrors.destinationName = "Destination name is required";
    if (!validateCoordinate(destination.lon, "lng"))
      newErrors.destinationLon = "Valid longitude (-180 to 180)";
    if (!validateCoordinate(destination.lat, "lat"))
      newErrors.destinationLat = "Valid latitude (-90 to 90)";

    let timeValues = new Set();
    startTimes.forEach((time, index) => {
      if (!time) newErrors[`time_${index}`] = "Time is required";
      else if (timeValues.has(time)) newErrors[`time_${index}`] = "Duplicate time";
      else timeValues.add(time);
    });

    stops.forEach((stop, index) => {
      if (!stop.name) newErrors[`stop_${index}_name`] = "Stop name is required";
      if (!validateCoordinate(stop.lon, "lng"))
        newErrors[`stop_${index}_lon`] = "Valid longitude required";
      if (!validateCoordinate(stop.lat, "lat"))
        newErrors[`stop_${index}_lat`] = "Valid latitude required";
    });

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    startTimes.forEach((time) => {
      const newRoute = {
        id: Date.now() + Math.random(),
        origin: { name: origin.name, coordinates: [parseFloat(origin.lon), parseFloat(origin.lat)] },
        destination: {
          name: destination.name,
          coordinates: [parseFloat(destination.lon), parseFloat(destination.lat)],
        },
        stops: stops.map((stop) => ({
          name: stop.name,
          coordinates: [parseFloat(stop.lon), parseFloat(stop.lat)],
        })),
        startTime: time,
        timeframe: getTimeframe(time),
      };
      setRoutes((prev) => [...prev, newRoute]);
    });

    setOrigin({ name: "", lon: "", lat: "" });
    setDestination({ name: "", lon: "", lat: "" });
    setStops([]);
    setStartTimes([""]);
    setErrors({});
  };

  return (
    <div className="flex h-full gap-6 p-4 overflow-hidden">
      {/* Left Panel - Scrollable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-1/2 overflow-y-auto pr-2"
      >
        <motion.div
          className={`${cardStyle} text-white overflow-hidden`}
          whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
          transition={{ duration: 0.2 }}
        >
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
                    <button
                      onClick={() => {
                        setIsAddingNewOrigin(true);
                        setShowOriginSelector(false);
                        setShowDestinationSelector(false);
                        setIsAddingNewDestination(false);
                      }}
                      className={buttonStyle}
                    >
                      <Plus size={16} />
                      <span>Add New Bus Stop</span>
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
                          value={pointSearchQuery}
                          onChange={(e) => setPointSearchQuery(e.target.value)}
                          placeholder="Search bus stops..."
                          className={inputStyle}
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
                      {isLoading && (
                        <div className="p-4 text-center text-gray-400">Loading...</div>
                      )}
                      <div ref={sentinelRef} className="h-1" />
                    </div>
                  </div>
                )}
                {isAddingNewOrigin && (
                  <div className="border border-neutral-600 rounded-md overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-neutral-700 border-b border-neutral-600">
                      <h4 className="font-medium">Add New Origin</h4>
                      <button
                        onClick={() => setIsAddingNewOrigin(false)}
                        className="text-gray-400 hover:text-white"
                      >
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
                    <button
                      onClick={() => {
                        setIsAddingNewDestination(true);
                        setShowDestinationSelector(false);
                        setShowOriginSelector(false);
                        setIsAddingNewOrigin(false);
                      }}
                      className={buttonStyle}
                    >
                      <Plus size={16} />
                      <span>Add New Bus Stop</span>
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
                          value={pointSearchQuery}
                          onChange={(e) => setPointSearchQuery(e.target.value)}
                          placeholder="Search bus stops..."
                          className={inputStyle}
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
                      {isLoading && (
                        <div className="p-4 text-center text-gray-400">Loading...</div>
                      )}
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
                  <button onClick={() => setIsAddingNewStop(true)} className={buttonStyle}>
                    <Plus size={16} />
                    <span>Add New Bus Stop</span>
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
                        className={inputStyle}
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
                    {isLoading && (
                      <div className="p-4 text-center text-gray-400">Loading...</div>
                    )}
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
                  <div
                    key={index}
                    className="p-3 rounded-md border border-neutral-600 bg-neutral-700"
                  >
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
                        className={`${inputStyle} pl-10 ${
                          errors[`time_${index}`] ? "border-red-500" : ""
                        }`}
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

          {/* Create Button */}
          <div className="p-5 border-t border-neutral-800">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateRoute}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20"
            >
              Create Route
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel - Route Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-1/2 h-full"
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
            <RouteMap route={routeCoordinates} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}