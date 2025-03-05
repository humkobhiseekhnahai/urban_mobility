import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export const SuggestedCard = () => {
  return (
    <Card className="mt-6 w-96">
      <CardHeader color="blue-gray" className="relative h-56"></CardHeader>
      <CardBody></CardBody>
      <CardFooter className="pt-0"></CardFooter>
    </Card>
  );
};
