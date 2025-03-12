import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Public_RouteMap = ({ route }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [isSatellite, setIsSatellite] = useState(false);
  const routeSourceId = 'route-source';
  const routeLayerId = 'route-layer';

  // Define style URLs
  const STYLE_URLS = {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
  };

  const addRouteLayer = useCallback(async () => {
    if (!mapRef.current || !route || route.length < 2) return;

    try {
      const coordinates = route.map(point => [point[0], point[1]]);
      const query = coordinates.map(coord => coord.join(',')).join(';');

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${query}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) throw new Error('Failed to fetch directions');

      const data = await response.json();
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No routes found');
      }
      const routeGeometry = data.routes[0].geometry;

      if (mapRef.current.getLayer(routeLayerId)) {
        mapRef.current.removeLayer(routeLayerId);
        mapRef.current.removeSource(routeSourceId);
      }

      mapRef.current.addSource(routeSourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: routeGeometry,
        },
      });

      mapRef.current.addLayer({
        id: routeLayerId,
        type: 'line',
        source: routeSourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': isSatellite ? '#ff4444' : '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.75,
        },
      });

      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord));
      mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    } catch (error) {
      console.error('Error updating route:', error);
    }
  }, [route, isSatellite]);

  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !route) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const svgString = `
<svg width="100%" height="100%" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <style type="text/css"> .st0{fill:#000000;} </style>
    <g>
      <path class="st0" d="M440.286,108.659H58.524c-12.164,0-23.058,7.928-26.761,19.459L3.977,213.405 C1.272,221.593,0,230.172,0,238.89v121.382h56.267h7.216c-0.022-0.66-0.1-1.31-0.1-1.979c0-33.673,27.387-61.06,61.056-61.06 c33.67,0,61.056,27.387,61.056,61.06c0,0.669-0.078,1.32-0.1,1.979h150.762c-0.022-0.66-0.1-1.31-0.1-1.979 c0-33.673,27.387-61.06,61.056-61.06c33.67,0,61.056,27.387,61.056,61.06c0,0.669-0.078,1.32-0.1,1.979H512V180.374 C512,140.795,479.864,108.659,440.286,108.659z M98.42,275.663c0,3.994-3.256,7.242-7.259,7.242H50.797 c-4.012,0-7.268-3.248-7.268-7.242v-37.234c0-4.758,0.738-9.482,2.232-14.023l23.618-72.722c0.973-2.988,3.778-5.019,6.917-5.019 h14.866c4.003,0,7.259,3.256,7.259,7.259V275.663z M227.2,219.483c0,2.014-1.624,3.638-3.643,3.638h-83.567 c-1.998,0-3.621-1.624-3.621-3.638v-69.17c0-2.006,1.624-3.647,3.621-3.647h83.567c2.018,0,3.643,1.641,3.643,3.647V219.483z M351.722,219.483c0,2.014-1.624,3.638-3.622,3.638h-86.684c-2.002,0-3.63-1.624-3.63-3.638v-69.17c0-2.006,1.628-3.647,3.63-3.647 H348.1c1.997,0,3.622,1.641,3.622,3.647V219.483z M468.45,215.862c0,3.986-3.256,7.259-7.259,7.259h-66.926 c-4.011,0-7.259-3.273-7.259-7.259v-61.937c0-4.003,3.248-7.259,7.259-7.259h39.283c19.242,0,34.902,15.673,34.902,34.906V215.862z "></path>
      <path class="st0" d="M124.439,313.235c-24.882,0-45.053,20.172-45.053,45.057c0,24.886,20.171,45.048,45.053,45.048 c24.882,0,45.053-20.162,45.053-45.048C169.492,333.407,149.321,313.235,124.439,313.235z M124.439,377.135 c-10.398,0-18.847-8.431-18.847-18.842c0-10.376,8.449-18.825,18.847-18.825c10.399,0,18.848,8.449,18.848,18.825 C143.286,368.704,134.838,377.135,124.439,377.135z"></path>
      <path class="st0" d="M397.113,313.235c-24.882,0-45.053,20.172-45.053,45.057c0,24.886,20.171,45.048,45.053,45.048 c24.882,0,45.053-20.162,45.053-45.048C442.166,333.407,421.995,313.235,397.113,313.235z M397.113,377.135 c-10.394,0-18.847-8.431-18.847-18.842c0-10.376,8.453-18.825,18.847-18.825c10.394,0,18.847,8.449,18.847,18.825 C415.96,368.704,407.507,377.135,397.113,377.135z"></path>
    </g>
  </g>
</svg>
    `;

    // Add new markers with bus icons and styled popups
    route.forEach((coordinates, index) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.cursor = 'pointer';
      el.innerHTML = svgString;

      const popupContent = index === 0 ? 'Warehouse' : `Stop ${index}`;
      const popupHtml = `
        <div style="
          background-color: ${isSatellite ? '#333' : 'white'};
          color: ${isSatellite ? 'white' : '#1a1a1a'};
          padding: 8px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          font-size: 14px;
          font-family: Arial, sans-serif;
        ">
          ${popupContent}
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(popupHtml))
        .addTo(mapRef.current);

      marker.getPopup().on('open', () => {
        const lngLat = marker.getLngLat();
        mapRef.current.flyTo({
          center: lngLat,
          zoom: 15,
          essential: true,
        });
      });

      markersRef.current.push(marker);

      if (index === route.length - 1) {
        mapRef.current.flyTo({
          center: coordinates,
          zoom: 15,
          essential: true,
        });
      }
    });
  }, [route, isSatellite]);

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: STYLE_URLS.streets,
      center: [77.5946, 12.9716], // Default center (Bangalore, India)
      zoom: 11,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapRef.current.on('load', () => {
      updateMarkers();
      addRouteLayer();
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [updateMarkers, addRouteLayer]);

  // Switch between street and satellite views
  useEffect(() => {
    if (!mapRef.current) return;

    const newStyle = isSatellite ? STYLE_URLS.satellite : STYLE_URLS.streets;

    mapRef.current.once('styledata', () => {
      updateMarkers();
      addRouteLayer();
    });

    mapRef.current.setStyle(newStyle);
  }, [isSatellite, updateMarkers, addRouteLayer]);

  // Update markers and route when the route prop changes
  useEffect(() => {
    if (mapRef.current?.isStyleLoaded()) {
      updateMarkers();
      addRouteLayer();
    }
  }, [route, updateMarkers, addRouteLayer]);

  return (
    <div className="relative w-full h-full">
      <button
        onClick={() => setIsSatellite(!isSatellite)}
        className={`
          absolute top-4 left-4 z-10 
          px-4 py-2 
          text-xs font-medium tracking-wider uppercase
          transition-all duration-300 ease-in-out
          rounded-md backdrop-blur-sm 
          border border-gray-200
          ${isSatellite
            ? 'bg-gray-900/75 text-white hover:bg-gray-900/90'
            : 'bg-white/75 text-gray-800 hover:bg-white/90'}
          shadow-lg
        `}
      >
        {isSatellite ? 'Street View' : 'Satellite View'}
      </button>
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default Public_RouteMap;