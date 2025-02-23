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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMap(null);
      }
    };
  }, []);

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
