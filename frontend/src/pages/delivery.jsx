// Delivery.js
import RouteInput from "../components/deliveryComponets/routeInput";
import { NavBar } from "../components/navBar";
import DeliveryMap from "../components/deliveryComponets/deliveryMap";
import { Inventory } from "../components/deliveryComponets/inventory";

export const Delivery = () => {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 overflow-x-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto min-h-screen w-full px-4">
        <NavBar />

        {/* Map Section */}
        <div className="flex flex-col md:flex-row justify-between items-stretch m-5 gap-4">
          {/* Left: Route Input */}
          <div className="md:w-1/3 w-full">
            <RouteInput />
          </div>

          {/* Right: Delivery Map */}
          <div className="md:w-2/3 w-full">
            <div className="text-white border-2 border-gray-700 rounded-lg shadow-lg transition transform hover:scale-105">
              <DeliveryMap />
            </div>
          </div>
        </div>

        {/* Vehicle and Capacity Inputs */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-10 gap-4">
          <input
            disabled
            placeholder="Sample Vehicle"
            className="text-white text-sm sm:text-base text-center border-2 border-gray-600 p-2 m-1 rounded-md w-full sm:w-64 bg-slate-800 opacity-70"
          />
          <input
            type="number"
            placeholder="Enter capacity*"
            className="text-white text-sm sm:text-base text-center border-2 border-gray-600 p-2 m-1 rounded-md w-full sm:w-64 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        {/* Inventory Section */}
        <Inventory />

        {/* Optimize Button */}
        <div className="flex justify-center items-center m-2">
          <button className="text-white bg-blue-500 py-3 px-20 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            OPTIMIZE
          </button>
        </div>
      </div>
    </div>
  );
};
