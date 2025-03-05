import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { deliveryStopsAtom } from '../../hooks/atoms/atom';
import { motion } from 'framer-motion';
import { fetchLocationName } from '../../lib/fetch_location_name';

export const Inventory = () => {
  const [deliveryStops, setDeliveryStops] = useAtom(deliveryStopsAtom);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const loadAddresses = async () => {
      const addressesPromises = deliveryStops.map(async (stop) => {
        try {
          const [lat, lon] = stop.location.split(',').map(Number);
          return await fetchLocationName(lat, lon);
        } catch (error) {
          console.error('Error fetching address:', error);
          return 'Address unavailable';
        }
      });
      
      const resolvedAddresses = await Promise.all(addressesPromises);
      setAddresses(resolvedAddresses);
    };

    loadAddresses();
  }, [deliveryStops]);

  const handleCapacityChange = (index, value) => {
    const numericValue = Number(value) || 0;
    const newStops = deliveryStops.map((stop, i) =>
      i === index ? { ...stop, capacity: numericValue } : stop
    );
    setDeliveryStops(newStops);
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
          Delivery Inventory
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-neutral-700">
                <th className="px-3 py-2 md:px-6 md:py-4 text-center font-medium">Stop</th>
                <th className="px-3 py-2 md:px-6 md:py-4 text-left font-medium">Coordinates</th>
                <th className="px-3 py-2 md:px-6 md:py-4 text-left font-medium">Address</th>
                <th className="px-3 py-2 md:px-6 md:py-4 text-left font-medium">Weight (kg)</th>
              </tr>
            </thead>
            <tbody>
              {deliveryStops.map((stop, index) => {
                const [lat, lon] = stop.location.split(',').map(coord => 
                  Number(coord).toFixed(4)
                );
                
                return (
                  <tr
                    key={index}
                    className="hover:bg-neutral-700/50 transition-colors border-b border-neutral-700 last:border-0"
                  >
                    <td className="px-3 py-2 md:px-6 md:py-4 text-gray-300 text-center">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 text-gray-400">
                      {lat}, {lon}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 text-gray-300">
                      {addresses[index] || 'Loading address...'}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Enter weight"
                        value={stop.capacity || ''}
                        onChange={(e) => handleCapacityChange(index, e.target.value)}
                        className={`w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none border-b border-neutral-600 md:border-none text-xs md:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          stop.capacity <= 0 ? 'border-red-500' : ''
                        }`}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};