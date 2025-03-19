import { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Chip,
  Tooltip,
} from "@material-tailwind/react";
import { MapPinIcon, ClockIcon, BusIcon, ChevronUpIcon } from "lucide-react";
import { atom, useAtom } from "jotai";
import { hoveredRouteAtom } from "../../../hooks/atoms/atom";

export const selectedRouteAtom = atom(null);

export const BusRouteCard = ({ route, onViewDetails }) => {
  const [expanded, setExpanded] = useState(false);

  const [, setHoveredRoute] = useAtom(hoveredRouteAtom);
  const [, setSelectedRoute] = useAtom(selectedRouteAtom);

  // Format departure times
  const times = route.departureTimes.split(",  ");
  const displayTimes = expanded ? times : times.slice(0, 3);

  return (
    <Card
      className="w-full md:w-[95%] overflow-hidden rounded-lg shadow-md hover:shadow-lg bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all"
      onMouseEnter={() => {
        const formattedRoute = route.mapJsonContent.map((r) => [
          Number.parseFloat(r.latlons[1]),
          Number.parseFloat(r.latlons[0]),
        ]);

        setHoveredRoute(formattedRoute);
      }}
      onMouseLeave={() => setHoveredRoute(null)}
    >
      <CardBody className="p-3">
        {/* Route number and name */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Chip
            value={route.routeNumber}
            className="rounded-full bg-neutral-700 py-1 text-white font-medium w-auto h-8 flex items-center justify-center text-xs flex-shrink-0"
          />
          <Typography
            variant="h6"
            color="white"
            className="font-medium text-sm truncate"
          >
            {route.routeName}
          </Typography>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-1 text-gray-300 text-xs mb-2">
          <div className="hidden md:flex items-start gap-1 min-w-0">
            <MapPinIcon className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
            <Typography
              variant="small"
              className="truncate whitespace-normal break-words text-xs text-gray-300"
            >
              From: {route.origin}
            </Typography>
          </div>
          <div className="hidden sm:block text-gray-500 text-xs">•</div>
          <div className="hidden md:flex items-start gap-1 min-w-0">
            <MapPinIcon className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
            <Typography
              variant="small"
              className="whitespace-normal break-words text-xs text-gray-300"
            >
              To: {route.destination}
            </Typography>
          </div>
        </div>

        {/* Departure Times */}
        <div className="hidden md:block mt-2 bg-neutral-900 rounded-md p-2 border border-neutral-700">
          <div className="flex items-center mb-1">
            <ClockIcon className="h-3.5 w-3.5 text-blue-400 mr-1" />
            <Typography
              variant="small"
              className="text-white font-medium text-xs"
            >
              Departure Times
            </Typography>
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            {displayTimes.map((time, index) => (
              <Tooltip key={index} content={`Departs at ${time.trim()}`}>
                <Chip
                  value={time.trim()}
                  className="bg-neutral-950 text-white text-xs font-normal border border-gray-700 hover:bg-blue-600 flex-shrink-0 h-6 flex justify-center items-center"
                />
              </Tooltip>
            ))}

            {!expanded && times.length > 3 && (
              <Chip
                value={`+${times.length - 3} more`}
                className="bg-neutral-700 text-gray-300 text-xs cursor-pointer hover:bg-neutral-600 flex-shrink-0 h-6 flex justify-center items-center"
                onClick={() => setExpanded(true)}
              />
            )}
          </div>

          {expanded && (
            <Button
              variant="text"
              className="flex items-center gap-1 mt-1 p-0 text-blue-400 hover:text-blue-300 text-xs"
              onClick={() => setExpanded(false)}
            >
              <span>Show less</span>
              <ChevronUpIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardBody>

      <CardFooter className="pt-0 pb-3 px-3">
        <Button
          size="sm"
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center justify-center gap-1 py-2 text-white text-xs font-medium"
          onClick={() => {
            setSelectedRoute(route);
            onViewDetails();
          }}
        >
          <BusIcon className="h-3.5 w-3.5" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
