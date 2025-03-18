import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, Home, Plus, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ViewRoutes from "./viewRoute";
import CreateRoute from "./createRoute";
import OptimizeRoute from "./optimizeRoute";
import axios from "axios";
import ErrorBoundary from "./errorBoundary";

const SERVER_URL_BUS = import.meta.env.VITE_SERVER_URL;

export default function RouteDashboard() {
    const [activeTab, setActiveTab] = useState("view");
    const [routes, setRoutes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const scrollRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        fetchRoutes(1); // Fetch the first page on component mount
    }, []);

    const fetchRoutes = async (pageNum, query = "") => {
        setLoading(true);
        const startTime = Date.now();

        try {
            const endpoint = `${SERVER_URL_BUS}/api/bus-routes?page=${pageNum}&limit=15${query ? `&search=${encodeURIComponent(query)}` : ""}`;
            const response = await axios.get(endpoint);
            const { data, currentPage, totalPages } = response.data;

            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(1000 - elapsedTime, 0); // Ensure minimum 1 second loading
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
            fetchRoutes(page, searchQuery);
        }
    };

    const refreshRoutes = () => {
        setRoutes([]);
        setPage(1);
        setHasMore(true);
        fetchRoutes(1, searchQuery); // Refresh by fetching the first page
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value;
            setSearchQuery(query);
            setRoutes([]);
            setPage(1);
            setHasMore(true);
            fetchRoutes(1, query);
        }
    };

    const handleMobileSearch = () => {
        if (searchInputRef.current) {
            const query = searchInputRef.current.value;
            setSearchQuery(query);
            setRoutes([]);
            setPage(1);
            setHasMore(true);
            fetchRoutes(1, query);
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen bg-neutral-900 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-neutral-700 h-16 sm:h-20">
                <div className="flex-1">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Bus Route Management</h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400">Manage and optimize bus routes</p>
                </div>
                
                {/* Mobile Search Button */}
                <div className="md:hidden flex items-center space-x-2">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-md bg-neutral-800 text-white"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
                
                {/* Desktop Search */}
                <div className="hidden md:block relative w-64 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        placeholder="Search routes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="pl-10 pr-4 w-full bg-neutral-800 border border-neutral-700 rounded-md h-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-neutral-800 border-b border-neutral-700 shadow-lg z-20"
                    >
                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    placeholder="Search routes..."
                                    className="pl-10 pr-10 w-full bg-neutral-800 border border-neutral-700 rounded-md h-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    onKeyDown={handleSearch}
                                    defaultValue={searchQuery}
                                />
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    onClick={handleMobileSearch}
                                >
                                    <RotateCw className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <button
                                onClick={() => handleTabChange("view")}
                                className={`py-4 px-6 text-white text-left flex items-center hover:bg-neutral-700 ${activeTab === "view" ? "bg-neutral-700" : ""}`}
                            >
                                <Home className="mr-3 h-5 w-5" /> View Routes
                            </button>
                            <button
                                onClick={() => handleTabChange("create")}
                                className={`py-4 px-6 text-white text-left flex items-center hover:bg-neutral-700 ${activeTab === "create" ? "bg-neutral-700" : ""}`}
                            >
                                <Plus className="mr-3 h-5 w-5" /> Create Route
                            </button>
                            <button
                                onClick={() => handleTabChange("optimize")}
                                className={`py-4 px-6 text-white text-left flex items-center hover:bg-neutral-700 ${activeTab === "optimize" ? "bg-neutral-700" : ""}`}
                            >
                                <RotateCw className="mr-3 h-5 w-5" /> Optimize Routes
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Tab Pills */}
            <div className="md:hidden flex p-2 bg-neutral-900">
                <div className="flex w-full bg-neutral-800 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setActiveTab("view")}
                        className={`flex-1 py-2 text-xs font-medium text-white ${activeTab === "view" ? "bg-neutral-700" : ""}`}
                    >
                        View
                    </button>
                    <button
                        onClick={() => setActiveTab("create")}
                        className={`flex-1 py-2 text-xs font-medium text-white ${activeTab === "create" ? "bg-neutral-700" : ""}`}
                    >
                        Create
                    </button>
                    <button
                        onClick={() => setActiveTab("optimize")}
                        className={`flex-1 py-2 text-xs font-medium text-white ${activeTab === "optimize" ? "bg-neutral-700" : ""}`}
                    >
                        Optimize
                    </button>
                </div>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:block w-full px-4 sm:px-6 pt-4 sm:pt-6">
                <div className="grid grid-cols-3 bg-neutral-800 rounded-md overflow-hidden">
                    <button
                        onClick={() => setActiveTab("view")}
                        className={`py-2 text-white transition-colors ${activeTab === "view" ? "bg-neutral-700 font-bold" : "hover:bg-neutral-700/50"}`}
                    >
                        View Routes
                    </button>
                    <button
                        onClick={() => setActiveTab("create")}
                        className={`py-2 text-white transition-colors ${activeTab === "create" ? "bg-neutral-700 font-bold" : "hover:bg-neutral-700/50"}`}
                    >
                        Create Route
                    </button>
                    <button
                        onClick={() => setActiveTab("optimize")}
                        className={`py-2 text-white transition-colors ${activeTab === "optimize" ? "bg-neutral-700 font-bold" : "hover:bg-neutral-700/50"}`}
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
                className="flex-1 overflow-auto p-2 sm:p-4 md:p-6"
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
                    {activeTab === "optimize" && <OptimizeRoute />}
                </ErrorBoundary>
            </motion.div>
        </div>
    );
}
