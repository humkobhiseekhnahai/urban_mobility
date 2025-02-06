import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import { markerSelector } from '../hooks/atoms/atom';

const DeliveryMap = () => {
  const [map, setMap] = useState(null);
  
  // Coordinates for different locations in Bangalore
  const markers = useRecoilValue(markerSelector);

  useEffect(() => {
    const map = tt.map({
      key: "4pIumWwcCYdl3HsGdBAp3PHp8nmDlG6l",
      container: "map",
      center: [77.5946, 12.9716], // Center at Bangalore
      zoom: 11
    });

    setMap(map);

    map.on('load', () => {
      // Add markers with popups
      markers.forEach((coordinates, index) => {
        const popup = new tt.Popup({ offset: 30 })
          .setHTML(`Location ${index + 1}`);

        new tt.Marker()
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map);
      });

      // Fit map to show all markers
      const bounds = new tt.LngLatBounds();
      markers.forEach(coordinates => {
        bounds.extend(coordinates);
      });
      map.fitBounds(bounds, { padding: 50 });
    });

    return () => map.remove();
  }, [markers]);

  return <div id="map" className="w-full h-[500px]" />;
};

export default DeliveryMap;