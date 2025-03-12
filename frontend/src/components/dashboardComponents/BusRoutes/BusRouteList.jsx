import { BusRouteCard } from "./BusRouteCard";

export const BusRouteList = ({
  busRoutes,
  filteredRoutes,
  handleViewRouteDetails,
}) => {
  return (
    <div className="w-full p-4 h-[75%] overflow-y-auto">
      <div className="w-full flex flex-col space-y-4 items-center">
        {busRoutes != null ? (
          busRoutes.length != 0 ? (
            filteredRoutes.map((route) => {
              return (
                <BusRouteCard
                  route={route}
                  key={route.routeNumber}
                  onViewDetails={() => handleViewRouteDetails(route)}
                />
              );
            })
          ) : (
            <p className="text-gray-200">Loading Bus ROutes...</p>
          )
        ) : (
          <p className="text-gray-200">Error Fetching Bus Routes</p>
        )}
      </div>
    </div>
  );
};
