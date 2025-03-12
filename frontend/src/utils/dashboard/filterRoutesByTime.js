export const filterRoutesByTime = (busRoutes, selectedTime) => {
  if (busRoutes == null) return;

  let filtered = busRoutes;

  if (selectedTime) {
    filtered = filtered.filter((route) => {
      console.log("Route:", route);

      // Split the departure times into an array
      const departureHours = route.departureTimes.split(", ").map(
        (time) => parseInt(time.split(":")[0]) // Extract the hour part
      );

      // Check if any departure time falls within the selected slot
      const isValidTime = departureHours.some((departureHour) => {
        switch (selectedTime) {
          case "All Time":
            return true;
          case "Morning":
            return departureHour >= 4 && departureHour < 12;
          case "Afternoon":
            return departureHour >= 12 && departureHour < 17;
          case "Evening":
            return departureHour >= 17 && departureHour < 20;
          case "Night":
            return departureHour >= 20 || departureHour < 4;
          default:
            return false;
        }
      });

      return isValidTime;
    });
  }

  return filtered;
};
