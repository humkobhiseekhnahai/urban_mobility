import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const MapComponent = ({ optimizationResult }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [legendElement, setLegendElement] = useState(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!optimizationResult || !mapContainerRef.current) return;

    try {
      console.log("Initializing map...");

      // Clean up legend element if it exists
      if (legendElement) {
        try {
          if (legendElement.parentNode) {
            legendElement.parentNode.removeChild(legendElement);
          }
        } catch (e) {
          console.error("Error removing legend:", e);
        }
        setLegendElement(null);
      }

      // Clear previous map instance if it exists
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.error("Error removing map:", e);
        }
      }

      // Ensure Mapbox token is available
      const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
      if (!mapboxToken) {
        throw new Error("Mapbox token not found. Please set VITE_MAPBOX_TOKEN in your environment variables.");
      }

      mapboxgl.accessToken = mapboxToken;

      // Initialize the map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [0, 0],
        zoom: 10,
        attributionControl: false,
      });

      console.log("Map object created:", map);
      setMapInstance(map);
      setMapError(null);

      map.on("load", () => {
        console.log("Map loaded event fired");

        // Force resize to ensure proper rendering
        setTimeout(() => {
          map.resize();
        }, 100);

        if (!mapContainerRef.current) {
          console.error("Map container no longer exists");
          return;
        }

        const bounds = new mapboxgl.LngLatBounds();
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.addControl(new mapboxgl.FullscreenControl(), "top-right");

        // Function to get transfer point coordinates
        const getTransferCoordinates = (transferPoint) => {
          const allStops = [
            ...(optimizationResult.route_1?.stops || []),
            ...(optimizationResult.route_2?.stops || []),
          ];
          const transferStop = allStops.find((s) => s.busstop === transferPoint);
          if (transferStop) {
            return [parseFloat(transferStop.lng), parseFloat(transferStop.lat)];
          }
          console.warn(`Transfer point "${transferPoint}" not found in stops.`);
          return [0, 0];
        };

        if (!optimizationResult.route_1 || !Array.isArray(optimizationResult.route_1.stops)) {
          console.error("Invalid optimization result structure:", optimizationResult);
          setMapError("Invalid optimization result data");
          return;
        }

        // Add Route 1 stops
        const route1Coordinates = [];
        optimizationResult.route_1.stops.forEach((stop, index) => {
          if (!stop || !stop.lng || !stop.lat) return;
          const coordinates = [parseFloat(stop.lng), parseFloat(stop.lat)];
          route1Coordinates.push(coordinates);

          const el = document.createElement("div");
          el.className = "custom-marker";
          el.style.backgroundColor = "#3b82f6";
          el.style.width = "24px";
          el.style.height = "24px";
          el.style.borderRadius = "50%";
          el.style.display = "flex";
          el.style.justifyContent = "center";
          el.style.alignItems = "center";
          el.style.color = "white";
          el.style.fontSize = "12px";
          el.style.fontWeight = "bold";
          el.style.boxShadow = "0 0 0 2px white";
          el.innerHTML = (index + 1).toString();

          new mapboxgl.Marker(el)
            .setLngLat(coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 8px;">
                  <strong>${stop.busstop}</strong>
                  <p style="margin: 4px 0 0 0; font-size: 12px;">Route 1 Stop #${index + 1}</p>
                </div>
              `)
            )
            .addTo(map);
          bounds.extend(coordinates);
        });

        // Add Route 1 line
        if (route1Coordinates.length > 1) {
          map.addSource("route1", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: route1Coordinates,
              },
            },
          });

          map.addLayer({
            id: "route1-line",
            type: "line",
            source: "route1",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#3b82f6", "line-width": 4, "line-opacity": 0.8 },
          });
        }

        // Add transfer point
        if (optimizationResult.transfer_point) {
          const transferCoordinates = getTransferCoordinates(optimizationResult.transfer_point);
          if (transferCoordinates[0] !== 0 || transferCoordinates[1] !== 0) {
            const transferEl = document.createElement("div");
            transferEl.className = "transfer-marker";
            transferEl.style.backgroundColor = "#ef4444";
            transferEl.style.width = "32px";
            transferEl.style.height = "32px";
            transferEl.style.borderRadius = "50%";
            transferEl.style.display = "flex";
            transferEl.style.justifyContent = "center";
            transferEl.style.alignItems = "center";
            transferEl.style.color = "white";
            transferEl.style.fontSize = "16px";
            transferEl.style.fontWeight = "bold";
            transferEl.style.boxShadow = "0 0 0 3px white, 0 0 10px rgba(0,0,0,0.5)";
            transferEl.innerHTML = "T";

            new mapboxgl.Marker(transferEl)
              .setLngLat(transferCoordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(`
                  <div style="padding: 8px;">
                    <strong>Transfer Point</strong>
                    <p style="margin: 4px 0 0 0;">${optimizationResult.transfer_point}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px;">Transfer to Route: ${
                      optimizationResult.transfer_route || "N/A"
                    }</p>
                  </div>
                `)
              )
              .addTo(map);
            bounds.extend(transferCoordinates);
          } else {
            console.warn("Transfer point coordinates not found.");
          }
        }

        // Add Route 2 stops
        if (optimizationResult.route_2 && Array.isArray(optimizationResult.route_2.stops)) {
          const route2Coordinates = [];
          optimizationResult.route_2.stops.forEach((stop, index) => {
            if (!stop || !stop.lng || !stop.lat) return;
            const coordinates = [parseFloat(stop.lng), parseFloat(stop.lat)];
            route2Coordinates.push(coordinates);

            const el = document.createElement("div");
            el.className = "custom-marker";
            el.style.backgroundColor = "#10b981";
            el.style.width = "24px";
            el.style.height = "24px";
            el.style.borderRadius = "50%";
            el.style.display = "flex";
            el.style.justifyContent = "center";
            el.style.alignItems = "center";
            el.style.color = "white";
            el.style.fontSize = "12px";
            el.style.fontWeight = "bold";
            el.style.boxShadow = "0 0 0 2px white";
            el.innerHTML = (index + 1).toString();

            new mapboxgl.Marker(el)
              .setLngLat(coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(`
                  <div style="padding: 8px;">
                    <strong>${stop.busstop}</strong>
                    <p style="margin: 4px 0 0 0; font-size: 12px;">Route 2 Stop #${index + 1}</p>
                  </div>
                `)
              )
              .addTo(map);
            bounds.extend(coordinates);
          });

          // Add Route 2 line
          if (route2Coordinates.length > 1) {
            map.addSource("route2", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: route2Coordinates,
                },
              },
            });

            map.addLayer({
              id: "route2-line",
              type: "line",
              source: "route2",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: { "line-color": "#10b981", "line-width": 4, "line-opacity": 0.8 },
            });
          }
        }

        // Fit map to bounds
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            duration: 1000,
          });
        }

        // Add legend
        const legend = document.createElement("div");
        legend.className = "map-legend";
        legend.style.position = "absolute";
        legend.style.bottom = "10px";
        legend.style.left = "10px";
        legend.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        legend.style.padding = "10px";
        legend.style.borderRadius = "4px";
        legend.style.color = "white";
        legend.style.fontSize = "12px";
        legend.style.zIndex = "1";

        const route_1_route_no =
          optimizationResult.route_1 && optimizationResult.route_1.route_no
            ? optimizationResult.route_1.route_no
            : "N/A";

        let legendHtml = `
          <div style="margin-bottom: 5px; font-weight: bold;">Legend</div>
          <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="width: 12px; height: 12px; background-color: #3b82f6; border-radius: 50%; margin-right: 5px;"></div>
            <span>Route 1 (${route_1_route_no})</span>
          </div>
        `;

        if (optimizationResult.route_2 && optimizationResult.route_2.stops?.length > 0) {
          const route_2_route_no = optimizationResult.route_2.route_no || "N/A";
          legendHtml += `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <div style="width: 12px; height: 12px; background-color: #10b981; border-radius: 50%; margin-right: 5px;"></div>
              <span>Route 2 (${route_2_route_no})</span>
            </div>
          `;
        }

        if (optimizationResult.transfer_point) {
          legendHtml += `
            <div style="display: flex; align-items: center;">
              <div style="width: 12px; height: 12px; background-color: #ef4444; border-radius: 50%; margin-right: 5px;"></div>
              <span>Transfer Point</span>
            </div>
          `;
        }

        legend.innerHTML = legendHtml;

        setLegendElement(legend);
        if (mapContainerRef.current) {
          mapContainerRef.current.appendChild(legend);
        }
      });

      map.on("error", (e) => {
        console.error("Mapbox GL error:", e);
        setMapError(`Map error: ${e.error?.message || "Unknown error"}`);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(`Failed to initialize map: ${error.message}`);
    }

    // Cleanup on unmount or prop change
    return () => {
      if (legendElement) {
        try {
          if (legendElement.parentNode) {
            legendElement.parentNode.removeChild(legendElement);
          }
        } catch (e) {
          console.error("Error removing legend:", e);
        }
        setLegendElement(null);
      }

      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.error("Error removing map:", e);
        }
        setMapInstance(null);
      }
    };
  }, [optimizationResult]);

  return (
    <div className="relative h-full">
      {mapError ? (
        <div className="flex items-center justify-center h-full bg-neutral-800 rounded-lg border border-red-500/30 p-4">
          <div className="text-red-400 text-center">
            <div className="mb-2">⚠️ Map Error</div>
            <div className="text-sm">{mapError}</div>
            <div className="mt-4 text-xs text-gray-400">
              Check console for details and ensure VITE_MAPBOX_TOKEN is set correctly
            </div>
          </div>
        </div>
      ) : (
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "100%" }} />
      )}
      {optimizationResult && (
        <div className="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-sm p-2 rounded-md text-xs text-white">
          Click markers for details
        </div>
      )}
    </div>
  );
};

export default MapComponent;