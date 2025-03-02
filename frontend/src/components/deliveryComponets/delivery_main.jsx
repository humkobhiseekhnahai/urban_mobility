import { useState } from 'react';
import RouteInput from './routeInput';
import DeliveryMap from "./deliveryMap"
import { Inventory } from './inventory';
import { motion } from 'framer-motion';

export const Delivery_new = () => {
    const [numberOfVehicles, setNumberOfVehicles] = useState(1);

    return (
        <div className="w-full min-h-screen bg-neutral-900 overflow-x-hidden">
            <div className="max-w-6xl mx-auto px-4">
                {/* Route Planner Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="pt-8 pb-6 border-b border-neutral-700"
                >
                    <h1 className="text-2xl font-light text-gray-200 mb-2">Route Planner</h1>
                    <RouteInput />
                </motion.div>

                {/* Map Section - Restored */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="my-6 h-[300px] md:h-[550px] flex-shrink-0" // Add flex-shrink-0
                >
                    <div className="text-white border border-neutral-700 rounded-lg overflow-hidden h-full w-full">
                        <DeliveryMap />
                    </div>
                </motion.div>

                {/* Inputs Section - Modified for full-width on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 -mx-4 md:mx-0" // Negative margin on small screens to extend full width
                >
                    <div className="flex flex-col md:flex-row md:justify-center md:space-x-4">
                        {/* Vehicle Type Input */}
                        <div className="flex-1 md:max-w-xs border-b border-neutral-700 md:border-b-0 px-4 md:px-0 py-4 md:py-0">
                            <label className="block text-sm text-gray-400 mb-1">Vehicle Type</label>
                            <div className="relative">
                                <input
                                    disabled
                                    value="Sample Truck"
                                    className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors duration-300 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Capacity Input */}
                        <div className="flex-1 md:max-w-xs border-b border-neutral-700 md:border-b-0 px-4 md:px-0 py-4 md:py-0">
                            <label className="block text-sm text-gray-400 mb-1">Capacity (kg)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="Enter capacity"
                                    className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors duration-300 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Number of Vehicles Input */}
                        <div className="flex-1 md:max-w-xs border-b border-neutral-700 md:border-b-0 px-4 md:px-0 py-4 md:py-0">
                            <label className="block text-sm text-gray-400 mb-1">Number of Vehicles</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Enter quantity"
                                    onChange={(e) => setNumberOfVehicles(e.target.value)}
                                    className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 focus:outline-none focus:border-blue-500 transition-colors duration-300 placeholder-gray-500"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Inventory */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Inventory />
                </motion.div>

                {/* Optimize Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex justify-center my-8"
                >
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-light py-3 px-16 rounded-lg transition-colors"
                    >
                        OPTIMIZE ROUTE
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};