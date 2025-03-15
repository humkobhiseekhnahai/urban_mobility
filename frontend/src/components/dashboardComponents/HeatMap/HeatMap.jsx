import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { MapContainer, TileLayer } from "react-leaflet";
import { fetchTrafficData } from "../../../utils/fetchTrafficData";
import { useEffect, useState } from "react";
import { HeatLayer } from "./HeatLayer";

export const HeatMap = ({ lat, lng, radius }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [hmerror, setHMError] = useState(false);

  const lati = parseFloat("12.9516");
  const longi = parseFloat("77.6961");

  useEffect(() => {
    fetchTrafficData(lati, longi, radius)
      .then((data) => {
        setHeatmapData(data);
      })
      .catch((err) => {
        setHMError(true);
      });
  }, []);

  return (
    <div className="w-full h-full">
      {hmerror || !heatmapData || heatmapData?.length == 0 ? (
        <p>Error Fetching Heatmap Data</p>
      ) : (
        <MapContainer
          center={[lati, longi]}
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
      )}
    </div>
  );
};
