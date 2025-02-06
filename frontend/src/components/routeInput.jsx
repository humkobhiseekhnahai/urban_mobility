import { inputAtom } from '../hooks/atoms/atom';
import { useRecoilState } from 'recoil';

export default function RouteInput() {
  const [stops, setStops] = useRecoilState(inputAtom);

  const addStop = () => {
    setStops([...stops, '']);
  };

  const removeStop = (index) => {
    if (index > 0) { // Prevent removing the first input
      const newStops = stops.filter((_, i) => i !== index);
      setStops(newStops);
    }
  };

  const handleStopChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  return (
    <div className="h-full p-8 bg-inherit text-white">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Route Planner</h1>
        
        <div className="flex flex-col items-center">
          {stops.map((stop, index) => (
            <div key={index} className="w-full flex flex-col items-center">
              <div className="w-full relative group">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={stop}
                    onChange={(e) => handleStopChange(index, e.target.value)}
                    placeholder={index === 0 ? 'Starting point' : `Stop ${index}`}
                    className="w-full pr-8 p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {console.log(stops)}
                  {index > 0 && (
                    <button
                      onClick={() => removeStop(index)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    >
                      <span className="text-gray-100 hover:text-red-600 text-xl">&times;</span>
                    </button>
                  )}
                </div>
              </div>

              {index < stops.length - 1 && (
                <div className="my-2">
                  <span className="text-2xl text-gray-500">↓</span>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addStop}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Stop +
          </button>
        </div>
      </div>
    </div>
  );
}