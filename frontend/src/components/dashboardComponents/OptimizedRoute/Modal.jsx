export const OptimizedRouteModal = ({
  open,
  handleOpen,
  setSource,
  setDestination,
  setStops,
  addStop,
  addOptimizedRoute,
}) => {
  return (
    <Dialog open={open} handler={handleOpen} size="md">
      <DialogBody className="overflow-y-auto max-h-[80vh]">
        <Card className="w-full">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add an Optimized Route
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Help improve the transport network by suggesting an optimized
              route between the source and destination.
            </Typography>
            <div className="flex gap-x-4">
              <div className="w-1/2">
                <DialogInput
                  label="Source"
                  size="lg"
                  required
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <DialogInput
                  label="Destination"
                  size="lg"
                  required
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            <Typography
              color="gray"
              className="mb-3 font-bold"
              variant="paragraph"
            >
              Add Stops
            </Typography>
            {stops.map((stop, index) => (
              <div key={index} className="flex gap-x-4 mb-4">
                <div className="w-1/2">
                  <DialogInput
                    label="Latitude"
                    size="lg"
                    value={stop.latitude}
                    onChange={(e) =>
                      setStops(
                        stops.map((s, i) =>
                          i === index ? { ...s, latitude: e.target.value } : s
                        )
                      )
                    }
                    required
                  />
                </div>
                <div className="w-1/2">
                  <DialogInput
                    label="Longitude"
                    size="lg"
                    value={stop.longitude}
                    onChange={(e) =>
                      setStops(
                        stops.map((s, i) =>
                          i === index ? { ...s, longitude: e.target.value } : s
                        )
                      )
                    }
                    required
                  />
                </div>
              </div>
            ))}

            {/* Add Stop Button */}
            <Button
              variant="outlined"
              color="blue"
              size="sm"
              className="w-fit"
              onClick={addStop}
            >
              Add Another Stop
            </Button>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={addOptimizedRoute} fullWidth>
              Add Route
            </Button>
            <Typography
              variant="small"
              className="mt-4 flex justify-center font-bold"
              onClick={handleOpen}
            >
              Cancel
            </Typography>
          </CardFooter>
        </Card>
      </DialogBody>
    </Dialog>
  );
};
