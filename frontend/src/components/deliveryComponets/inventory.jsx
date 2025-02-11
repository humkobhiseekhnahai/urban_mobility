// Inventory.js
import { useRecoilState } from "recoil";
import { inputAtom } from "../../hooks/atoms/atom";

export const Inventory = () => {
  const [stops, setStops] = useRecoilState(inputAtom);

  const handleCapacityChange = (index, value) => {
    const newStops = [...stops];
    newStops[index].capacity = Number(value);
    setStops(newStops);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-slate-800 text-white max-w-4xl w-full border-2 border-gray-700 my-10 p-6 overflow-hidden rounded-lg shadow-md transition duration-300">
        <div className="font-medium flex justify-center items-center text-xl my-5">
          INVENTORY
        </div>

        {/* Column Headers */}
        <div className="flex justify-between items-center border-b border-gray-600 pb-2 px-4">
          <div className="font-medium w-1/2 text-center">Location</div>
          <div className="font-medium w-1/2 text-center">Weight</div>
        </div>

        {stops.map((stop, index) => (
          <div key={index} className="flex gap-2 items-center m-4 px-4">
            <input
              value={stop.location}
              readOnly
              placeholder={index === 0 ? "Starting Point" : `Stop ${index}`}
              className="text-white text-sm sm:text-base text-center border-2 border-gray-600 p-2 rounded-md w-1/2 bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <input
              type="number"
              placeholder="Enter weight"
              value={stop.capacity}
              onChange={(e) => handleCapacityChange(index, e.target.value)}
              className="text-white text-sm sm:text-base text-center border-2 border-gray-600 p-2 rounded-md w-1/2 bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 "
            />

            
          </div>
        ))}
      </div>
    </div>
  );
};
