import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl/mapbox";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const ModalMap = ({ busStops, isOpen }) => {
  const [routeData, setRouteData] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 77.5923,
    latitude: 12.9197,
    zoom: 12,
  });

  const [popupOpen, setPopupOpen] = useState({});
  const mapRef = useRef(null);

  useEffect(() => {
    if (!busStops || busStops?.length < 2) {
      setRouteData(null);
      return;
    }

    const limitedStops =
      busStops?.length > 25
        ? [...busStops.slice(0, 24), busStops[busStops?.length - 1]]
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
        if (data.routes && data.routes?.length > 0) {
          setRouteData({
            type: "Feature",
            properties: {},
            geometry: data.routes[0].geometry,
          });
        }
      })
      .catch((err) => console.error("Error fetching route:", err));
  }, [busStops]);

  // Fit map to bus stops when modal is opened
  useEffect(() => {
    if (mapRef.current) {
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
  }, [
    busStops,
    isOpen,
    mapRef.current,
    mapRef.current?.fitBounds,
    mapRef.current?.get,
  ]);

  return (
    <Map
      {...viewState}
      ref={mapRef}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      clickTolerance={10} // Increased click tolerance
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

      {/* Bus Stop Markers with Click Event */}
      {busStops.map((stop, index) => (
        <Marker
          key={index}
          longitude={stop.latlons[1]}
          latitude={stop.latlons[0]}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupOpen({ [stop.busstop]: true });
            console.log("Clicked on:", stop.busstop);
            console.log(popupOpen);
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              backgroundColor:
                index === 0
                  ? "#E74C3C"
                  : index === busStops?.length - 1
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
              cursor: "pointer",
            }}
          >
            {index + 1}
          </div>
          {popupOpen[stop.busstop] && (
            <Popup
              longitude={stop.latlons[1]}
              latitude={stop.latlons[0]}
              onClose={() => setPopupOpen(false)}
              closeOnClick={true}
              anchor="top"
            >
              <div style={{ padding: "8px", color: "black" }}>
                <strong>{stop.busstop}</strong>
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </Map>
  );
};
