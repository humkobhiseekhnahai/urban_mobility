"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Clock, X } from "lucide-react";
import {
  Input,
  Button,
  Checkbox,
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { filterRoutesBySourceDest } from "../../utils/dashboard/filterRoutesBySourceDest";

const TIME_OPTIONS = [
  { value: "Morning", label: "Morning" },
  { value: "Afternoon", label: "Afternoon" },
  { value: "Evening", label: "Evening" },
  { value: "Night", label: "Night" },
];

export const Filter = ({
  busRoutes,
  source,
  destination,
  setSource,
  setDestination,
  setSelectedTime,
  setFilteredRoutes,
}) => {
  const [localSource, setLocalSource] = useState(source || "");
  const [localDestination, setLocalDestination] = useState(destination || "");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const timeFilterRef = useRef(null);

  // Close time filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        timeFilterRef.current &&
        !timeFilterRef.current.contains(event.target)
      ) {
        setIsTimeFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSourceChange = (e) => {
    setLocalSource(e.target.value);
    setSource(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setLocalDestination(e.target.value);
    setDestination(e.target.value);
  };

  const handleTimeChange = (time) => {
    setSelectedTimes((prev) => {
      if (prev.includes(time)) {
        return prev.filter((t) => t !== time);
      } else {
        return [...prev, time];
      }
    });
  };

  useEffect(() => {
    if (selectedTimes.length === 0) {
      setSelectedTime("All Time");
    } else {
      setSelectedTime(selectedTimes);
    }
  }, [selectedTimes, setSelectedTime]);

  const handleRouteFiltering = () => {
    const filteredRoutes = filterRoutesBySourceDest(
      busRoutes,
      localSource,
      localDestination
    );
    setFilteredRoutes(filteredRoutes);
    setIsTimeFilterOpen(false);
  };

  return (
    <div className="w-full h-[15%]">
      <Card className="w-full bg-neutral-900 border-b border-neutral-800 shadow-md rounded-none">
        <CardBody className="p-2">
          {/* Dashboard Heading */}
          <div className="flex items-center justify-between mb-3">
            <Typography
              variant="h6"
              className="bg-gray-800 text-white font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-md border border-gray-600"
            >
              Dashboard
            </Typography>
          </div>
          {/* Main Filter Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Source & Destination Inputs */}
            <div className="flex flex-1 flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Origin"
                  value={localSource}
                  onChange={handleSourceChange}
                  className="!border-neutral-700 focus:!border-blue-500 text-white bg-neutral-800 rounded-md"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[80px]" }}
                  size="sm"
                  variant="outlined"
                  crossOrigin={undefined}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Destination"
                  value={localDestination}
                  onChange={handleDestinationChange}
                  className="!border-neutral-700 focus:!border-blue-500 text-white bg-neutral-800 rounded-md"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[80px]" }}
                  size="sm"
                  variant="outlined"
                  crossOrigin={undefined}
                />
              </div>
            </div>

            {/* Time Filter & Search Button */}
            <div className="flex gap-2">
              <div className="relative" ref={timeFilterRef}>
                <Button
                  onClick={() => setIsTimeFilterOpen(!isTimeFilterOpen)}
                  className="h-9 px-3 bg-neutral-800 hover:bg-neutral-700 text-white flex items-center"
                  variant="filled"
                  size="sm"
                >
                  <Clock size={14} className="mr-1" />
                  <span className="text-xs">
                    {selectedTimes.length === 0
                      ? "All"
                      : `${selectedTimes.length}`}
                  </span>
                </Button>

                {isTimeFilterOpen && (
                  <Card className="absolute z-10 right-0 sm:left-0 mt-1 bg-neutral-800 border border-neutral-700 w-48">
                    <CardBody className="p-2">
                      {TIME_OPTIONS.map((time) => (
                        <div
                          key={time.value}
                          className="flex items-center mb-1 last:mb-0"
                        >
                          <Checkbox
                            color="blue"
                            checked={selectedTimes.includes(time.value)}
                            onChange={() => handleTimeChange(time.value)}
                            crossOrigin={undefined}
                            className="checked:bg-blue-500 checked:border-blue-500"
                            containerProps={{
                              className: "p-0 mr-1",
                            }}
                          />
                          <Typography className="text-white text-xs">
                            {time.label}
                          </Typography>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                )}
              </div>

              <Button
                onClick={handleRouteFiltering}
                className="h-9 px-3 bg-blue-600 hover:bg-blue-500 flex items-center justify-center"
                color="blue"
                size="sm"
              >
                <Search size={14} />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(localSource || localDestination || selectedTimes.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-1 max-w-full overflow-x-auto pb-1">
              {localSource && (
                <div className="bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-full text-xs flex items-center">
                  {localSource}
                  <button
                    className="ml-1 text-blue-300 hover:text-white"
                    onClick={() => {
                      setLocalSource("");
                      setSource("");
                    }}
                  >
                    <X size={10} />
                  </button>
                </div>
              )}

              {localDestination && (
                <div className="bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-full text-xs flex items-center">
                  {localDestination}
                  <button
                    className="ml-1 text-blue-300 hover:text-white"
                    onClick={() => {
                      setLocalDestination("");
                      setDestination("");
                    }}
                  >
                    <X size={10} />
                  </button>
                </div>
              )}

              {selectedTimes.map((time) => (
                <div
                  key={time}
                  className="bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-full text-xs flex items-center"
                >
                  {time}
                  <button
                    className="ml-1 text-blue-300 hover:text-white"
                    onClick={() => handleTimeChange(time)}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
