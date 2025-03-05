import { useAtom } from 'jotai';
import { startingLocationAtom, deliveryStopsAtom } from '../../hooks/atoms/atom';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function RouteInput({ attemptedOptimize }) {
  const [startingLocation, setStartingLocation] = useAtom(startingLocationAtom);
  const [deliveryStops, setDeliveryStops] = useAtom(deliveryStopsAtom);

  const addStop = () => {
    setDeliveryStops([...deliveryStops, { location: '', capacity: 0 }]);
  };

  const removeStop = (index) => {
    setDeliveryStops(deliveryStops.filter((_, i) => i !== index));
  };

  const handleStartLocationChange = (value) => {
    setStartingLocation(value);
  };

  const handleDeliveryLocationChange = (index, value) => {
    const newStops = [...deliveryStops];
    newStops[index].location = value;
    setDeliveryStops(newStops);
  };

  const handleCapacityChange = (index, value) => {
    const newStops = [...deliveryStops];
    newStops[index].capacity = Number(value) || 0;
    setDeliveryStops(newStops);
  };

  return (
    <div className="relative mt-4">
      <div className="flex items-center space-x-2 md:space-x-4 py-4 px-2 md:px-4 overflow-x-auto scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600 max-w-[90vw]">
        {/* Starting Location */}
        <motion.div className="flex items-center shrink-0 gap-2 md:gap-4">
          <div className="relative">
            <input
              type="text"
              value={startingLocation}
              onChange={(e) => handleStartLocationChange(e.target.value)}
              placeholder="Warehouse"
              className={`bg-neutral-800 text-gray-200 px-2 md:px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-36 md:w-48 text-sm md:text-base ${
                attemptedOptimize && startingLocation.trim() === '' ? 'border border-red-500' : ''
              }`}
              required
            />
            {attemptedOptimize && startingLocation.trim() === '' && (
              <span className="absolute left-0 bottom-[-1.25rem] text-red-500 text-xs md:text-sm">Required</span>
            )}
          </div>
          <div className="text-gray-500">
            <span className="text-lg md:text-xl">→</span>
          </div>
        </motion.div>

        {/* Delivery Stops */}
        <AnimatePresence>
          {deliveryStops.map((stop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center shrink-0 gap-2 md:gap-4"
            >
              <div className="relative flex flex-col gap-2">
                <input
                  type="text"
                  value={stop.location}
                  onChange={(e) => handleDeliveryLocationChange(index, e.target.value)}
                  placeholder={`Stop ${index + 1}`}
                  className={`bg-neutral-800 text-gray-200 px-2 md:px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-36 md:w-48 text-sm md:text-base ${
                    attemptedOptimize && stop.location.trim() === '' ? 'border border-red-500' : ''
                  }`}
                />
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={stop.capacity || ''}
                  onChange={(e) => handleCapacityChange(index, e.target.value)}
                  placeholder="Weight (kg)"
                  className={`bg-neutral-800 text-gray-200 px-2 md:px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-36 md:w-48 text-sm md:text-base ${
                    attemptedOptimize && stop.capacity <= 0 ? 'border border-red-500' : ''
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeStop(index)}
                  className="absolute -right-2 -top-2 bg-neutral-700 rounded-full p-1 hover:bg-red-500 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              {index < deliveryStops.length - 1 && (
                <div className="text-gray-500">
                  <span className="text-lg md:text-xl">→</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addStop}
          className="flex items-center text-blue-500 hover:text-blue-400 transition-colors shrink-0 text-sm md:text-base"
        >
          <PlusCircleIcon className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" />
          <span>Add Stop</span>
        </motion.button>
      </div>
    </div>
  );
}