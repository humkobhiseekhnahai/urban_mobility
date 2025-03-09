import { useState, useEffect } from "react";

export const useReverseGeocode = (latitude, longitude) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchLocation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch location");
        }
        const data = await response.json();
        setLocation(data.display_name.split(",").slice(0, 3).join(", "));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [latitude, longitude]);

  return { location, error, loading };
};
