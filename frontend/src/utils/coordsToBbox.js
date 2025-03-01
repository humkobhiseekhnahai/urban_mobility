export const coordsToBbox = (lat, lng, radiusInMeters) => {
  const radius = radiusInMeters / 111320; // Convert meters to degrees
  const minLat = lat - radius;
  const maxLat = lat + radius;
  const minLng = lng - radius / Math.cos(lat * (Math.PI / 180));
  const maxLng = lng + radius / Math.cos(lat * (Math.PI / 180));
  return `${minLng},${minLat},${maxLng},${maxLat}`;
};
