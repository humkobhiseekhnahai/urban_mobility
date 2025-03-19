import { useState, useEffect, useRef, useCallback } from "react";
import { BusRouteCard } from "./BusRouteCard";

export const BusRouteList = ({
  busRoutes,
  filteredRoutes,
  handleViewRouteDetails,
  limit,
  setLimit,
}) => {
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  // Ensure the limit is correctly initialized when `filteredRoutes` changes
  useEffect(() => {
    setLimit(limit);
  }, [filteredRoutes]);

  // Load more routes function
  const loadMoreRoutes = useCallback(() => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setLimit((prevLimit) => prevLimit + 10); // Increase limit by 10
      setLoading(false);
    }, 1500);
  }, [loading, setLimit]);

  // Auto-load more routes only on larger screens
  useEffect(() => {
    const isLargeScreen = window.innerWidth > 640; // Apply auto-scroll only if screen width > 640px

    // Prevent auto-loading if filters are applied
    if (
      !isLargeScreen ||
      !observerRef.current ||
      filteredRoutes.length < busRoutes.length
    )
      return;

    let observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreRoutes();
        }
      },
      {
        root: null, // Observe relative to viewport
        rootMargin: "200px", // Trigger before fully visible
        threshold: 0.1,
      }
    );

    const timeoutId = setTimeout(() => {
      if (observerRef.current) {
        observer.observe(observerRef.current);
      }
    }, 500); // Ensure DOM updates before observing

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [loading, limit, filteredRoutes.length, loadMoreRoutes, busRoutes.length]);

  return (
    <div
      ref={containerRef}
      className="w-full p-4 h-[100%] md:h-[82%] overflow-y-auto flex flex-col items-center space-y-2"
    >
      <div className="w-full flex flex-col space-y-2 items-center">
        {busRoutes ? (
          busRoutes.length !== 0 ? (
            <>
              {filteredRoutes.slice(0, limit).map((route) => (
                <BusRouteCard
                  route={route}
                  key={route.routeNumber}
                  onViewDetails={() => handleViewRouteDetails(route)}
                />
              ))}

              {/* Load More Button (Visible on Small Screens) */}
              <button
                onClick={loadMoreRoutes}
                className="block sm:hidden bg-blue-600 text-white px-3 py-1 text-sm rounded-md mt-2 mb-2"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>

              {/* Loader & Auto Load More Trigger (Only for Large Screens) */}
              <div
                ref={observerRef}
                className="hidden sm:flex w-full justify-center py-4"
              >
                {loading && (
                  <span className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></span>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-200">Loading Bus Routes...</p>
          )
        ) : (
          <p className="text-gray-200">Error Fetching Bus Routes</p>
        )}
      </div>
    </div>
  );
};
