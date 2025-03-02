import { useAtom } from 'jotai';
import { inputAtom } from '../../hooks/atoms/atom';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function RouteInput() {
  const [stops, setStops] = useAtom(inputAtom);

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
    <div className="relative mt-4">
      <div className="flex items-center space-x-4 py-4 px-4 overflow-x-auto scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600">
        {stops.map((stop, index) => (
          <div key={index} className="flex items-center shrink-0">
            <div className="relative group">
              <input
                type="text"
                value={stop.location}
                onChange={(e) => handleLocationChange(index, e.target.value)}
                placeholder={index === 0 ? 'Warehouse' : `Stop ${index}`}
                className="bg-neutral-800 text-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-48"
              />
              
              {index > 0 && (
                <button
                  onClick={() => removeStop(index)}
                  className="absolute -right-2 -top-2 bg-neutral-700 rounded-full p-1 hover:bg-red-500 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            {index < stops.length - 1 && (
              <div className="text-gray-500">
                <span className="text-xl">→</span>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addStop}
          className="flex items-center text-blue-500 hover:text-blue-400 transition-colors shrink-0"
        >
          <PlusCircleIcon className="w-6 h-6 mr-2" />
          <span>Add Stop</span>
        </button>
      </div>
    </div>
  );
}