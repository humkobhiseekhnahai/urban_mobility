import React, { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; // Replace with your token

export const MapComponent = () => {
  const [sourcePin, setSourcePin] = useState(null);
  const [destinationPin, setDestinationPin] = useState(null);
  const [busStopPins, setBusStopPins] = useState([]);
  const [pinType, setPinType] = useState("source");

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;

    if (pinType === "source") {
      setSourcePin({ lat, lng });
    } else if (pinType === "destination") {
      setDestinationPin({ lat, lng });
    } else if (pinType === "busStop") {
      const existingIndex = busStopPins.findIndex(
        (pin) => pin.lat === lat && pin.lng === lng
      );
      if (existingIndex !== -1) {
        setBusStopPins(busStopPins.filter((_, i) => i !== existingIndex));
      } else {
        setBusStopPins([...busStopPins, { lat, lng }]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen">
      <div className="flex space-x-4 p-4 bg-gray-100 shadow-md rounded-md">
        <button
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            pinType === "source"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setPinType("source")}
        >
          Source
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            pinType === "destination"
              ? "bg-red-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setPinType("destination")}
        >
          Destination
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            pinType === "busStop"
              ? "bg-green-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setPinType("busStop")}
        >
          Bus Stop
        </button>
      </div>
      <Map
        initialViewState={{
          longitude: 77.1025,
          latitude: 28.7041,
          zoom: 10,
        }}
        className="w-full h-full mt-4 rounded-lg shadow-lg"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={handleMapClick}
      >
        {sourcePin && (
          <Marker
            longitude={sourcePin.lng}
            latitude={sourcePin.lat}
            color="blue"
          />
        )}
        {destinationPin && (
          <Marker
            longitude={destinationPin.lng}
            latitude={destinationPin.lat}
            color="red"
          />
        )}
        {busStopPins.map((pin, index) => (
          <Marker
            key={index}
            longitude={pin.lng}
            latitude={pin.lat}
            color="green"
          />
        ))}
      </Map>
    </div>
  );
};
