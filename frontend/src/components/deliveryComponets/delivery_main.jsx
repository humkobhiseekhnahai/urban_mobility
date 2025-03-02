// Delivery.js - Updated with vehicle number input and state
import { useState } from 'react';
import RouteInput from "./routeInput"
import DeliveryMap from "./deliveryMap"
import { Inventory } from "./inventory"

export const Delivery_new = () => {
    const [numberOfVehicles, setNumberOfVehicles] = useState(1);

    return (
        <div className="w-full min-h-screen bg-neutral-900 overflow-x-hidden">
            <div className="max-w-6xl min-h-screen w-full px-4 mx-auto">

                {/* Top Section - Route Planner */}
                <div className="pt-8 pb-6 border-b border-neutral-700">
                    <h1 className="text-2xl font-light text-gray-200 mb-2">Route Planner</h1>
                    <RouteInput />
                </div>

                {/* Map Section - Added height container */}
                <div className="my-6 h-[550px]"> {/* Fixed height container */}
                    <div className="text-white border border-neutral-700 rounded-lg overflow-hidden h-full">
                        <DeliveryMap />
                    </div>
                </div>

                {/* Inputs - Added vehicle number */}
                <div className="flex justify-center mt-8 space-x-4">
                    <div className="flex-1 max-w-xs">
                        <label className="block text-sm text-gray-400 mb-1">Vehicle Type</label>
                        <div className="relative">
                            <input
                                disabled
                                value="Sample Truck"
                                className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 
                focus:outline-none focus:border-blue-500 transition-colors duration-300
                cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex-1 max-w-xs">
                        <label className="block text-sm text-gray-400 mb-1">Capacity (kg)</label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="Enter capacity"
                                className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 
                focus:outline-none focus:border-blue-500 transition-colors duration-300
                placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 max-w-xs">
                        <label className="block text-sm text-gray-400 mb-1">Number of Vehicles</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                placeholder="Enter quantity"
                                onChange={(e) => setNumberOfVehicles(e.target.value)}
                                className="w-full bg-transparent text-gray-200 border-b border-gray-600 py-2 px-1 
                focus:outline-none focus:border-blue-500 transition-colors duration-300
                placeholder-gray-500"
                            />
                        </div>
                    </div>
                </div>


                <Inventory />

                <div className="flex justify-center my-8">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-light py-3 px-16 rounded-lg transition-colors">
                        OPTIMIZE ROUTE
                    </button>
                </div>
            </div>
        </div>
    )
}
