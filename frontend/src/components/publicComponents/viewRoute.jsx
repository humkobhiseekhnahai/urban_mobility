import { useRef, useEffect } from "react";
import { RotateCw, ArrowUpDown, Bus } from "lucide-react";

function getTimeframeColor(timeframe) {
  switch (timeframe) {
    case "Morning Bus":
      return "bg-yellow-600/20 text-yellow-300";
    case "Afternoon Bus":
      return "bg-blue-600/20 text-blue-300";
    case "Evening Bus":
      return "bg-purple-600/20 text-purple-300";
    case "Night Bus":
      return "bg-indigo-600/20 text-indigo-300";
    default:
      return "bg-gray-600/20 text-gray-300";
  }
}

function getTimeframe(time) {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour >= 4 && hour < 12) return "Morning Bus";
  if (hour >= 12 && hour < 17) return "Afternoon Bus";
  if (hour >= 17 && hour < 20) return "Evening Bus";
  if (hour >= 20 || hour < 4) return "Night Bus";
  return "Unknown";
}

function transformRoute(apiRoute) {
  // Add safe parsing with fallback
  const mapJson = JSON.parse(apiRoute.mapJsonContent || "[]");
  
  // Add null checks for mapJson structure
  const lastStop = mapJson?.slice(-1)[0]; // Get last element safely
  const destination = lastStop?.busstop?.split(",")[0] || "Unknown Destination";

  // Add fallback for departureTimes
  const departureTimes = (apiRoute.departureTimes || "").split(",").map(t => t.trim());
  const startTime = departureTimes[0] || "N/A";

  // Add error handling for date parsing
  const date = apiRoute.createdAt ? 
    new Date(apiRoute.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) : "N/A";

  return {
    id: apiRoute.routeNumber || "N/A",
    rawId: apiRoute.id,
    origin: { name: apiRoute.origin || "Unknown Origin" },
    destination: { name: destination },
    date,
    startTime,
    timeframe: getTimeframe(startTime),
  };
}

export default function ViewRoutes({
  routes,
  loading,
  hasMore,
  refreshRoutes,
  fetchNextPage,
  scrollRef,
}) {
  const lastRouteRef = useRef();

  useEffect(() => {
    if (!hasMore || loading || !scrollRef.current || !lastRouteRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          fetchNextPage();
        }
      },
      { root: scrollRef.current, rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(lastRouteRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, fetchNextPage, scrollRef, routes]);

  const displayedRoutes = routes.map(route => {
    try {
      return transformRoute(route);
    } catch (error) {
      console.error("Error transforming route:", error);
      return {
        id: "error",
        rawId: "error",
        origin: { name: "Error" },
        destination: { name: "Error" },
        date: "N/A",
        startTime: "N/A",
        timeframe: "Error"
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center h-10 px-4 border border-neutral-700 text-white rounded-md hover:bg-neutral-700"
            onClick={refreshRoutes}
            disabled={loading}
          >
            {loading && routes.length === 0 ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-blue-400"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              <>
                <RotateCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="w-full inline-block align-middle">
          <div className="overflow-hidden border border-neutral-700 rounded-lg">
            <table className="w-full divide-y divide-neutral-700 table-fixed">
              <thead className="bg-neutral-800">
                <tr>
                  <th scope="col" className="w-1/6 text-left py-3 px-4 text-white font-medium">
                    Route
                  </th>
                  <th scope="col" className="w-1/4 text-left py-3 px-4 text-white font-medium">
                    Origin
                  </th>
                  <th scope="col" className="w-1/4 text-left py-3 px-4 text-white font-medium">
                    Destination
                  </th>
                  <th scope="col" className="w-1/6 text-left py-3 px-4 text-white font-medium">
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" className="w-1/12 text-left py-3 px-4 text-white font-medium">
                    <div className="flex items-center">
                      Time
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" className="w-1/6 text-left py-3 px-4 text-white font-medium">
                    Timeframe
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700 bg-neutral-900">
                {displayedRoutes.map((route, index) => (
                  <tr
                    key={`${route.id}-${index}`}
                    className="hover:bg-neutral-800"
                    ref={index === displayedRoutes.length - 1 ? lastRouteRef : null}
                  >
                    <td className="py-3 px-4 font-medium text-white">
                      <div className="flex items-center">
                        <div className="bg-neutral-700 p-2 rounded-md mr-2 flex-shrink-0">
                          <Bus className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="truncate">{route.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      <div className="truncate" title={route.origin.name}>
                        {route.origin.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      <div className="truncate" title={route.destination.name}>
                        {route.destination.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      <div className="truncate">{route.date}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      <div className="truncate">{route.startTime}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getTimeframeColor(
                          route.timeframe
                        )}`}
                      >
                        {route.timeframe}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {hasMore && (
          <div
            className="h-10 flex items-center justify-center"
          >
            {loading && routes.length > 0 && (
              <span className="flex items-center text-white">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-blue-400"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading more routes...
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}