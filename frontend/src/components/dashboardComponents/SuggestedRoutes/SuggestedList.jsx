import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { SuggestedCard } from "./SuggestedCard";

export const SuggestedList = ({ routes }) => {
  return (
    <div className="w-full flex flex-col space-y-4 items-center">
      {routes.map((route) => {
        return <SuggestedCard route={route} />;
      })}
    </div>
  );
};
