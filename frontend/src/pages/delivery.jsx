import RouteInput from "../components/routeInput"
import { NavBar } from "../components/navBar"
import DeliveryMap from "../components/deliveryMap"


export const Delivery = () => {
  return (
    <div className="min-w-screen min-h-screen h-full bg-neutral-900 overflow-x-hidden">
      <div className="max-w-6xl min-h-screen mx-auto">
        {/* navbar */}
        <NavBar />

        {/* map */}
        <div className="flex justify-evenly m-5 h-fit">
          <RouteInput />
          <div className="text-white border-2 h-fit w-full">
            <DeliveryMap/>
          </div>
        </div>

        {/* inputs */}

        <div className="flex justify-center mt-10">
          <input
            placeholder="Enter vehicle type*"
            className="text-white text-center border-2 p-2 m-2 mr-5"
          />
          <input
            placeholder="Enter capacity*"
            className="text-white text-center border-2 p-2 m-2"
          />
        </div>

      </div>
    </div>
  )
}
