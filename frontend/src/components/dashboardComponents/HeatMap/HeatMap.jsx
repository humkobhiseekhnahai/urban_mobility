import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HeatLayer } from "./HeatLayer";
import { fetchTrafficData } from "../../../utils/fetchTrafficData";

export const HeatMap = ({ lat, lng, radius }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [hmerror, setHMError] = useState(false);

  const [loading, setLoading] = useState(true);

  const lati = parseFloat(12.9446);
  const longi = parseFloat(77.6837);

  useEffect(() => {
    setLoading(true);
    fetchTrafficData(lati, longi, radius)
      .then((data) => {
        setHeatmapData(data);
        setHMError(false);
      })
      .catch((err) => {
        console.error("Heatmap Data Fetch Error:", err);
        setHMError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lati, longi, radius]);

  return (
    <div className="w-full flex items-center justify-center">
      {loading ? (
        <p className="text-gray-200 text-center p-4">Loading Heatmap...</p>
      ) : hmerror || !heatmapData.length ? (
        <p className="text-gray-200 text-center p-4">
          Error Fetching Heatmap Data
        </p>
      ) : (
        <div className="w-full max-w-4xl mx-auto relative">
          <MapContainer
            center={[lati, longi]}
            zoom={14}
            style={{
              height: "65vh", // Reduced vertical height
              maxHeight: "500px", // Limits stretching
              width: "100%",
              borderRadius: "0.25rem",
            }}
            className="leaflet-container"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {heatmapData.length > 0 && <HeatLayer heatmapData={heatmapData} />}
          </MapContainer>
        </div>
      )}
    </div>
  );
};
