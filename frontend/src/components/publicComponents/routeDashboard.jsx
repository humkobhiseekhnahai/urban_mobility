import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import ViewRoutes from "./viewRoute";
import CreateRoute from "./createRoute";
import OptimizeRoute from "./optimizeRoute";
// Sample data with coordinates
const initialRoutes = [
  {
    id: 1001,
    origin: { name: "San Francisco, CA", coordinates: [-122.4194, 37.7749] },
    destination: { name: "Los Angeles, CA", coordinates: [-118.2437, 34.0522] },
    stops: [
      { name: "Monterey, CA", coordinates: [-121.8863, 36.6002] },
      { name: "San Luis Obispo, CA", coordinates: [-120.6596, 35.2828] },
    ],
    date: "Mar 9, 2025",
    startTime: "08:30 AM",
    timeframe: "Morning Bus",
  },
  {
    id: 1002,
    origin: { name: "New York, NY", coordinates: [-74.0060, 40.7128] },
    destination: { name: "Boston, MA", coordinates: [-71.0589, 42.3601] },
    stops: [
      { name: "New Haven, CT", coordinates: [-72.9279, 41.3083] },
    ],
    date: "Mar 10, 2025",
    startTime: "09:15 AM",
    timeframe: "Morning Bus",
  },
  {
    id: 1003,
    origin: { name: "Chicago, IL", coordinates: [-87.6298, 41.8781] },
    destination: { name: "Detroit, MI", coordinates: [-83.0458, 42.3314] },
    stops: [
      { name: "Gary, IN", coordinates: [-87.3464, 41.5934] },
    ],
    date: "Mar 8, 2025",
    startTime: "14:00 PM",
    timeframe: "Afternoon Bus",
  },
  {
    id: 1004,
    origin: { name: "Seattle, WA", coordinates: [-122.3321, 47.6062] },
    destination: { name: "Portland, OR", coordinates: [-122.6765, 45.5231] },
    stops: [
      { name: "Tacoma, WA", coordinates: [-122.4443, 47.2529] },
    ],
    date: "Mar 7, 2025",
    startTime: "18:45 PM",
    timeframe: "Evening Bus",
  },
  {
    id: 1005,
    origin: { name: "Austin, TX", coordinates: [-97.7431, 30.2672] },
    destination: { name: "Houston, TX", coordinates: [-95.3698, 29.7604] },
    stops: [
      { name: "San Marcos, TX", coordinates: [-97.9414, 29.8833] },
    ],
    date: "Mar 9, 2025",
    startTime: "22:30 PM",
    timeframe: "Night Bus",
  },
];

export default function RouteDashboard() {
  const [activeTab, setActiveTab] = useState("view");
  const [routes, setRoutes] = useState(initialRoutes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = () => {
    setLoading(true);
    setTimeout(() => {
      setRoutes(initialRoutes);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-700">
        <div>
          <h1 className="text-2xl font-bold text-white">Bus Route Management</h1>
          <p className="text-gray-400">Manage and optimize bus routes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search routes..."
              className="pl-10 w-64 bg-neutral-800 border border-neutral-700 rounded-md h-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full px-6 pt-6">
        <div className="grid grid-cols-3 bg-neutral-800 rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab("view")}
            className={`py-2 text-white ${activeTab === "view" ? "bg-neutral-700" : ""}`}
          >
            View Routes
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`py-2 text-white ${activeTab === "create" ? "bg-neutral-700" : ""}`}
          >
            Create Route
          </button>
          <button
            onClick={() => setActiveTab("optimize")}
            className={`py-2 text-white ${activeTab === "optimize" ? "bg-neutral-700" : ""}`}
          >
            Optimize Routes
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto p-6"
      >
        {activeTab === "view" && (
          <ViewRoutes routes={routes} loading={loading} fetchRoutes={fetchRoutes} />
        )}
        {activeTab === "create" && <CreateRoute setRoutes={setRoutes} />}
        {activeTab === "optimize" && <OptimizeRoute routes={routes} />}
      </motion.div>
    </div>
  );
}