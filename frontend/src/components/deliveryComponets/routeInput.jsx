//route input
import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { startingLocationAtom, deliveryStopsAtom } from '../../hooks/atoms/atom';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCoordinates } from "../../lib/fetch_location_coordinates";

export default function RouteInput({ attemptedOptimize }) {
  const [startingLocation, setStartingLocation] = useAtom(startingLocationAtom);
  const [deliveryStops, setDeliveryStops] = useAtom(deliveryStopsAtom);

  // Local state for input values
  const [startInputValue, setStartInputValue] = useState(startingLocation);
  const [inputValues, setInputValues] = useState(deliveryStops.map(stop => stop.location));

  // Toggle state for input type: 'address' or 'coordinates'
  const [inputType, setInputType] = useState('coordinates');

  // Refs for the container and new inputs
  const scrollContainerRef = useRef(null);
  const inputRefs = useRef([]);

  // State to track if button should be shown below
  const [showButtonBelow, setShowButtonBelow] = useState(false);

  // Setup input refs when deliveryStops changes
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, deliveryStops.length);
  }, [deliveryStops.length]);

  // Check if the container width exceeds the viewport and update button position
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        // Check if scrollWidth is greater than clientWidth (indicates horizontal overflow)
        // We add some buffer (50px) to ensure button shifts down before it gets cut off
        const isOverflowing = container.scrollWidth > container.clientWidth - 50;
        setShowButtonBelow(isOverflowing);
      }
    };

    // Initial check
    checkOverflow();

    // Check on window resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [deliveryStops.length]);

  // Function to check if a string is a valid coordinate pair
  const isCoordinatePair = (str) => {
    if (typeof str !== 'string') return false;
    const parts = str.split(',').map(part => part.trim());
    return parts.length === 2 && parts.every(part => !isNaN(parseFloat(part)));
  };

  // Handle blur for starting location
  const handleStartBlur = async () => {
    if (inputType === 'coordinates') {
      if (isCoordinatePair(startInputValue)) {
        setStartingLocation(startInputValue);
      } else {
        console.error('Invalid coordinate pair');
      }
    } else {
      const result = await fetchCoordinates(startInputValue);
      if (result) {
        const { lat, lon } = result;
        const coordString = `${lon},${lat}`;
        setStartingLocation(coordString);
        setStartInputValue(coordString); // Show coordinates in input
      } else {
        console.error('Failed to fetch coordinates for starting location');
      }
    }
  };

  // Handle blur for delivery stops
  const handleDeliveryBlur = async (index) => {
    const value = inputValues[index];
    if (inputType === 'coordinates') {
      if (isCoordinatePair(value)) {
        const newStops = [...deliveryStops];
        newStops[index].location = value;
        setDeliveryStops(newStops);
      } else {
        console.error(`Invalid coordinate pair for stop ${index + 1}`);
      }
    } else {
      const result = await fetchCoordinates(value);
      if (result) {
        const { lat, lon } = result;
        const coordString = `${lon},${lat}`;
        const newStops = [...deliveryStops];
        newStops[index].location = coordString;
        setDeliveryStops(newStops);
        const newInputValues = [...inputValues];
        newInputValues[index] = coordString;
        setInputValues(newInputValues);
      } else {
        console.error(`Failed to fetch coordinates for stop ${index + 1}`);
      }
    }
  };

  // Add a new stop
  const addStop = () => {
    const newIndex = deliveryStops.length;
    setDeliveryStops([...deliveryStops, { location: '', capacity: 0 }]);
    setInputValues([...inputValues, '']);
    
    // Focus on the new input after it's created
    // Using setTimeout to ensure the input is rendered
    setTimeout(() => {
      if (inputRefs.current[newIndex]) {
        inputRefs.current[newIndex].focus();
        
        // Scroll to make the new input visible
        inputRefs.current[newIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'end'
        });
      }
    }, 100);
  };

  // Remove a stop
  const removeStop = (index) => {
    setDeliveryStops(deliveryStops.filter((_, i) => i !== index));
    setInputValues(inputValues.filter((_, i) => i !== index));
  };

  // Handle input change for delivery stops
  const handleDeliveryLocationChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  // Handle capacity change
  const handleCapacityChange = (index, value) => {
    const newStops = [...deliveryStops];
    newStops[index].capacity = Number(value) || 0;
    setDeliveryStops(newStops);
  };

  // Toggle input type
  const toggleInputType = () => {
    setInputType(prev => (prev === 'address' ? 'coordinates' : 'address'));
  };

  return (
    <div className="relative mt-2 sm:mt-4">
      {/* Toggle Button */}
      <div className="flex justify-end mb-1 sm:mb-2 px-2 sm:px-0">
        <div
          className="relative w-44 sm:w-56 h-7 sm:h-8 bg-neutral-800 border border-gray-600 rounded-full flex items-center justify-between cursor-pointer"
          onClick={toggleInputType}
        >
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-blue-500 rounded-full"
            animate={{ left: inputType === 'address' ? '0%' : '50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
          <span
            className={`z-10 w-1/2 text-center text-xs sm:text-sm ${inputType === 'address' ? 'text-white font-bold' : 'text-gray-400'
              }`}
          >
            Address
          </span>
          <span
            className={`z-10 w-1/2 text-center text-xs sm:text-sm ${inputType === 'coordinates' ? 'text-white font-bold' : 'text-gray-400'
              }`}
          >
            Coordinates
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {inputType === 'address' ? (
          // Address-based Input UI
          <motion.div
            key="address"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <div 
              ref={scrollContainerRef}
              className="flex items-center space-x-2 sm:space-x-4 py-2 sm:py-4 px-2 sm:px-4 overflow-x-auto scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600 max-w-[90vw]"
            >
              {/* Starting Location */}
              <div className="relative flex-shrink-0">
                <input
                  type="text"
                  value={startInputValue}
                  onChange={(e) => setStartInputValue(e.target.value)}
                  onBlur={handleStartBlur}
                  placeholder="Warehouse (address)"
                  className={`bg-neutral-800 text-gray-200 px-2 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-48 sm:w-64 text-xs sm:text-base ${attemptedOptimize && startingLocation.trim() === '' ? 'border border-red-500' : ''
                    }`}
                  required
                />
                {attemptedOptimize && startingLocation.trim() === '' && (
                  <span className="absolute left-0 bottom-[-1.25rem] text-red-500 text-xs sm:text-sm">Required</span>
                )}
              </div>
              <div className="text-gray-500 flex-shrink-0">
                <span className="text-base sm:text-xl">→</span>
              </div>
              {/* Delivery Stops */}
              {deliveryStops.map((stop, index) => (
                <div key={index} className="relative flex flex-col gap-1 sm:gap-2 flex-shrink-0">
                  <input
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    value={inputValues[index]}
                    onChange={(e) => handleDeliveryLocationChange(index, e.target.value)}
                    onBlur={() => handleDeliveryBlur(index)}
                    placeholder={`Stop ${index + 1} (address)`}
                    className={`bg-neutral-800 text-gray-200 px-2 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-48 sm:w-64 text-xs sm:text-base ${attemptedOptimize && stop.location.trim() === '' ? 'border border-red-500' : ''
                      }`}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={stop.capacity || ''}
                    onChange={(e) => handleCapacityChange(index, e.target.value)}
                    placeholder="Weight (kg)"
                    className={`bg-neutral-800 text-gray-200 px-2 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-48 sm:w-64 text-xs sm:text-base ${attemptedOptimize && stop.capacity <= 0 ? 'border border-red-500' : ''
                      }`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeStop(index)}
                    className="absolute -right-2 -top-2 bg-neutral-700 rounded-full p-1 hover:bg-red-500 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </motion.button>
                </div>
              ))}
              {!showButtonBelow && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addStop}
                  className="flex items-center text-blue-500 hover:text-blue-400 transition-colors text-xs sm:text-base flex-shrink-0"
                >
                  <PlusCircleIcon className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  <span>Add Stop</span>
                </motion.button>
              )}
            </div>
            
            {/* Add Stop Button Below */}
            {showButtonBelow && (
              <div className="flex justify-center mt-2 sm:mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addStop}
                  className="flex items-center text-blue-500 hover:text-blue-400 transition-colors text-xs sm:text-base"
                >
                  <PlusCircleIcon className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  <span>Add Stop</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        ) : (
          // Coordinate-based Input UI (Original)
          <motion.div
            key="coordinates"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <div 
              ref={scrollContainerRef}
              className="flex items-center space-x-2 sm:space-x-4 py-2 sm:py-4 px-2 sm:px-4 overflow-x-auto scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600 max-w-[90vw]"
            >
              {/* Starting Location */}
              <div className="relative flex-shrink-0">
                <input
                  type="text"
                  value={startInputValue}
                  onChange={(e) => setStartInputValue(e.target.value)}
                  onBlur={handleStartBlur}
                  placeholder="Warehouse (lon,lat)"
                  className={`bg-neutral-800 text-gray-200 px-2 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-48 sm:w-64 text-xs sm:text-base ${attemptedOptimize && startingLocation.trim() === '' ? 'border border-red-500' : ''}`}
                  required
                />
                {attemptedOptimize && startingLocation.trim() === '' && (
                  <span className="absolute left-0 bottom-[-1.25rem] text-red-500 text-xs sm:text-sm">Required</span>
                )}
              </div>
              <div className="text-gray-500 flex-shrink-0">
                <span className="text-base sm:text-xl">→</span>
              </div>
              {/* Delivery Stops */}
              {deliveryStops.map((stop, index) => (
                <div key={index} className="relative flex flex-col gap-1 sm:gap-2 flex-shrink-0">
                  <input
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    value={inputValues[index]}
                    onChange={(e) => handleDeliveryLocationChange(index, e.target.value)}
                    onBlur={() => handleDeliveryBlur(index)}
                    placeholder={`Stop ${index + 1} (lon,lat)`}
                    className={`bg-neutral-800 text-gray-200 px-2 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-48 sm:w-64 text-xs sm:text-base ${attemptedOptimize && stop.location.trim() === '' ? 'border border-red-500' : ''}`}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={stop.capacity || ''}
                    onChange={(e) => handleCapacityChange(index, e.target.value)}
                    placeholder="Weight (kg)"
                    className={`bg-neutral-800 text-gray-200 px-2 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-48 sm:w-64 text-xs sm:text-base ${attemptedOptimize && stop.capacity <= 0 ? 'border border-red-500' : ''}`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeStop(index)}
                    className="absolute -right-2 -top-2 bg-neutral-700 rounded-full p-1 hover:bg-red-500 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </motion.button>
                </div>
              ))}
              {!showButtonBelow && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addStop}
                  className="flex items-center text-blue-500 hover:text-blue-400 transition-colors text-xs sm:text-base flex-shrink-0"
                >
                  <PlusCircleIcon className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  <span>Add Stop</span>
                </motion.button>
              )}
            </div>
            
            {/* Add Stop Button Below */}
            {showButtonBelow && (
              <div className="flex justify-center mt-2 sm:mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addStop}
                  className="flex items-center text-blue-500 hover:text-blue-400 transition-colors text-xs sm:text-base"
                >
                  <PlusCircleIcon className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  <span>Add Stop</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
