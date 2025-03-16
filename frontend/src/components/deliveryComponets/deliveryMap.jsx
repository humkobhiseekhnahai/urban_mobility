<<<<<<< HEAD
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

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: STYLE_URLS.streets,
      center: [77.5946, 12.9716],
      zoom: 11
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup on unmount
=======
// DeliveryMap.js
import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { markerAtom } from '../../hooks/atoms/atom';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const DeliveryMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markers = useAtomValue(markerAtom);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = tt.map({
        key: import.meta.env.VITE_TOMTOM_API_KEY,
        container: "map",
        center: [77.5946, 12.9716],
        zoom: 11
      });
      
      mapRef.current = mapInstance;
      setMap(mapInstance);
    }

>>>>>>> aa5370f84fa0dacff31fc133428352fface2ea58
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
<<<<<<< HEAD
=======
        setMap(null);
>>>>>>> aa5370f84fa0dacff31fc133428352fface2ea58
      }
    };
  }, []);

<<<<<<< HEAD
  // Update map style when satellite toggle changes
  useEffect(() => {
    if (!mapRef.current) return;

    const newStyle = isSatellite ? STYLE_URLS.satellite : STYLE_URLS.streets;

    mapRef.current.once('styledata', () => {
      updateMarkers(); // Re-add markers after style change
    });

    mapRef.current.setStyle(newStyle);
  }, [isSatellite]);

  // Update markers when marker data changes
  useEffect(() => {
    if (mapRef.current) {
      updateMarkers();
    }
  }, [markers]);

  // Function to update markers with styled popups
  const updateMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers with styled popups
    const bounds = new mapboxgl.LngLatBounds();
    markers.forEach((coordinates, index) => {
      // Set popup content: "Warehouse" for the first marker, "Location X" for others
      const popupContent = index === 0 ? 'Warehouse' : `Location ${index}`;
      const popupHtml = `
        <div style="
          background-color: ${isSatellite ? '#333' : '#F5F5F5'};
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
      bounds.extend(coordinates);
    });

    // Adjust map view to fit all markers
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
=======
  useEffect(() => {
    if (map && markers.length > 0) {
      // Clear existing markers
      map.getStyle().layers.forEach(layer => {
        if (layer.id.includes('marker')) {
          map.removeLayer(layer.id);
        }
      });
      map.getSource('markers')?.setData({
        type: 'FeatureCollection',
        features: []
      });

      // Add new markers
      const bounds = new tt.LngLatBounds();
      markers.forEach((coordinates, index) => {
        const popup = new tt.Popup({ offset: 30 })
          .setHTML(`Location ${index + 1}`);

        new tt.Marker()
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map);

        bounds.extend(coordinates);
      });

      map.fitBounds(bounds, { padding: 50 });
    }
  }, [map, markers]);

  return <div id="map" className="w-full h-[500px]" />;
};

export default DeliveryMap;
>>>>>>> aa5370f84fa0dacff31fc133428352fface2ea58
