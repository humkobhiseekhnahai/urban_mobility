import { useAtom } from 'jotai';
import { inputAtom } from '../../hooks/atoms/atom';
import { motion } from 'framer-motion';

export const Inventory = () => {
  const [stops, setStops] = useAtom(inputAtom);

  const handleCapacityChange = (index, value) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      const newStops = stops.map((stop, i) =>
        i === index ? { ...stop, capacity: numericValue } : stop
      );
      setStops(newStops);
    }
  };

  const handlePriorityChange = (index, value) => {
    const newStops = [...stops];
    newStops[index].priority = value;
    setStops(newStops);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 py-6"
    >
      <div className="max-w-4xl mx-auto bg-neutral-800 rounded-xl shadow-lg">
        <h2 className="text-lg md:text-xl font-semibold text-gray-200 p-4 md:p-6 border-b border-neutral-700">
          Inventory Management
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-neutral-700">
                <th className="px-3 py-2 md:px-6 md:py-4 text-left font-medium">Location</th>
                <th className="px-3 py-2 md:px-6 md:py-4 text-left font-medium">Weight (kg)</th>
                <th className="px-3 py-2 md:px-6 md:py-4 text-left font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {stops.map((stop, index) => (
                <tr
                  key={index}
                  className="hover:bg-neutral-700/50 transition-colors border-b border-neutral-700 last:border-0"
                >
                  <td className="px-3 py-2 md:px-6 md:py-4">
                    <input
                      value={stop.location}
                      readOnly
                      className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none border-b border-neutral-600 md:border-none text-xs md:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 md:px-6 md:py-4">
                    <input
                      type="number"
                      placeholder="Enter weight"
                      value={stops[index].capacity || ''}
                      onChange={(e) => handleCapacityChange(index, e.target.value)}
                      className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none border-b border-neutral-600 md:border-none text-xs md:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>
                  <td className="px-3 py-2 md:px-6 md:py-4">
                    <select
                      value={stop.priority || 'low'}
                      onChange={(e) => handlePriorityChange(index, e.target.value)}
                      className="w-full bg-neutral-800 text-gray-200 px-1 py-1 md:px-3 md:py-2 rounded-md border border-neutral-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 shadow-sm transition-all duration-200 text-xs md:text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};