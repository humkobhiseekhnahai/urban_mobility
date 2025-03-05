import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useEffect } from "react";

export const HeatLayer = ({ heatmapData }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    const heatLayer = L.heatLayer(heatmapData, {
      radius: 10,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
    }).addTo(map);

    return () => {
      heatLayer.remove();
    };
  }, [map, heatmapData]);

  return null;
};
