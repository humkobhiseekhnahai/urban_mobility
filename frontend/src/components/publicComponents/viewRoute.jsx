import { useRef, useEffect } from "react";
import { RotateCw, ArrowUpDown, Bus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getTimeframeColor(timeframe) {
  switch (timeframe) {
    case "Morning Bus":
      return "bg-amber-600/10 text-amber-300";
    case "Afternoon Bus":
      return "bg-blue-600/10 text-blue-300";
    case "Evening Bus":
      return "bg-purple-600/10 text-purple-300";
    case "Night Bus":
      return "bg-indigo-600/10 text-indigo-300";
    default:
      return "bg-gray-600/10 text-gray-300";
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
  const mapJson = JSON.parse(apiRoute.mapJsonContent || "[]");
  const lastStop = mapJson?.slice(-1)[0];
  const destination = lastStop?.busstop?.split(",")[0] || "Unknown Destination";
  const departureTimes = (apiRoute.departureTimes || "").split(",").map(t => t.trim());
  const startTime = departureTimes[0] || "N/A";
  const date = apiRoute.createdAt
    ? new Date(apiRoute.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";
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
  const loadingRef = useRef();

  useEffect(() => {
    if (!hasMore || !scrollRef.current || !loadingRef.current) return;

    const loadingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          fetchNextPage();
        }
      },
      { root: scrollRef.current, rootMargin: "300px", threshold: 0.1 }
    );

    loadingObserver.observe(loadingRef.current);
    return () => loadingObserver.disconnect();
  }, [hasMore, loading, fetchNextPage, scrollRef]);

  const displayedRoutes = routes.map((route) => {
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
        timeframe: "Error",
      };
    }
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center h-10 px-4 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
          onClick={refreshRoutes}
          disabled={loading}
        >
          {loading && routes.length === 0 ? (
            <span className="flex items-center">
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 mr-3 text-blue-400"
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
              </motion.svg>
              Loading...
            </span>
          ) : (
            <>
              <RotateCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </motion.button>
      </div>

      <motion.div
        className="overflow-x-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full inline-block align-middle">
          <div className="overflow-hidden rounded-lg shadow-md">
            <table className="w-full divide-y divide-neutral-800 table-fixed">
              <thead className="bg-neutral-900 sticky top-0 z-10">
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
                      <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </motion.div>
                    </div>
                  </th>
                  <th scope="col" className="w-1/12 text-left py-3 px-4 text-white font-medium">
                    <div className="flex items-center">
                      Time
                      <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </motion.div>
                    </div>
                  </th>
                  <th scope="col" className="w-1/6 text-left py-3 px-4 text-white font-medium">
                    Timeframe
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-900">
  <AnimatePresence mode="sync">
    {displayedRoutes.map((route) => (
      <motion.tr
        key={route.rawId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="hover:bg-neutral-800/50 transition-colors"
      >
        <td className="py-3 px-4 font-medium text-white">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-neutral-800 p-2 rounded-md mr-2 flex-shrink-0"
            >
              <Bus className="h-4 w-4 text-blue-400" />
            </motion.div>
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
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`px-2 py-1 rounded-md text-xs font-medium ${getTimeframeColor(
              route.timeframe
            )}`}
          >
            {route.timeframe}
          </motion.span>
        </td>
      </motion.tr>
    ))}
  </AnimatePresence>
</tbody>
            </table>
          </div>
        </div>

        <div ref={loadingRef} className="h-20 flex items-center justify-center mt-4">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center text-white"
            >
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 mr-3 text-blue-400"
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
              </motion.svg>
              Loading more routes...
            </motion.div>
          )}
        </div>

        {!hasMore && routes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 text-gray-400 text-sm"
          >
            End of routes
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}