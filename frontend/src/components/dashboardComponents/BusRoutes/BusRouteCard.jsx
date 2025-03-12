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
      className="w-full md:w-[80%] overflow-hidden rounded-xl shadow-lg hover:shadow-xl bg-gray-100 border border-gray-300"
      onMouseEnter={() => {
        const formattedRoute = route.mapJsonContent.map((r) => [
          parseFloat(r.latlons[1]),
          parseFloat(r.latlons[0]),
        ]);

        setHoveredRoute(formattedRoute);
        console.log(formattedRoute);
      }}
      onMouseLeave={() => setHoveredRoute(null)}
    >
      <CardBody className="p-4 md:p-6">
        {/* Route number and name */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <Chip
            value={route.routeNumber}
            className="rounded-full bg-blue-600 py-1.5 text-white font-bold w-auto h-10 flex items-center justify-center text-sm md:text-lg flex-shrink-0"
          />
          <div className="min-w-0">
            <Typography
              variant="h6"
              color="black"
              className="font-bold truncate"
            >
              {route.routeName}
            </Typography>
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 text-gray-600 mt-1">
              <div className="flex items-start gap-1 min-w-0">
                <MapPinIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <Typography
                  variant="small"
                  color="gray"
                  className="truncate whitespace-normal break-words"
                >
                  Origin: {route.origin}
                </Typography>
              </div>
              <div className="hidden sm:block text-gray-400">•</div>
              <div className="flex items-start gap-1 min-w-0">
                <MapPinIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <Typography
                  variant="small"
                  color="gray"
                  className="whitespace-normal break-words"
                >
                  Destination: {route.destination}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Departure Times */}
        <div className="mt-3 bg-white rounded-lg p-3 md:p-4 border border-gray-200">
          <div className="flex items-center mb-2">
            <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
            <Typography variant="h6" className="text-black font-medium">
              Departure Times
            </Typography>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {displayTimes.map((time, index) => (
              <Tooltip key={index} content={`Departs at ${time.trim()}`}>
                <Chip
                  value={time.trim()}
                  className="bg-blue-600 text-white font-medium border border-blue-500 hover:bg-blue-500 flex-shrink-0"
                />
              </Tooltip>
            ))}

            {!expanded && times.length > 3 && (
              <Chip
                value={`+${times.length - 3} more`}
                className="bg-gray-300 text-gray-800 cursor-pointer hover:bg-gray-400 flex-shrink-0"
                onClick={() => setExpanded(true)}
              />
            )}
          </div>

          {expanded && (
            <Button
              variant="text"
              className="flex items-center gap-2 mt-2 p-0 text-blue-600"
              onClick={() => setExpanded(false)}
            >
              <span>Show less</span>
              <ChevronUpIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardBody>

      <CardFooter className="pt-0 pb-4 px-6">
        <Button
          size="lg"
          fullWidth
          className="bg-blue-700 hover:bg-blue-800 shadow-md flex items-center justify-center gap-2 py-3 text-white"
          onClick={() => {
            setSelectedRoute(route);
            onViewDetails();
          }}
        >
          <BusIcon className="h-5 w-5" />
          View Route Details
        </Button>
      </CardFooter>
    </Card>
  );
};
