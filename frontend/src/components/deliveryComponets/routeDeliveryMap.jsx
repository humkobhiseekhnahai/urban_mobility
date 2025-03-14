//route delivery map
import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const RouteMap = ({ route }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [isSatellite, setIsSatellite] = useState(false);
  const routeSourceId = 'route-source';
  const routeLayerId = 'route-layer';

  // Define style URLs
  const STYLE_URLS = {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9'
  };

  const addRouteLayer = useCallback(async () => {
    if (!mapRef.current || !route || route.length < 2) return;

    try {
      // Convert route to [lon, lat] format
      const coordinates = route.map(point => [point[0], point[1]]);
      const query = coordinates.map(coord => coord.join(',')).join(';');

      // Get directions from Mapbox API
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${query}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) throw new Error('Failed to fetch directions');

      const data = await response.json();
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No routes found');
      }
      const routeGeometry = data.routes[0].geometry;

      // Remove existing route layer if it exists
      if (mapRef.current.getLayer(routeLayerId)) {
        mapRef.current.removeLayer(routeLayerId);
        mapRef.current.removeSource(routeSourceId);
      }

      // Add new route source and layer
      mapRef.current.addSource(routeSourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: routeGeometry
        }
      });

      mapRef.current.addLayer({
        id: routeLayerId,
        type: 'line',
        source: routeSourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': isSatellite ? '#ff4444' : '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.75
        }
      });

      // Fit map to route bounds
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
  
    // Add new markers with styled popups
    route.forEach((coordinates, index) => {
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
  
      const marker = new mapboxgl.Marker({
        color: isSatellite ? '#ff4444' : '#3b82f6'
      })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(popupHtml))
        .addTo(mapRef.current);
  
      markersRef.current.push(marker);
    });
  }, [route, isSatellite]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map with default style
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: STYLE_URLS.streets,
      center: [77.5946, 12.9716], // Default center
      zoom: 11
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Initial setup
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
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const newStyle = isSatellite ? STYLE_URLS.satellite : STYLE_URLS.streets;

    mapRef.current.once('styledata', () => {
      updateMarkers();
      addRouteLayer();
    });

    mapRef.current.setStyle(newStyle);
  }, [isSatellite]);

  useEffect(() => {
    if (mapRef.current?.isStyleLoaded()) {
      updateMarkers();
      addRouteLayer();
    }
  }, [route]);

  return (
    <div className="relative w-full h-full">
      <button 
        onClick={() => setIsSatellite(!isSatellite)}
        className={`
          absolute top-2 sm:top-4 left-2 sm:left-4 z-10 
          px-2 sm:px-4 py-1 sm:py-2 
          text-[10px] sm:text-xs font-medium tracking-wider uppercase
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

export default RouteMap;
