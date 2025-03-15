export const filterRoutesBySourceDest = (busRoutes, source, destination) => {
  if (!source && !destination) return busRoutes;

  if (busRoutes == null) return;

  let filtered = busRoutes.filter(
    (route) =>
      route?.origin?.toLowerCase().includes(source.toLowerCase()) &&
      route?.destination?.toLowerCase().includes(destination.toLowerCase())
  );

  return filtered;
};
