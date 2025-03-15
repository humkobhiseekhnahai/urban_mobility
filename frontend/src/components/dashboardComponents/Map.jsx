import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { hoveredRouteAtom } from "../../hooks/atoms/atom";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import { BusFront } from "lucide-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; // Replace with your token

const defaultBusCoordinates = [
  [77.5946, 12.9716], // Bangalore MG Road
  [77.61, 12.935], // Koramangala
  [77.65, 12.9], // HSR Layout
  [77.59, 12.94], // Richmond Town
  [77.5806, 12.9201], // Lalbagh
  [77.56, 12.99], // Yeshwanthpur
  [77.53, 12.97], // Rajajinagar
  [77.62, 12.95], // Indiranagar
  [77.5, 12.91], // Vijayanagar
  [77.64, 12.97], // KR Puram
  [77.6, 13.0], // Hebbal
  [77.63, 13.02], // Manyata Tech Park
];

export const MapBox = () => {
  const [hoveredRoute] = useAtom(hoveredRouteAtom);
  const [routeData, setRouteData] = useState(null);
  const mapRef = useRef(null);

  // Adjusts the map focus based on the given coordinates
  const fitBoundsToCoordinates = (coordinates) => {
    if (coordinates.length < 2 || !mapRef.current) return;

    const allLons = coordinates.map(([lng, _]) => lng);
    const allLats = coordinates.map(([_, lat]) => lat);

    const minLon = Math.min(...allLons);
    const maxLon = Math.max(...allLons);
    const minLat = Math.min(...allLats);
    const maxLat = Math.max(...allLats);

    const bounds = [
      [minLon, minLat], // Southwest corner
      [maxLon, maxLat], // Northeast corner
    ];

    mapRef.current.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
      easing: (t) => t,
    });
  };

  useEffect(() => {
    if (!hoveredRoute || hoveredRoute.length < 2) {
      setRouteData(null);
      fitBoundsToCoordinates(defaultBusCoordinates);
      return;
    }

    let limitedCoords = hoveredRoute.slice(0, 24);
    if (hoveredRoute.length > 25) {
      limitedCoords.push(hoveredRoute[hoveredRoute.length - 1]);
    } else {
      limitedCoords = hoveredRoute;
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
          fitBoundsToCoordinates(hoveredRoute);
        }
      })
      .catch((err) => console.error("Error fetching route:", err));
  }, [hoveredRoute]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 77.5923,
        latitude: 12.9197,
        zoom: 8,
      }}
      style={{ borderRadius: "0.25rem" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {/* Show route if hovered */}
      {routeData && (
        <Source id="route" type="geojson" data={routeData}>
          <Layer
            id="route-layer"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-color": "#007bff",
              "line-width": 6,
              "line-opacity": 0.5,
            }}
          />
        </Source>
      )}

      {/* Show default bus markers when no route is hovered */}
      {!hoveredRoute?.length &&
        defaultBusCoordinates.map(([lng, lat], index) => (
          <Marker key={index} longitude={lng} latitude={lat} anchor="center">
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FFA500",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
              }}
            >
              <BusFront size={15} color="white" />
            </div>
          </Marker>
        ))}

      {/* Start Marker (Red Circle) */}
      {hoveredRoute?.length > 0 && (
        <Marker
          longitude={hoveredRoute[0][0]}
          latitude={hoveredRoute[0][1]}
          anchor="bottom"
        >
          <div
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: "#E74C3C",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </Marker>
      )}

      {/* Intermediate Bus Markers */}
      {hoveredRoute?.slice(1, -1).map(([lng, lat], index) => (
        <Marker key={index} longitude={lng} latitude={lat} anchor="center">
          <div
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: "#007bff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            <BusFront size={10} color="white" />
          </div>
        </Marker>
      ))}

      {/* End Marker (Green Circle) */}
      {hoveredRoute?.length > 1 && (
        <Marker
          longitude={hoveredRoute[hoveredRoute.length - 1][0]}
          latitude={hoveredRoute[hoveredRoute.length - 1][1]}
          anchor="bottom"
        >
          <div
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: "#2ECC71",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </Marker>
      )}
    </Map>
  );
};
