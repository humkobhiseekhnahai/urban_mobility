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

  // Format departure times into a more readable format
  const times = route.departureTimes.split(",  ");
  const displayTimes = expanded ? times : times.slice(0, 3);

  return (
    <Card
      className="w-full  overflow-hidden rounded-xl shadow-lg hover:shadow-xl duration-300 bg-white border border-gray-100"
      onMouseEnter={() => {
        const formattedRoute = route.mapJsonContent.map((r) => [
          parseFloat(r.latlons[1]), // Longitude first (Mapbox format)
          parseFloat(r.latlons[0]), // Latitude second (Mapbox format)
        ]);

        setHoveredRoute(formattedRoute);
        console.log(formattedRoute);
      }}
      onMouseLeave={() => setHoveredRoute(null)}
    >
      <CardBody className="p-6">
        {/* Route number badge and name */}
        <div className="flex items-center gap-4 mb-4">
          <Chip
            value={route.routeNumber}
            className="rounded-full bg-gray-800 py-1.5 text-white font-bold w-auto h-12 flex items-center justify-center text-lg"
          />
          <div>
            <Typography variant="h5" color="gray" className="font-bold">
              {route.routeName}
            </Typography>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <Typography variant="small">Origin: {route.origin}</Typography>
            </div>
          </div>
        </div>

        {/* Departure times section */}
        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <ClockIcon className="h-5 w-5 text-gray-700 mr-2" />
            <Typography variant="h6" color="gray" className="font-medium">
              Departure Times
            </Typography>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {displayTimes.map((time, index) => (
              <Tooltip key={index} content={`Departs at ${time.trim()}`}>
                <Chip
                  value={time.trim()}
                  className="bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50"
                />
              </Tooltip>
            ))}

            {!expanded && times.length > 3 && (
              <Chip
                value={`+${times.length - 3} more`}
                className="bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300"
                onClick={() => setExpanded(true)}
              />
            )}
          </div>

          {expanded && (
            <Button
              variant="text"
              className="flex items-center gap-2 mt-2 p-0 text-gray-700"
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
          className="bg-gray-800 hover:bg-gray-900 shadow-md flex items-center justify-center gap-2 py-3"
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
