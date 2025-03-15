import { Button, Typography, Chip } from "@material-tailwind/react";
import { MapPinIcon, BusIcon, XIcon } from "lucide-react";
import { ModalMap } from "./ModalMap";

export const BusRouteModal = ({ isOpen, onClose, route }) => {
  // Parse the mapJsonContent
  const busStops = route.mapJsonContent;

  if (!isOpen) return null;

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Floating panel */}
      <div className="fixed left-0 top-0 h-screen w-full bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        <section className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <Chip
                value={route.routeNumber}
                className="rounded-full bg-gray-800 py-1 text-white font-bold w-auto h-8 md:h-10 flex items-center justify-center text-base md:text-lg"
              />
              <div>
                <Typography
                  variant="h5"
                  color="gray"
                  className="font-bold text-base md:text-lg"
                >
                  {route.routeName}
                </Typography>
                <Typography
                  variant="small"
                  className="text-gray-600 text-xs md:text-sm"
                >
                  {busStops?.length} stops
                </Typography>
              </div>
            </div>
            <Button
              variant="text"
              color="gray"
              onClick={onClose}
              className="p-1 md:p-2 rounded-full hover:bg-gray-100"
            >
              <XIcon className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          {/* Content (Bus Stops & Map) */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Bus Stops Section */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto p-2 md:p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="relative pl-6 border-l-2 border-gray-200">
                {busStops.map((stop, index) => (
                  <div key={index} className="mb-3 md:mb-4 relative">
                    <div className="absolute w-4 h-4 md:w-5 md:h-5 bg-gray-800 rounded-full -left-[8px] md:-left-[10px] top-2 flex items-center justify-center text-white text-[8px] md:text-[10px]">
                      {index + 1}
                    </div>
                    <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                      <Typography
                        variant="h6"
                        color="gray"
                        className="font-medium text-xs md:text-sm"
                      >
                        {stop.busstop.split(",")[0]}
                      </Typography>

                      {stop.busstop.split(",")?.length > 1 && (
                        <Typography
                          variant="small"
                          className="text-gray-500 text-[10px] md:text-xs mt-1 block"
                        >
                          {stop.busstop.split(",").slice(1).join(", ")}
                        </Typography>
                      )}

                      <div className="flex items-center gap-1 md:gap-2 text-gray-400 text-[10px] md:text-xs mt-1 md:mt-2">
                        <MapPinIcon className="h-2 w-2 md:h-3 md:w-3" />
                        <span className="truncate">
                          {stop.latlons[0]}, {stop.latlons[1]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Section */}
            <div className="w-full h-1/2 md:h-full">
              <ModalMap
                lng={busStops[0]?.latlons[1]}
                lat={busStops[0]?.latlons[0]}
                busStops={busStops}
                isOpen={isOpen}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 md:p-4 border-t border-gray-200">
            <Button
              size="sm"
              fullWidth
              className="bg-gray-800 hover:bg-gray-900 flex items-center justify-center gap-1 md:gap-2 py-2 text-xs md:text-sm"
              onClick={onClose}
            >
              <BusIcon className="h-3 w-3 md:h-4 md:w-4" />
              Close Route Details
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
