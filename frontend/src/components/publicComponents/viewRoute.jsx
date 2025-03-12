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

export default function ViewRoutes({ routes, loading, fetchRoutes }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center h-10 px-4 border border-neutral-700 text-white rounded-md hover:bg-neutral-700"
            onClick={fetchRoutes}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
        <table className="w-full min-w-max border border-neutral-700 rounded-lg overflow-hidden">
          <thead className="bg-neutral-800">
            <tr className="border-b border-neutral-700">
              <th className="text-left py-3 px-4 text-white font-medium">Route</th>
              <th className="text-left py-3 px-4 text-white font-medium">Origin</th>
              <th className="text-left py-3 px-4 text-white font-medium">Destination</th>
              <th className="text-left py-3 px-4 text-white font-medium">
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-white font-medium">
                <div className="flex items-center">
                  Start Time
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-white font-medium">Timeframe</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id} className="border-b border-neutral-700 hover:bg-neutral-800">
                <td className="py-3 px-4 font-medium text-white">
                  <div className="flex items-center">
                    <div className="bg-neutral-700 p-2 rounded-md mr-2">
                      <Bus className="h-4 w-4 text-blue-400" />
                    </div>
                    RT-{route.id}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-300">{route.origin.name}</td>
                <td className="py-3 px-4 text-gray-300">{route.destination.name}</td>
                <td className="py-3 px-4 text-gray-300">{route.date}</td>
                <td className="py-3 px-4 text-gray-300">{route.startTime}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTimeframeColor(route.timeframe)}`}>
                    {route.timeframe}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}