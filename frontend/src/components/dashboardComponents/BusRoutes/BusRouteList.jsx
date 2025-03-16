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

  // ✅ Ensure the limit is correctly initialized when `filteredRoutes` change
  useEffect(() => {
    setLimit(limit);
  }, [filteredRoutes]);

  // ✅ Use useCallback to prevent unnecessary re-creation of function
  const loadMoreRoutes = useCallback(() => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setLimit((prevLimit) => prevLimit + 10); // Increase limit by 10
      setLoading(false);
    }, 2000);
  }, [loading, setLimit]);

  useEffect(() => {
    if (!observerRef.current) return;

    let observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreRoutes();
        }
      },
      {
        root: null, // ✅ Observe relative to viewport
        rootMargin: "200px", // ✅ Trigger before fully visible
        threshold: 0.1,
      }
    );

    const timeoutId = setTimeout(() => {
      if (observerRef.current) {
        observer.observe(observerRef.current);
      }
    }, 500); // ✅ Ensure the DOM has updated before observing

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [loading, limit, filteredRoutes.length, loadMoreRoutes]); // ✅ Include filteredRoutes.length

  return (
    <div ref={containerRef} className="w-full p-4 h-[92%] overflow-y-auto">
      <div className="w-full flex flex-col space-y-4 items-center">
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

              {/* Loader & Intersection Observer Trigger */}
              <div
                ref={observerRef}
                className="w-full flex justify-center py-4"
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
