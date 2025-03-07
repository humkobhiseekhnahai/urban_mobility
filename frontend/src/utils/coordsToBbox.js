export const coordsToBbox = (lat, lng, radius) => {
  const minLat = lat - radius;
  const maxLat = lat + radius;
  const minLng = lng - radius;
  const maxLng = lng + radius;

  return `${minLat},${minLng},${maxLat},${maxLng}`;
};
