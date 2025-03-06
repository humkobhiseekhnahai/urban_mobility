import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "../components/dashboardComponents/Input";
import { MapBox } from "../components/dashboardComponents/Map";
import { useGeolocation } from "@uidotdev/usehooks";
import { LocationLoading } from "../components/dashboardComponents/LocationLoading";
import { Weather } from "../components/dashboardComponents/Weather";
import { HeatMap } from "../components/dashboardComponents/HeatMap/HeatMap";
import { IncidentList } from "../components/dashboardComponents/TrafficIncidents/IncidentList";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input as DialogInput,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { SuggestedList } from "../components/dashboardComponents/SuggestedRoutes/SuggestedList";
import { routeAtom } from "../hooks/atoms/atom";

export const Dashboard = () => {
  const serverUrl = "http://localhost:8080";

  const location = useGeolocation();
  const [open, setIsOpen] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState([
    { latitude: "", longitude: "" }, // Initial stop
  ]);

  const [suggestedRoutes, setSuggestedRoutes] = useState([]);

  const addStop = () => {
    setStops([...stops, { latitude: "", longitude: "" }]);
  };

  const handleOpen = () => {
    setStops([{ latitude: "", longitude: "" }]);
    setIsOpen(!open);
  };

  const getAllSuggestedRoutes = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/suggested-routes`);
      const data = await response.json();
      setSuggestedRoutes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addOptimizedRoute = async () => {
    try {
      await fetch(`${serverUrl}/api/suggested-routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: source,
          destination: destination,
          coordinates: stops,
        }),
      });
      handleOpen();
      alert("Route added successfully!");
    } catch (error) {
      alert("Failed to add route");
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSuggestedRoutes();
  }, []);

  if (location.loading || location.error) return <LocationLoading />;
  return (
    <main className="bg-neutral-900">
      <div className="w-full h-screen flex">
        <section className="w-[45%] h-full bg-neutral-800 border-r border-r-neutral-700">
          {/* Search */}
          <div className="w-full h-[20%] bg-neutral-900 border-b border-b-neutral-70 ">
            {/* Top */}
            <section className="w-full h-1/2 flex items-center justify-center px-4 gap-3">
              <div className="w-full h-full flex items-center justify-center">
                <Input placeholder="From:" icon={MapPin} />
              </div>

              <div className="w-full h-full flex items-center justify-center">
                <Input placeholder="To:" icon={MapPin} />
              </div>

              <div>
                <button
                  className="w-[40px] h-[40px] bg-blue-600 rounded-md flex items-center justify-center hover:cursor-pointer hover:bg-blue-700 transition-colors"
                  type="button"
                >
                  <Search size={20} className="text-white" />
                </button>
              </div>
            </section>

            {/* Bottom */}
            <section className="w-full h-1/2 flex items-center justify-center px-4 gap-3"></section>
          </div>

          {/* Timings List */}
          <div className="w-full p-4 h-[80%] overflow-y-auto">
            <SuggestedList routes={suggestedRoutes} />
          </div>
        </section>
        <section className="w-[55%] h-full bg-neutral-900">
          <div className="w-full h-1/2 p-5 rounded-lg">
            <MapBox
              lng={routeAtom?.coordinates?.[0].longitude || location.longitude}
              lat={routeAtom?.coordinates?.[0].latitude || location.latitude}
            />
          </div>

          {/* Open Modal Text */}
          <div className="w-full h-1/2 p-3 rounded-t-md bg-neutral-800 border-t border-t-neutral-700">
            <Tabs value="heatmap" className="h-full flex flex-col">
              <TabsHeader
                className="bg-neutral-800 flex justify-between py-1" // Reduced padding with py-1
                indicatorProps={{
                  className:
                    "bg-neutral-700 shadow-none border-b-2 border-blue-500",
                }}
              >
                <Tab
                  value="heatmap"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none flex-1 text-center py-1" // Smaller text (text-sm) and reduced padding (py-1)
                  activeClassName="text-white"
                >
                  Traffic Heatmap
                </Tab>
                <Tab
                  value="incident"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none flex-1 text-center py-1"
                  activeClassName="text-white"
                >
                  Traffic Incidents
                </Tab>
                <Tab
                  value="weather"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none flex-1 text-center py-1"
                  activeClassName="text-white"
                >
                  Weather Data
                </Tab>
                <Tab
                  value="ori"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none flex-1 text-center py-1"
                  activeClassName="text-white"
                >
                  Optimized Route Addition
                </Tab>
              </TabsHeader>
              <TabsBody
                className="text-gray-200 flex-1" // Still takes remaining space
              >
                <TabPanel value="heatmap" className="w-full h-full p-2">
                  <HeatMap
                    lat={location.latitude}
                    lng={location.longitude}
                    radius={0.02}
                  />
                </TabPanel>
                <TabPanel value="incident" className="w-full h-full p-2">
                  <IncidentList
                    lat={location.latitude}
                    lng={location.longitude}
                    radius={0.02}
                  />
                </TabPanel>
                <TabPanel value="weather" className="w-full h-full p-2">
                  <Weather lat={location.latitude} lng={location.longitude} />
                </TabPanel>
                <TabPanel value="ori" className="w-full h-full p-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-100">
                      Suggest an Optimized Route
                    </h2>

                    <p className="text-gray-300 text-sm mt-2">
                      If you know a more efficient route between the source and
                      destination, help improve the transport network by
                      submitting your suggestion. Better routes mean reduced
                      travel time, fuel efficiency, and improved passenger
                      experience.
                    </p>

                    <div className="mt-4 p-3 bg-neutral-700 rounded-md">
                      <p className="text-gray-200 text-sm font-medium">
                        Why contribute?
                      </p>
                      <ul className="list-disc list-inside text-gray-300 text-xs mt-1">
                        <li>Reduce congestion and delays.</li>
                        <li>Enhance accessibility for passengers.</li>
                        <li>Optimize fuel consumption and efficiency.</li>
                      </ul>
                    </div>

                    <button
                      className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-md mt-4 transition-all transform hover:scale-[102%] active:scale-95 cursor-pointer hover:from-blue-700 hover:to-indigo-800"
                      type="button"
                      onClick={handleOpen}
                    >
                      Suggest an Optimized Route
                    </button>
                  </div>
                </TabPanel>
              </TabsBody>
            </Tabs>
          </div>
        </section>
      </div>
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
                            i === index
                              ? { ...s, longitude: e.target.value }
                              : s
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
    </main>
  );
};
