import { useState, useEffect, useRef } from "react";
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

  useEffect(() => {
    setLimit(limit); // Ensure the limit is correctly initialized
  }, [filteredRoutes]);

  const loadMoreRoutes = () => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setLimit((prevLimit) => prevLimit + 10); // Increase limit by 10
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreRoutes();
        }
      },
      { root: containerRef.current, threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, limit]);

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
