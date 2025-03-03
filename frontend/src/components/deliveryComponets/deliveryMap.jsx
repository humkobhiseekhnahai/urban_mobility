import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { markerAtom } from '../../hooks/atoms/atom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const DeliveryMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [isSatellite, setIsSatellite] = useState(false);
  const markers = useAtomValue(markerAtom);

  // Define style URLs
  const STYLE_URLS = {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9'
  };

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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Update map style when toggle changes
    const newStyle = isSatellite ? STYLE_URLS.satellite : STYLE_URLS.streets;
    
    mapRef.current.once('styledata', () => {
      // Re-add markers after style change
      updateMarkers();
    });

    mapRef.current.setStyle(newStyle);
  }, [isSatellite]);

  useEffect(() => {
    if (mapRef.current) {
      updateMarkers();
    }
  }, [markers]);

  const updateMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    const bounds = new mapboxgl.LngLatBounds();
    markers.forEach((coordinates, index) => {
      const marker = new mapboxgl.Marker({
        color: isSatellite ? '#ff4444' : '#3b82f6'
      })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`Location ${index + 1}`))
        .addTo(mapRef.current);

      markersRef.current.push(marker);
      bounds.extend(coordinates);
    });

    if (markers.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  };

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

export default DeliveryMap;