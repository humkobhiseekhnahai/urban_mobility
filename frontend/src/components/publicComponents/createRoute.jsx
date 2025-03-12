import { useState, useEffect, useRef } from "react";
import { MapPin, Clock, ChevronDown, Plus, Search, X, Database, MapPinOff } from "lucide-react";
import Public_RouteMap from "./createRoute_map";
import axios from "axios";

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
  const [origin, setOrigin] = useState({ name: "", lon: "", lat: "" });
  const [destination, setDestination] = useState({ name: "", lon: "", lat: "" });
  const [stops, setStops] = useState([]);
  const [startTimes, setStartTimes] = useState([""]);
  const [errors, setErrors] = useState({});
  
  // State for origin and destination selectors
  const [showOriginSelector, setShowOriginSelector] = useState(false);
  const [showDestinationSelector, setShowDestinationSelector] = useState(false);
  const [originSearchQuery, setOriginSearchQuery] = useState("");
  const [destinationSearchQuery, setDestinationSearchQuery] = useState("");

  // State for stop selector with pagination
  const [showStopSelector, setShowStopSelector] = useState(false);
  const [stopSearchQuery, setStopSearchQuery] = useState("");
  const [isAddingNewStop, setIsAddingNewStop] = useState(false);
  const [newStop, setNewStop] = useState({ name: "", lon: "", lat: "" });
  const [fetchedStops, setFetchedStops] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef(null);
  const stopListRef = useRef(null);

  // Focus search input when selectors open
  useEffect(() => {
    if (showStopSelector && searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [showStopSelector]);

  // Fetch stops from API
  const fetchStops = async (search = "", pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/bus-routes/stops?search=${encodeURIComponent(search)}&page=${pageNum}&limit=10`
      );
      const { data, currentPage, totalPages } = response.data;
      setFetchedStops((prev) => (append ? [...prev, ...data] : data));
      setPage(currentPage + 1);
      setHasMore(currentPage < totalPages);
    } catch (error) {
      console.error("Error fetching stops:", error);
    } finally {
      setTimeout(() => setLoading(false), 1000); // 1-second delay for loading indicator
    }
  };

  // Fetch initial stops or when search query changes
  useEffect(() => {
    if (showStopSelector || showOriginSelector || showDestinationSelector) {
      const query = showStopSelector ? stopSearchQuery : showOriginSelector ? originSearchQuery : destinationSearchQuery;
      fetchStops(query, 1);
    }
  }, [stopSearchQuery, originSearchQuery, destinationSearchQuery, showStopSelector, showOriginSelector, showDestinationSelector]);

  // Handle infinite scrolling for stops
  const handleScroll = () => {
    const element = stopListRef.current;
    if (
      element.scrollTop + element.clientHeight >= element.scrollHeight - 10 &&
      hasMore &&
      !loading
    ) {
      fetchStops(stopSearchQuery, page, true);
    }
  };

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

  // Add start time
  const addStartTime = () => setStartTimes([...startTimes, ""]);
  const removeStartTime = (index) => setStartTimes(startTimes.filter((_, i) => i !== index));

  // Add stops
  const addExistingStop = (stop) => {
    setStops([...stops, { name: stop.name, lon: stop.lon, lat: stop.lat }]);
    setShowStopSelector(false);
    setStopSearchQuery("");
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

  // Select origin or destination from database
  const selectOrigin = (stop) => {
    setOrigin({ name: stop.name, lon: stop.lon, lat: stop.lat });
    setShowOriginSelector(false);
    setOriginSearchQuery("");
  };

  const selectDestination = (stop) => {
    setDestination({ name: stop.name, lon: stop.lon, lat: stop.lat });
    setShowDestinationSelector(false);
    setDestinationSearchQuery("");
  };

  // Create route
  const handleCreateRoute = () => {
    const newErrors = {};
    if (!origin.name) newErrors.originName = "Origin name is required";
    if (!validateCoordinate(origin.lon, "lng")) newErrors.originLon = "Valid longitude (-180 to 180)";
    if (!validateCoordinate(origin.lat, "lat")) newErrors.originLat = "Valid latitude (-90 to 90)";
    if (!destination.name) newErrors.destinationName = "Destination name is required";
    if (!validateCoordinate(destination.lon, "lng")) newErrors.destinationLon = "Valid longitude (-180 to 180)";
    if (!validateCoordinate(destination.lat, "lat")) newErrors.destinationLat = "Valid latitude (-90 to 90)";

    let timeValues = new Set();
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

    startTimes.forEach((time) => {
      const newRoute = {
        id: Date.now() + Math.random(),
        origin: { name: origin.name, coordinates: [parseFloat(origin.lon), parseFloat(origin.lat)] },
        destination: { name: destination.name, coordinates: [parseFloat(destination.lon), parseFloat(destination.lat)] },
        stops: stops.map((stop) => ({ name: stop.name, coordinates: [parseFloat(stop.lon), parseFloat(stop.lat)] })),
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-md text-white overflow-hidden">
          <div className="p-4 border-b border-neutral-700 bg-neutral-750">
            <h3 className="text-lg font-medium">Route Details</h3>
          </div>
          <div className="p-6 space-y-4">
            {/* Origin Section */}
            <div className="p-4 rounded-md border border-neutral-700 bg-neutral-750">
              <h4 className="text-md font-medium mb-3">Origin</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={origin.name}
                      onChange={(e) => setOrigin({ ...origin, name: e.target.value })}
                      placeholder="Origin name"
                      className={`w-full pl-10 h-10 bg-neutral-700 border ${
                        errors.originName ? "border-red-500" : "border-neutral-600"
                      } rounded-md text-white`}
                    />
                  </div>
                  {errors.originName && <p className="text-red-500 text-sm">{errors.originName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={origin.lon}
                      onChange={(e) => setOrigin({ ...origin, lon: e.target.value })}
                      placeholder="Longitude"
                      className={`w-full h-10 px-3 bg-neutral-700 border ${
                        errors.originLon ? "border-red-500" : "border-neutral-600"
                      } rounded-md text-white`}
                    />
                    {errors.originLon && <p className="text-red-500 text-sm">{errors.originLon}</p>}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={origin.lat}
                      onChange={(e) => setOrigin({ ...origin, lat: e.target.value })}
                      placeholder="Latitude"
                      className={`w-full h-10 px-3 bg-neutral-700 border ${
                        errors.originLat ? "border-red-500" : "border-neutral-600"
                      } rounded-md text-white`}
                    />
                    {errors.originLat && <p className="text-red-500 text-sm">{errors.originLat}</p>}
                  </div>
                </div>
                <button
                  onClick={() => setShowOriginSelector(true)}
                  className="w-full h-10 bg-neutral-700 hover:bg-neutral-650 border border-neutral-600 rounded-md flex items-center justify-center gap-2"
                >
                  <Database size={16} />
                  Select from Database
                </button>
              </div>

              {showOriginSelector && (
                <div className="mt-3 border border-neutral-600 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-neutral-700 border-b border-neutral-600">
                    <h4 className="font-medium">Select Origin</h4>
                    <button
                      onClick={() => setShowOriginSelector(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="p-3 bg-neutral-750">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        value={originSearchQuery}
                        onChange={(e) => setOriginSearchQuery(e.target.value)}
                        placeholder="Search origins..."
                        className="w-full pl-10 h-10 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto" ref={stopListRef} onScroll={handleScroll}>
                    {fetchedStops.length > 0 ? (
                      fetchedStops.map((stop) => (
                        <button
                          key={stop.id}
                          onClick={() => selectOrigin(stop)}
                          className="w-full p-3 flex items-start hover:bg-neutral-700 border-b border-neutral-600 text-left"
                        >
                          <div className="mr-3 mt-1">
                            <MapPin size={16} className="text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium">{stop.name}</p>
                            <p className="text-xs text-gray-400">Lat: {stop.lat}, Lon: {stop.lon}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        <MapPinOff className="mx-auto mb-2 text-gray-500" size={24} />
                        <p>No origins found</p>
                      </div>
                    )}
                    {loading && (
                      <div className="p-4 text-center text-gray-400">
                        <p>Loading...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Destination Section */}
            <div className="p-4 rounded-md border border-neutral-700 bg-neutral-750">
              <h4 className="text-md font-medium mb-3">Destination</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={destination.name}
                      onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                      placeholder="Destination name"
                      className={`w-full pl-10 h-10 bg-neutral-700 border ${
                        errors.destinationName ? "border-red-500" : "border-neutral-600"
                      } rounded-md text-white`}
                    />
                  </div>
                  {errors.destinationName && <p className="text-red-500 text-sm">{errors.destinationName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={destination.lon}
                      onChange={(e) => setDestination({ ...destination, lon: e.target.value })}
                      placeholder="Longitude"
                      className={`w-full h-10 px-3 bg-neutral-700 border ${
                        errors.destinationLon ? "border-red-500" : "border-neutral-600"
                      } rounded-md text-white`}
                    />
                    {errors.destinationLon && <p className="text-red-500 text-sm">{errors.destinationLon}</p>}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={destination.lat}
                      onChange={(e) => setDestination({ ...destination, lat: e.target.value })}
                      placeholder="Latitude"
                      className={`w-full h-10 px-3 bg-neutral-700 border ${
                        errors.destinationLat ? "border-red-500" : "border-neutral-600"
                      } rounded-md text-white`}
                    />
                    {errors.destinationLat && <p className="text-red-500 text-sm">{errors.destinationLat}</p>}
                  </div>
                </div>
                <button
                  onClick={() => setShowDestinationSelector(true)}
                  className="w-full h-10 bg-neutral-700 hover:bg-neutral-650 border border-neutral-600 rounded-md flex items-center justify-center gap-2"
                >
                  <Database size={16} />
                  Select from Database
                </button>
              </div>

              {showDestinationSelector && (
                <div className="mt-3 border border-neutral-600 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-neutral-700 border-b border-neutral-600">
                    <h4 className="font-medium">Select Destination</h4>
                    <button
                      onClick={() => setShowDestinationSelector(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="p-3 bg-neutral-750">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        value={destinationSearchQuery}
                        onChange={(e) => setDestinationSearchQuery(e.target.value)}
                        placeholder="Search destinations..."
                        className="w-full pl-10 h-10 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto" ref={stopListRef} onScroll={handleScroll}>
                    {fetchedStops.length > 0 ? (
                      fetchedStops.map((stop) => (
                        <button
                          key={stop.id}
                          onClick={() => selectDestination(stop)}
                          className="w-full p-3 flex items-start hover:bg-neutral-700 border-b border-neutral-600 text-left"
                        >
                          <div className="mr-3 mt-1">
                            <MapPin size={16} className="text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium">{stop.name}</p>
                            <p className="text-xs text-gray-400">Lat: {stop.lat}, Lon: {stop.lon}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        <MapPinOff className="mx-auto mb-2 text-gray-500" size={24} />
                        <p>No destinations found</p>
                      </div>
                    )}
                    {loading && (
                      <div className="p-4 text-center text-gray-400">
                        <p>Loading...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Start Times Section */}
            <div className="p-4 rounded-md border border-neutral-700 bg-neutral-750">
              <h4 className="text-md font-medium mb-3">Start Times</h4>
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
                        className={`w-full pl-10 h-10 bg-neutral-600 border ${
                          errors[`time_${index}`] ? "border-red-500" : "border-neutral-500"
                        } rounded-md text-white`}
                      />
                    </div>
                    {errors[`time_${index}`] && <p className="text-red-500 text-sm">{errors[`time_${index}`]}</p>}
                  </div>
                ))}
                <button
                  onClick={addStartTime}
                  className="w-full h-10 border border-dashed border-neutral-600 text-neutral-400 hover:bg-neutral-700 rounded-md flex items-center justify-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Time
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bus Stops Section */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-md text-white overflow-hidden">
          <div className="p-4 border-b border-neutral-700 bg-neutral-750">
            <h3 className="text-lg font-medium">Bus Stops</h3>
          </div>
          
          {stops.length > 0 && (
            <div className="p-4 border-b border-neutral-700">
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
                        <p className="text-xs text-gray-400">{stop.lat}, {stop.lon}</p>
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

          <div className="p-4">
            {!showStopSelector && !isAddingNewStop && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowStopSelector(true)}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-650 border border-neutral-600 rounded-md"
                >
                  <Database size={16} />
                  <span>Select Existing Bus Stop</span>
                </button>
                <button
                  onClick={() => setIsAddingNewStop(true)}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-650 border border-neutral-600 rounded-md"
                >
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
                      className="w-full pl-10 h-10 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto" ref={stopListRef} onScroll={handleScroll}>
                  {fetchedStops.length > 0 ? (
                    fetchedStops.map((stop) => (
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
                          <p className="text-xs text-gray-400">Lat: {stop.lat}, Lon: {stop.lon}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      <MapPinOff className="mx-auto mb-2 text-gray-500" size={24} />
                      <p>No bus stops found</p>
                    </div>
                  )}
                  {loading && (
                    <div className="p-4 text-center text-gray-400">
                      <p>Loading...</p>
                    </div>
                  )}
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
                  <div className="space-y-2">
                    <input
                      value={newStop.name}
                      onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
                      placeholder="Enter stop name"
                      className="w-full h-10 px-3 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <input
                        type="number"
                        step="0.0001"
                        value={newStop.lon}
                        onChange={(e) => setNewStop({ ...newStop, lon: e.target.value })}
                        placeholder="Longitude"
                        className="w-full h-10 px-3 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="number"
                        step="0.0001"
                        value={newStop.lat}
                        onChange={(e) => setNewStop({ ...newStop, lat: e.target.value })}
                        placeholder="Latitude"
                        className="w-full h-10 px-3 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addCustomStop}
                    disabled={!newStop.name || !newStop.lon || !newStop.lat}
                    className="w-full h-10 bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 disabled:text-gray-400 rounded-md transition-colors"
                  >
                    Add Stop
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-neutral-700">
            <button
              onClick={handleCreateRoute}
              disabled={stops.length === 0}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-gray-400 text-white rounded-md font-medium transition-colors"
            >
              Create Route
            </button>
          </div>
        </div>
      </div>

      {/* Route Preview */}
      <div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-md text-white h-full">
          <div className="p-4 border-b border-neutral-700 bg-neutral-750">
            <h3 className="text-lg font-medium">Route Preview</h3>
          </div>
          <div className="p-6 h-[500px]">
            <Public_RouteMap route={routeCoordinates} />
          </div>
        </div>
      </div>
    </div>
  );
}