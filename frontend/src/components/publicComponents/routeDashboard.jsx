import { useState, useEffect, useRef } from "react";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ViewRoutes from "./viewRoute";
import CreateRoute from "./createRoute";
import OptimizeRoute from "./optimizeRoute";
import axios from "axios";
import ErrorBoundary from "./errorBoundary";

export default function RouteDashboard() {
    const [activeTab, setActiveTab] = useState("view");
    const [routes, setRoutes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchRoutes(1); // Fetch the first page on component mount
    }, []);

    const fetchRoutes = async (pageNum) => {
        setLoading(true);
        const startTime = Date.now();

        try {
            const response = await axios.get(
                `http://localhost:3001/api/bus-routes?page=${pageNum}&limit=15`
            );
            const { data, currentPage, totalPages } = response.data;

            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(2000 - elapsedTime, 0); // Ensure minimum 2 seconds loading
            await new Promise((resolve) => setTimeout(resolve, delay));

            setRoutes((prev) => (pageNum === 1 ? data : [...prev, ...data]));
            setPage(currentPage + 1);
            setHasMore(currentPage < totalPages);
        } catch (error) {
            console.error("Error fetching routes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNextPage = () => {
        if (hasMore && !loading) {
            fetchRoutes(page);
        }
    };

    const refreshRoutes = () => {
        setRoutes([]);
        setPage(1);
        setHasMore(true);
        fetchRoutes(1); // Refresh by fetching the first page
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    return (
        <div className="flex-1 flex flex-col h-screen bg-neutral-900 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-700 h-20">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Bus Route Management</h1>
                    <p className="text-sm md:text-base text-gray-400">Manage and optimize bus routes</p>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-neutral-800 border-b border-neutral-700"
                    >
                        <div className="flex flex-col">
                            <button
                                onClick={() => handleTabChange("view")}
                                className={`py-4 px-6 text-white text-left hover:bg-neutral-700 ${activeTab === "view" ? "bg-neutral-700" : ""}`}
                            >
                                View Routes
                            </button>
                            <button
                                onClick={() => handleTabChange("create")}
                                className={`py-4 px-6 text-white text-left hover:bg-neutral-700 ${activeTab === "create" ? "bg-neutral-700" : ""}`}
                            >
                                Create Route
                            </button>
                            <button
                                onClick={() => handleTabChange("optimize")}
                                className={`py-4 px-6 text-white text-left hover:bg-neutral-700 ${activeTab === "optimize" ? "bg-neutral-700" : ""}`}
                            >
                                Optimize Routes
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    placeholder="Search routes..."
                                    className="pl-10 w-full bg-neutral-800 border border-neutral-700 rounded-md h-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Tabs */}
            <div className="hidden md:block w-full px-6 pt-6">
                <div className="grid grid-cols-3 bg-neutral-800 rounded-md overflow-hidden">
                    <button
                        onClick={() => setActiveTab("view")}
                        className={`py-2 text-white ${activeTab === "view" ? "bg-neutral-700 font-bold" : ""}`}
                    >
                        View Routes
                    </button>
                    <button
                        onClick={() => setActiveTab("create")}
                        className={`py-2 text-white ${activeTab === "create" ? "bg-neutral-700 font-bold" : ""}`}
                    >
                        Create Route
                    </button>
                    <button
                        onClick={() => setActiveTab("optimize")}
                        className={`py-2 text-white ${activeTab === "optimize" ? "bg-neutral-700 font-bold" : ""}`}
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
                className="flex-1 overflow-auto p-4 md:p-6"
                ref={scrollRef}
            >
                <ErrorBoundary>
                    {activeTab === "view" && (
                        <ViewRoutes
                            routes={routes}
                            loading={loading}
                            hasMore={hasMore}
                            fetchNextPage={fetchNextPage}
                            refreshRoutes={refreshRoutes}
                            scrollRef={scrollRef}
                        />
                    )}
                    {activeTab === "create" && <CreateRoute setRoutes={setRoutes} />}
                    {activeTab === "optimize" && <OptimizeRoute routes={routes} />}
                </ErrorBoundary>
            </motion.div>
        </div>
    );
}