import { Button, Typography, Chip } from "@material-tailwind/react";
import { MapPinIcon, BusIcon, XIcon } from "lucide-react";

export const BusRouteModal = ({ isOpen, onClose, route }) => {
  // Parse the mapJsonContent
  const busStops = route.mapJsonContent;

  if (!isOpen) return null;

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Floating panel */}
      <div className="fixed left-20 top-0 h-screen w-[450px] bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Chip
              value={route.routeNumber}
              className="rounded-full bg-gray-800 py-1 text-white font-bold w-10 h-10 flex items-center justify-center text-lg"
            />
            <div>
              <Typography
                variant="h5"
                color="gray"
                className="font-bold text-lg"
              >
                {route.routeName}
              </Typography>
              <Typography variant="small" className="text-gray-600">
                {busStops.length} stops
              </Typography>
            </div>
          </div>
          <Button
            variant="text"
            color="gray"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="relative pl-6 border-l-2 border-gray-200">
            {busStops.map((stop, index) => (
              <div key={index} className="mb-4 relative">
                <div className="absolute w-3 h-3 bg-gray-800 rounded-full -left-[7px] top-2"></div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Typography
                    variant="h6"
                    color="gray"
                    className="font-medium text-sm"
                  >
                    {stop.busstop.split(",")[0]}
                  </Typography>

                  {stop.busstop.split(",").length > 1 && (
                    <Typography
                      variant="small"
                      className="text-gray-500 text-xs mt-1 block"
                    >
                      {stop.busstop.split(",").slice(1).join(", ")}
                    </Typography>
                  )}

                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                    <MapPinIcon className="h-3 w-3" />
                    <span>
                      {stop.latlons[0]}, {stop.latlons[1]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            size="sm"
            fullWidth
            className="bg-gray-800 hover:bg-gray-900 flex items-center justify-center gap-2"
            onClick={onClose}
          >
            <BusIcon className="h-4 w-4" />
            Close Route Details
          </Button>
        </div>
      </div>
    </>
  );
};
