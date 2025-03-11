import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import { BusFront } from "lucide-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; // Replace with your token

export const ModalMap = ({ busStops }) => {
  const [routeData, setRouteData] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 77.5923,
    latitude: 12.9197,
    zoom: 12,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (!busStops || busStops.length < 2) {
      setRouteData(null);
      return;
    }

    // Take the first 24 coordinates + 1 destination coordinate
    const limitedStops =
      busStops.length > 25
        ? [...busStops.slice(0, 24), busStops[busStops.length - 1]]
        : busStops;

    const limitedCoords = limitedStops.map((stop) => [
      stop.latlons[1],
      stop.latlons[0],
    ]);
    const coordinatesString = limitedCoords
      .map(([lng, lat]) => `${lng},${lat}`)
      .join(";");

    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

    fetch(directionsUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          setRouteData({
            type: "Feature",
            properties: {},
            geometry: data.routes[0].geometry, // Ensure it's a valid GeoJSON object
          });
        }
      })
      .catch((err) => console.error("Error fetching route:", err));
  }, [busStops]);

  useEffect(() => {
    if (busStops.length > 1 && mapRef.current) {
      const allLons = busStops.map((stop) => stop.latlons[1]);
      const allLats = busStops.map((stop) => stop.latlons[0]);

      const minLon = Math.min(...allLons);
      const maxLon = Math.max(...allLons);
      const minLat = Math.min(...allLats);
      const maxLat = Math.max(...allLats);

      const bounds = [
        [minLon, minLat],
        [maxLon, maxLat],
      ];

      mapRef.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
        easing: (t) => t,
      });
    }
  }, [busStops]);

  return (
    <Map
      {...viewState}
      ref={mapRef}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {/* Route Line */}
      {routeData && (
        <Source id="route" type="geojson" data={routeData}>
          <Layer
            id="route-layer"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-color": "#007bff",
              "line-width": 5,
              "line-opacity": 0.6,
            }}
          />
        </Source>
      )}

      {/* Numbered Bus Stop Markers */}
      {busStops.map((stop, index) => (
        <Marker
          key={index}
          longitude={stop.latlons[1]}
          latitude={stop.latlons[0]}
          anchor="center"
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor:
                index === 0
                  ? "#E74C3C"
                  : index === busStops.length - 1
                  ? "#2ECC71"
                  : "#007bff",
              borderRadius: "50%",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            {index + 1}
          </div>
        </Marker>
      ))}
    </Map>
  );
};
