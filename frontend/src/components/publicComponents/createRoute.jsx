import { useState } from "react";
import { MapPin, Calendar, Clock, ChevronDown, Plus } from "lucide-react";
import RouteMap from "../deliveryComponets/routeDeliveryMap";

export default function CreateRoute({ setRoutes }) {
  const [origin, setOrigin] = useState({ name: "", lon: "", lat: "" });
  const [destination, setDestination] = useState({ name: "", lon: "", lat: "" });
  const [stops, setStops] = useState([{ name: "", lon: "", lat: "" }]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [errors, setErrors] = useState({});

  const routeCoordinates = [
    origin.lon && origin.lat ? [parseFloat(origin.lon), parseFloat(origin.lat)] : null,
    ...stops.map((stop) =>
      stop.lon && stop.lat ? [parseFloat(stop.lon), parseFloat(stop.lat)] : null
    ),
    destination.lon && destination.lat ? [parseFloat(destination.lon), parseFloat(destination.lat)] : null,
  ].filter((point) => point !== null);

  const addStop = () => {
    setStops([...stops, { name: "", lon: "", lat: "" }]);
  };

  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

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
    if (!origin.lon || isNaN(parseFloat(origin.lon))) newErrors.originLon = "Valid longitude is required";
    if (!origin.lat || isNaN(parseFloat(origin.lat))) newErrors.originLat = "Valid latitude is required";
    if (!destination.name) newErrors.destinationName = "Destination name is required";
    if (!destination.lon || isNaN(parseFloat(destination.lon))) newErrors.destinationLon = "Valid longitude is required";
    if (!destination.lat || isNaN(parseFloat(destination.lat))) newErrors.destinationLat = "Valid latitude is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (!timeframe) newErrors.timeframe = "Timeframe is required";

    stops.forEach((stop, index) => {
      if (!stop.name) newErrors[`stop_${index}_name`] = "Stop name is required";
      if (!stop.lon || isNaN(parseFloat(stop.lon))) newErrors[`stop_${index}_lon`] = "Valid longitude is required";
      if (!stop.lat || isNaN(parseFloat(stop.lat))) newErrors[`stop_${index}_lat`] = "Valid latitude is required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newRoute = {
      id: Date.now(),
      origin: { name: origin.name, coordinates: [parseFloat(origin.lon), parseFloat(origin.lat)] },
      destination: { name: destination.name, coordinates: [parseFloat(destination.lon), parseFloat(destination.lat)] },
      stops: stops.map((stop) => ({ name: stop.name, coordinates: [parseFloat(stop.lon), parseFloat(stop.lat)] })),
      date,
      startTime: time,
      timeframe,
    };
    setRoutes((prev) => [...prev, newRoute]);
    // Reset form
    setOrigin({ name: "", lon: "", lat: "" });
    setDestination({ name: "", lon: "", lat: "" });
    setStops([{ name: "", lon: "", lat: "" }]);
    setDate("");
    setTime("");
    setTimeframe("");
    setErrors({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Route Details */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-md text-white overflow-hidden">
          <div className="p-4 border-b border-neutral-700">
            <h3 className="text-lg font-medium">Route Details</h3>
            <p className="text-gray-400 text-sm">Enter the basic information for the new route</p>
          </div>
          <div className="p-6 space-y-4">
            {/* Origin */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Origin Name</label>
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
                <label className="text-sm text-gray-400">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={origin.lon}
                  onChange={(e) => setOrigin({ ...origin, lon: e.target.value })}
                  placeholder="Longitude"
                  className={`w-full h-10 bg-neutral-700 border ${
                    errors.originLon ? "border-red-500" : "border-neutral-600"
                  } rounded-md text-white`}
                />
                {errors.originLon && <p className="text-red-500 text-sm">{errors.originLon}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={origin.lat}
                  onChange={(e) => setOrigin({ ...origin, lat: e.target.value })}
                  placeholder="Latitude"
                  className={`w-full h-10 bg-neutral-700 border ${
                    errors.originLat ? "border-red-500" : "border-neutral-600"
                  } rounded-md text-white`}
                />
                {errors.originLat && <p className="text-red-500 text-sm">{errors.originLat}</p>}
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Destination Name</label>
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
                <label className="text-sm text-gray-400">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={destination.lon}
                  onChange={(e) => setDestination({ ...destination, lon: e.target.value })}
                  placeholder="Longitude"
                  className={`w-full h-10 bg-neutral-700 border ${
                    errors.destinationLon ? "border-red-500" : "border-neutral-600"
                  } rounded-md text-white`}
                />
                {errors.destinationLon && <p className="text-red-500 text-sm">{errors.destinationLon}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={destination.lat}
                  onChange={(e) => setDestination({ ...destination, lat: e.target.value })}
                  placeholder="Latitude"
                  className={`w-full h-10 bg-neutral-700 border ${
                    errors.destinationLat ? "border-red-500" : "border-neutral-600"
                  } rounded-md text-white`}
                />
                {errors.destinationLat && <p className="text-red-500 text-sm">{errors.destinationLat}</p>}
              </div>
            </div>

            {/* Date, Time, Timeframe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full pl-10 h-10 bg-neutral-700 border ${
                      errors.date ? "border-red-500" : "border-neutral-600"
                    } rounded-md text-white`}
                  />
                </div>
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Departure Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`w-full pl-10 h-10 bg-neutral-700 border ${
                      errors.time ? "border-red-500" : "border-neutral-600"
                    } rounded-md text-white`}
                  />
                </div>
                {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Timeframe</label>
              <div className="relative">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className={`w-full h-10 px-3 bg-neutral-700 border ${
                    errors.timeframe ? "border-red-500" : "border-neutral-600"
                  } rounded-md text-white appearance-none`}
                >
                  <option value="" disabled>Select timeframe</option>
                  <option value="Morning Bus">Morning Bus</option>
                  <option value="Afternoon Bus">Afternoon Bus</option>
                  <option value="Evening Bus">Evening Bus</option>
                  <option value="Night Bus">Night Bus</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.timeframe && <p className="text-red-500 text-sm">{errors.timeframe}</p>}
            </div>
          </div>
        </div>

        {/* Bus Stops */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-md text-white overflow-hidden">
          <div className="p-4 border-b border-neutral-700">
            <h3 className="text-lg font-medium">Bus Stops</h3>
            <p className="text-gray-400 text-sm">Add and arrange stops along the route</p>
          </div>
          <div className="p-6 space-y-4">
            {stops.map((stop, index) => (
              <div key={index} className="space-y-2 p-3 rounded-md border border-neutral-600 bg-neutral-700">
                <div className="flex justify-between items-center">
                  <span className="text-white">Stop {index + 1}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveStopUp(index)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveStopDown(index)}
                      disabled={index === stops.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeStop(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Stop Name</label>
                  <input
                    value={stop.name}
                    onChange={(e) => {
                      const newStops = [...stops];
                      newStops[index].name = e.target.value;
                      setStops(newStops);
                    }}
                    placeholder="Stop name"
                    className={`w-full h-10 bg-neutral-600 border ${
                      errors[`stop_${index}_name`] ? "border-red-500" : "border-neutral-500"
                    } rounded-md text-white`}
                  />
                  {errors[`stop_${index}_name`] && (
                    <p className="text-red-500 text-sm">{errors[`stop_${index}_name`]}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={stop.lon}
                      onChange={(e) => {
                        const newStops = [...stops];
                        newStops[index].lon = e.target.value;
                        setStops(newStops);
                      }}
                      placeholder="Longitude"
                      className={`w-full h-10 bg-neutral-600 border ${
                        errors[`stop_${index}_lon`] ? "border-red-500" : "border-neutral-500"
                      } rounded-md text-white`}
                    />
                    {errors[`stop_${index}_lon`] && (
                      <p className="text-red-500 text-sm">{errors[`stop_${index}_lon`]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={stop.lat}
                      onChange={(e) => {
                        const newStops = [...stops];
                        newStops[index].lat = e.target.value;
                        setStops(newStops);
                      }}
                      placeholder="Latitude"
                      className={`w-full h-10 bg-neutral-600 border ${
                        errors[`stop_${index}_lat`] ? "border-red-500" : "border-neutral-500"
                      } rounded-md text-white`}
                    />
                    {errors[`stop_${index}_lat`] && (
                      <p className="text-red-500 text-sm">{errors[`stop_${index}_lat`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addStop}
              className="w-full h-10 border border-dashed border-neutral-600 text-neutral-400 hover:bg-neutral-700 rounded-md flex items-center justify-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Stop
            </button>
          </div>
          <div className="p-4 border-t border-neutral-700">
            <button
              onClick={handleCreateRoute}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Create Route
            </button>
          </div>
        </div>
      </div>

      {/* Route Preview */}
      <div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-md text-white h-full">
          <div className="p-4 border-b border-neutral-700">
            <h3 className="text-lg font-medium">Route Preview</h3>
            <p className="text-gray-400 text-sm">Map visualization</p>
          </div>
          <div className="p-6 h-[500px]">
            <RouteMap route={routeCoordinates} />
          </div>
        </div>
      </div>
    </div>
  );
}