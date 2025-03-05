import Map, { Marker } from "react-map-gl/mapbox";

export const MapBox = ({ lat, lng }) => {
  const mapBoxAccessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  return (
    <div className="w-full h-full">
      <Map
        mapboxAccessToken={mapBoxAccessToken}
        initialViewState={{
          latitude: lat || 0,
          longitude: lng || 0,
          zoom: 14,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ borderRadius: "0.25rem" }}
      >
        <Marker latitude={lat} longitude={lng} />
      </Map>
    </div>
  );
};
