import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { MapContainer, TileLayer } from "react-leaflet";
import { fetchTrafficData } from "../../../utils/fetchTrafficData";
import { useEffect, useState } from "react";
import { HeatLayer } from "./HeatLayer";

export const HeatMap = ({ lat, lng, radius }) => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    fetchTrafficData(lat, lng, radius).then((data) => {
      setHeatmapData(data);
    });
  }, []);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      style={{
        height: "100%",
        width: "100%",
        zIndex: 0,
        borderRadius: "0.25rem",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {heatmapData.length > 0 && <HeatLayer heatmapData={heatmapData} />}
    </MapContainer>
  );
};
