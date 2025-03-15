import { useState } from "react";
import { Search } from "lucide-react";
import { Select, Option, Input, Button } from "@material-tailwind/react";
import { filterRoutesBySourceDest } from "../../utils/dashboard/filterRoutesBySourceDest";

const TIMES = ["All Time", "Morning", "Afternoon", "Evening", "Night"];

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

  const handleSourceChange = (e) => {
    setLocalSource(e.target.value);
    setSource(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setLocalDestination(e.target.value);
    setDestination(e.target.value);
  };

  const handleRouteFiltering = () => {
    const filteredRoutes = filterRoutesBySourceDest(
      busRoutes,
      localSource,
      localDestination
    );
    setFilteredRoutes(filteredRoutes);
  };

  return (
    <div className="w-full h-[25%] bg-neutral-900 border-b border-neutral-800 shadow-md p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
          <div>
            <div className="mb-1 text-sm font-medium text-white">From</div>
            <Input
              label=""
              placeholder="Enter departure location"
              value={localSource}
              onChange={handleSourceChange}
              className="!border-neutral-700 focus:!border-blue-500 text-white placeholder:text-neutral-500 placeholder:opacity-100 bg-neutral-800 rounded-md"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{
                className: "min-w-[100px]",
              }}
              color="blue"
              size="md"
              variant="outlined"
              crossOrigin={undefined}
            />
          </div>

          <div>
            <div className="mb-1 text-sm font-medium text-white">To</div>
            <Input
              label=""
              placeholder="Enter destination location"
              value={localDestination}
              onChange={handleDestinationChange}
              className="!border-neutral-700 focus:!border-blue-500 text-white placeholder:text-neutral-500 placeholder:opacity-100 bg-neutral-800 rounded-md"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{
                className: "min-w-[100px]",
              }}
              color="blue"
              size="md"
              variant="outlined"
              crossOrigin={undefined}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleRouteFiltering}
              className="w-10 h-10 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-md"
              color="blue"
            >
              <Search size={18} className="text-white" />
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-1 text-sm font-medium text-white">
            Time Preference
          </div>
          <Select
            label="Select Time"
            defaultValue="All Time"
            onChange={(value) => setSelectedTime(value)}
            className="!border-neutral-700 text-white bg-neutral-900"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-[100px]",
            }}
            color="blue"
            variant="outlined"
            menuProps={{
              className: "bg-neutral-800 border-neutral-900",
            }}
          >
            {TIMES.map((time) => (
              <Option
                key={time}
                value={time}
                className="hover:bg-neutral-900 text-white"
              >
                {time}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};
