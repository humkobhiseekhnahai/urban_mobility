<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { deliveryStopsAtom } from '../../hooks/atoms/atom';
import { motion } from 'framer-motion';
import { fetchLocationName } from '../../lib/fetch_location_name';

export const Inventory = ({ totalCapacity, attemptedOptimize }) => {
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
                          stop.capacity <= 0 || (totalCapacity > 0 && stop.capacity > totalCapacity) ? 'border-red-500' : ''
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
=======
// Inventory.js
// Inventory.js (updated imports)
import { useAtom } from 'jotai';
import { inputAtom } from "../../hooks/atoms/atom";
import { useState } from "react";

export const Inventory = () => {
    const [stops, setStops] = useAtom(inputAtom);
    const [priority, setPriority] = useState("Priority");
    const handleCapacityChange = (index, value) => {
        const newStops = [...stops];
        newStops[index].capacity = Number(value);
        setStops(newStops);
    };

    return (
        <div className="w-full h-fit flex justify-center items-center">
            <div className="text-white w-fit h-fit border-2 border-gray-100 my-10 px-20">
                <div className="font-medium flex justify-center items-center underline text-xl my-5">
                    INVENTORY
                </div>

                {/* Column Headers */}
                <div className="flex justify-center items-center space-x-4 m-5">
                    <div className="font-medium">Location</div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="font-medium">Weight</div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="font-medium">Priority</div>
                </div>

                {stops.map((stop, index) => (
                    <div key={index} className="flex justify-center items-center space-x-4 m-5">
                        <div>

                            <input
                                value={stop.location}
                                readOnly
                                placeholder={index === 0 ? 'Starting Point' : `Stop ${index}`}
                                className="border-2 border-gray-100 p-2"
                            />

                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div>
                            <input
                                type="number"
                                placeholder="Enter weight"
                                value={stop.capacity}
                                onChange={(e) => handleCapacityChange(index, e.target.value)}
                                className="border-2 border-gray-100 p-2"
                            />
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div>
                           
                                <select 
                                    id="priorityId" 
                                    value={priority}
                                    className="bg-inherit border border-white text-white text-sm block w-full p-3 "
                                    onChange={(e)=>{
                                        setPriority(e.target.value)
                                    }}
                                >
                                    <option value="low">low</option>
                                    <option value="medium">medium</option>
                                    <option value="high">high</option>
                                </select>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
>>>>>>> aa5370f84fa0dacff31fc133428352fface2ea58
