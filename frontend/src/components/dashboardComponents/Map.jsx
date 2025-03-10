import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { hoveredRouteAtom } from "../../hooks/atoms/atom";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; // Replace with your token

export const MapBox = () => {
  const [hoveredRoute] = useAtom(hoveredRouteAtom);
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    if (!hoveredRoute || hoveredRoute.length < 2) {
      setRouteData(null);
      return;
    }

    let limitedCoords = hoveredRoute.slice(0, 24); // First 24 points
    if (hoveredRoute.length > 25) {
      limitedCoords.push(hoveredRoute[hoveredRoute.length - 1]); // Always include final destination
    } else {
      limitedCoords = hoveredRoute; // If ≤25 points, use all
    }

    const coordinatesString = limitedCoords
      .map(([lng, lat]) => `${lng},${lat}`)
      .join(";");

    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

    fetch(directionsUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          setRouteData(data.routes[0].geometry);
        }
      })
      .catch((err) => console.error("Error fetching route:", err));
  }, [hoveredRoute]);

  return (
    <Map
      initialViewState={{
        longitude: hoveredRoute?.[0]?.[0] || 77.5923,
        latitude: hoveredRoute?.[0]?.[1] || 12.9197,
        zoom: hoveredRoute ? 14 : 10,
      }}
      style={{ borderRadius: "0.25rem" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {routeData && (
        <Source id="route" type="geojson" data={routeData}>
          <Layer
            id="route-layer"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-color": "#007bff", // Bright blue
              "line-width": 6,
              "line-opacity": 0.9,
            }}
          />
        </Source>
      )}

      {/* Source Marker (Start Point) */}
      {hoveredRoute?.length > 0 && (
        <Marker
          longitude={hoveredRoute[0][0]}
          latitude={hoveredRoute[0][1]}
          anchor="bottom"
        >
          <div style={{ color: "#2ECC71", fontSize: "24px" }}>📍</div>
        </Marker>
      )}

      {/* Destination Marker (End Point) */}
      {hoveredRoute?.length > 1 && (
        <Marker
          longitude={hoveredRoute[hoveredRoute.length - 1][0]}
          latitude={hoveredRoute[hoveredRoute.length - 1][1]}
          anchor="bottom"
        >
          <div style={{ color: "#E74C3C", fontSize: "24px" }}>🏁</div>
        </Marker>
      )}
    </Map>
  );
};
