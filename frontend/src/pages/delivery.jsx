// Delivery.js
import RouteInput from "../components/deliveryComponets/routeInput"
import { NavBar } from "../components/navBar"
import DeliveryMap from "../components/deliveryComponets/deliveryMap"
import { Inventory } from "../components/deliveryComponets/inventory"

export const Delivery = () => {
  return (
    <div className="w-screen min-h-screen bg-neutral-900 overflow-x-hidden">
      <div className="max-w-6xl mx-auto min-h-screen w-full px-4">
        <NavBar />

        {/* Map Section */}
        <div className="flex flex-col md:flex-row justify-between items-stretch m-5 gap-4">
          <RouteInput />
          <div className="text-white border-2 flex-grow h-fit w-full">
            <DeliveryMap />
          </div>
        </div>

        {/* Inputs */}
        <div className="flex justify-center items-center mt-10">
          <input
            disabled
            placeholder="Sample Vehicle"
            className="text-white text-sm sm:text-base text-center border-2 p-2 m-1 sm:m-2 cursor-not-allowed rounded-md w-full sm:w-auto max-w-xs sm:max-w-sm"
          />
          <input
            type="number"
            placeholder="Enter capacity*"
            className="text-white text-sm sm:text-base text-center border-2 p-2 m-1 sm:m-2 rounded-md w-full sm:w-auto max-w-xs sm:max-w-sm "
          />
        </div>

        <Inventory />
        
        <div className="flex justify-center items-center m-2">
          <button className="text-white bg-blue-500 py-3 px-20 rounded-md">
            OPTIMIZE
          </button>
        </div>
      </div>
    </div>
  )
}
