import { useEffect, useRef, useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { markerAtom } from '../../hooks/atoms/atom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const RouteMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [isSatellite, setIsSatellite] = useState(false);
  const markers = useAtomValue(markerAtom);
  const routeSourceId = 'route-source';
  const routeLayerId = 'route-layer';

  // Define style URLs
  const STYLE_URLS = {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9'
  };

  const addRouteLayer = useCallback(async () => {
    if (!mapRef.current || markers.length < 2) return;

    try {
      // Convert markers to [lon, lat] format
      const coordinates = markers.map(point => [point[0], point[1]]);
      
      // Get directions from Mapbox API
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.join(';')}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch directions');
      
      const data = await response.json();
      const route = data.routes[0].geometry;

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
          geometry: route
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
  }, [markers, isSatellite]);

  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((coordinates, index) => {
      const marker = new mapboxgl.Marker({
        color: isSatellite ? '#ff4444' : '#3b82f6'
      })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`Location ${index + 1}`))
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [markers, isSatellite]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map with default style
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: STYLE_URLS.streets,
      center: [77.5946, 12.9716],
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
  }, [markers]);

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

export default RouteMap;
