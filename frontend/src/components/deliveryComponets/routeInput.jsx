// routeInput.js
import { useRecoilState } from "recoil";
import { inputAtom } from "../../hooks/atoms/atom";

export default function RouteInput() {
  const [stops, setStops] = useRecoilState(inputAtom);

  const addStop = () => {
    setStops([...stops, { location: "", capacity: 0 }]);
  };

  const removeStop = (index) => {
    if (index > 0) {
      const newStops = stops.filter((_, i) => i !== index);
      setStops(newStops);
    }
  };

  const handleLocationChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], location: value };
    setStops(newStops);
  };

  return (
    <div className="h-full p-8 bg-slate-800 text-white rounded-lg shadow-md transition duration-300">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-100 mb-6 border-b pb-2">
          Route Planner
        </h1>
        <div className="flex flex-col space-y-4">
          {stops.map((stop, index) => (
            <div key={index} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  value={stop.location}
                  onChange={(e) => handleLocationChange(index, e.target.value)}
                  placeholder={index === 0 ? "Starting point" : `Stop ${index}`}
                  className="w-full p-2 border border-gray-600 bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
                {index > 0 && (
                  <button
                    onClick={() => removeStop(index)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:scale-110"
                  >
                    <span className="text-gray-100 hover:text-red-600 text-xl">
                      &times;
                    </span>
                  </button>
                )}
              </div>
              {index < stops.length - 1 && (
                <div className="flex justify-center my-2">
                  <span className="text-2xl text-gray-500">↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addStop}
          className="mt-4 w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Stop +
        </button>
      </div>
    </div>
  );
}
