import { Check, X, MapPin, Navigation, Map } from "lucide-react";
import { motion } from "framer-motion";

export const RouteRequestCard = ({ request, onApprove, onDeny, index }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "denied":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  return (
    <motion.div variants={item}>
      <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border-l-4 border-[#3B82F6] rounded-lg shadow-xl hover:shadow-[#3B82F6]/20 transition-all duration-300 h-auto w-auto overflow-hidden">
        {/* Card Header with gradient overlay */}
        <div className="relative p-5 pb-3">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#3B82F6]/10 to-transparent opacity-30"></div>
          <div className="relative flex justify-between items-start">
            <h3 className="text-xl font-bold text-white truncate">
              Route Request #{index}
            </h3>
            <span
              className={`${getStatusColor(
                request.status
              )} rounded-full px-3 py-1 text-xs font-medium shadow-md border`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="px-5 pt-2">
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="flex items-center gap-2 text-gray-300 bg-[#2A2A2A] p-2 rounded-lg">
              <div className="bg-[#3B82F6]/20 p-1.5 rounded-md">
                <MapPin className="h-4 w-4 text-[#3B82F6]" />
              </div>
              <span className="text-sm font-medium truncate">
                From: {request.source}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 bg-[#2A2A2A] p-2 rounded-lg">
              <div className="bg-[#3B82F6]/20 p-1.5 rounded-md">
                <Navigation className="h-4 w-4 text-[#3B82F6]" />
              </div>
              <span className="text-sm font-medium truncate">
                To: {request.destination}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <div className="bg-[#3B82F6]/20 p-1 rounded-md">
                <Map className="h-4 w-4 text-[#3B82F6]" />
              </div>
              <span>Waypoints</span>
            </h4>
            <div className="max-h-[90px] overflow-y-auto pr-2 bg-[#2A2A2A] rounded-lg p-2">
              {JSON.parse(request.coordinates).map((coord, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-400 mb-2 pl-4 border-l-2 border-[#3B82F6]/50 relative"
                >
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                  <div className="font-medium text-gray-300">{coord.name}</div>
                  <div className="text-gray-500 text-[10px]">
                    ({coord.lat.toFixed(4)}, {coord.lon.toFixed(4)})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-700/50 mx-5"></div>

        {/* Card Footer */}
        {request.status === "pending" && (
          <div className="p-4 bg-[#1A1A1A]">
            <div className="flex gap-3">
              <button
                className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white flex items-center justify-center py-2 rounded-md shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                onClick={onApprove}
              >
                <Check className="h-4 w-4 mr-2" /> Approve
              </button>
              <button
                className="flex-1 bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 flex items-center justify-center py-2 rounded-md shadow-lg hover:shadow-red-500/20 transition-all"
                onClick={onDeny}
              >
                <X className="h-4 w-4 mr-2" /> Deny
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
