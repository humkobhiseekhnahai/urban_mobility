import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  PlusIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

export const OptimizedRouteModal = ({
  isOpen,
  handleOpen,
  suggestedSource,
  setSuggestedSource,
  suggestedDestination,
  setSuggestedDestination,
  stops,
  setStops,
  addOptimizedRoute,
}) => {
  const handleStopChange = (index, field, value) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    setStops(newStops);
  };

  const addStop = () => {
    setStops([...stops, { name: "", latitude: "", longitude: "" }]);
  };

  const removeStop = (index) => {
    if (stops.length > 1) {
      const newStops = stops.filter((_, i) => i !== index);
      setStops(newStops);
    }
  };

  return (
    <Dialog open={isOpen} handler={handleOpen} size="lg">
      <DialogHeader className="flex items-center justify-between">
        <Typography variant="h5" color="blue-gray">
          Suggest an Optimized Route
        </Typography>
        <IconButton
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handleOpen}
        >
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody divider className="overflow-y-auto max-h-[60vh]">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Source
              </Typography>
              <Input
                label="Source Location"
                value={suggestedSource}
                onChange={(e) => setSuggestedSource(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-blue-500"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Destination
              </Typography>
              <Input
                label="Destination Location"
                value={suggestedDestination}
                onChange={(e) => setSuggestedDestination(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-blue-500"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray">
                Stops
              </Typography>
              <Button
                size="sm"
                color="blue"
                variant="text"
                className="flex items-center gap-2"
                onClick={addStop}
              >
                <PlusIcon className="h-4 w-4" /> Add Stop
              </Button>
            </div>

            {stops.map((stop, index) => (
              <div
                key={index}
                className="p-4 border border-blue-gray-100 rounded-lg mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="h6" color="blue-gray">
                    Stop {index + 1}
                  </Typography>
                  {stops.length > 1 && (
                    <IconButton
                      color="red"
                      size="sm"
                      variant="text"
                      onClick={() => removeStop(index)}
                    >
                      <MinusCircleIcon className="h-5 w-5" />
                    </IconButton>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Stop Name"
                    value={stop.name}
                    onChange={(e) =>
                      handleStopChange(index, "name", e.target.value)
                    }
                    className="!border-t-blue-gray-200 focus:!border-t-blue-500"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                  <Input
                    label="Latitude"
                    value={stop.latitude}
                    onChange={(e) =>
                      handleStopChange(index, "latitude", e.target.value)
                    }
                    className="!border-t-blue-gray-200 focus:!border-t-blue-500"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                  <Input
                    label="Longitude"
                    value={stop.longitude}
                    onChange={(e) =>
                      handleStopChange(index, "longitude", e.target.value)
                    }
                    className="!border-t-blue-gray-200 focus:!border-t-blue-500"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="outlined" color="red" onClick={handleOpen}>
          Cancel
        </Button>
        <Button variant="gradient" color="blue" onClick={addOptimizedRoute}>
          Submit Route
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
