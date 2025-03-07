import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { MapPin, MapPinCheckInside } from "lucide-react";
import { routeAtom } from "../../../hooks/atoms/atom";

export const SuggestedCard = ({ route }) => {
  const parsedRoute = {
    source: route.source,
    destination: route.destination,
    coordinates: JSON.parse(route.coordinates),
  };

  return (
    <Card className="w-full">
      <CardBody className="flex flex-col items-center">
        <div className="w-full flex justify-between">
          {/* Source */}
          <Typography variant="h6" color="gray" className="flex items-center">
            <span className="pr-1">
              <MapPin size={16} />
            </span>
            {route.source}
          </Typography>
          {/* Desination */}
          <Typography variant="h6" color="gray" className="flex items-center">
            <span className="pr-1">
              <MapPinCheckInside size={16} />
            </span>
            {route.destination}
          </Typography>
        </div>
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button
          variant="gradient"
          className="mt-4"
          onClick={() => routeAtom(parsedRoute)}
        >
          View Route
        </Button>
      </CardFooter>
    </Card>
  );
};
