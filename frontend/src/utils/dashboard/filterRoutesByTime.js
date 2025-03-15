export const filterRoutesByTime = (busRoutes, selectedTimes) => {
  if (!busRoutes || !selectedTimes || selectedTimes.length === 0)
    return busRoutes;

  return busRoutes.filter((route) => {
    console.log("Route:", route);

    // Split the departure times into an array
    const departureHours = route.departureTimes.split(", ").map(
      (time) => parseInt(time.split(":"[0])) // Extract the hour part
    );

    // Check if any departure time falls within the selected slots
    return (
      selectedTimes.length === 0 ||
      departureHours.some((departureHour) => {
        return (
          selectedTimes.includes("All Time") ||
          selectedTimes.some((timeSlot) => {
            switch (timeSlot) {
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
          })
        );
      })
    );
  });
};
