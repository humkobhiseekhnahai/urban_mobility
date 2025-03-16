import { useState, useEffect } from "react";
import { MapBox } from "../components/dashboardComponents/Map";
import { useGeolocation } from "@uidotdev/usehooks";
import { LocationLoading } from "../components/dashboardComponents/LocationLoading";
import { Weather } from "../components/dashboardComponents/Weather";
import { HeatMap } from "../components/dashboardComponents/HeatMap/HeatMap";
import { IncidentList } from "../components/dashboardComponents/TrafficIncidents/IncidentList";
import { BusRouteModal } from "../components/dashboardComponents/BusRoutes/BusRouteModal";
import { NavBarComponent } from "../components/navBarComponent";
import { Filter } from "../components/dashboardComponents/Filter";
import { BusRouteList } from "../components/dashboardComponents/BusRoutes/BusRouteList";
import { selectedRouteAtom } from "../components/dashboardComponents/BusRoutes/BusRouteCard";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useAtom } from "jotai";

<<<<<<< HEAD
// Functions
import { filterRoutesByTime } from "../utils/dashboard/filterRoutesByTime";
=======
const mapBoxAccessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;
const hereApiKey = import.meta.env.VITE_HEREAPI_KEY;

// Mapping of incident categories (TomTom)
const incidentCategoryMap = {
  0: "Unknown",
  1: "Accident",
  2: "Fog",
  3: "Dangerous Conditions",
  4: "Rain",
  5: "Ice",
  6: "Jam",
  7: "Lane Closed",
  8: "Road Closed",
  9: "Road Works",
  10: "Wind",
  11: "Flooding",
  13: "Cluster (Multiple Categories)",
  14: "Broken Down Vehicle",
};
>>>>>>> aa5370f84fa0dacff31fc133428352fface2ea58

export const Dashboard = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const location = useGeolocation();
  const [isOptimizedModalOpen, setIsOptimizedModalOpen] = useState(false);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  // const [stops, setStops] = useState([
  //   { latitude: "", longitude: "" }, // Initial stop
  // ]);

  const [routeModalOpen, setIsRouteModalOpen] = useState(false);
  const [busRoutes, setBusRoutes] = useState([]);
  const [selectedRoute] = useAtom(selectedRouteAtom);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [busRoutesLimit, setBusRoutesLimit] = useState(10);

  // const addStop = () => {
  //   setStops([...stops, { latitude: "", longitude: "" }]);
  // };

  const handleOpen = () => {
    setStops([{ latitude: "", longitude: "" }]);
    setIsOptimizedModalOpen(!isOptimizedModalOpen);
  };

  const handleViewRouteDetails = (route) => {
    setIsRouteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsRouteModalOpen(false);
  };

  const getAllBusRoutes = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/api/bus-routes?limit=${busRoutesLimit}`
      );
      let data = await response.json();

      const busRoutes = data.data.map((route) => ({
        ...route,
        mapJsonContent: JSON.parse(route.mapJsonContent),
        destination: JSON.parse(route.mapJsonContent)
          .pop()
          ?.busstop.split(",")[0],
      }));

<<<<<<< HEAD
      setBusRoutes(busRoutes);
      setFilteredRoutes(busRoutes); // Initialize filtered list with all routes
=======
      if (!data.results) {
        console.error("Error fetching traffic data");
        return;
      }

      const points = [];
      let maxIntensity = 1;

      data.results.forEach((result) => {
        result.location.shape.links.forEach((link) => {
          const intensity = link.trafficDensity || 1;
          maxIntensity = Math.max(maxIntensity, intensity);

          link.points.forEach((point) => {
            points.push([point.lat, point.lng, intensity]);
          });
        });
      });
      // Heatmap
      const normalizedHeatmapData = points.map(([lat, lng, intensity]) => [
        lat,
        lng,
        intensity / maxIntensity,
      ]);

      setHeatmapData(normalizedHeatmapData);
>>>>>>> aa5370f84fa0dacff31fc133428352fface2ea58
    } catch (error) {
      setBusRoutes(null);
      console.error(error);
    }
  };

  // const addOptimizedRoute = async () => {
  //   try {
  //     await fetch(`${serverUrl}/api/suggested-routes`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         source: source,
  //         destination: destination,
  //         coordinates: stops,
  //       }),
  //     });
  //     handleOpen();
  //     alert("Route added successfully!");
  //   } catch (error) {
  //     alert("Failed to add route");
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    const filteredRoutes = filterRoutesByTime(busRoutes, selectedTime);
    setFilteredRoutes(filteredRoutes);
  }, [selectedTime]);

  useEffect(() => {
    getAllBusRoutes();
  }, [busRoutesLimit]);

  if (location.loading || location.error) return <LocationLoading />;
  return (
    <main className="bg-neutral-900">
      <div className="w-full h-screen flex">
        <NavBarComponent />
        <section className="w-[45%] h-full bg-neutral-800 border-r border-r-neutral-700">
          <Filter
            busRoutes={busRoutes}
            setSource={setSource}
            source={source}
            destination={destination}
            setDestination={setDestination}
            setSelectedTime={setSelectedTime}
            setFilteredRoutes={setFilteredRoutes}
          />

          {/* Timings List */}
          <BusRouteList
            filteredRoutes={filteredRoutes}
            handleViewRouteDetails={handleViewRouteDetails}
            busRoutes={busRoutes}
            limit={busRoutesLimit}
            setLimit={setBusRoutesLimit}
          />
        </section>
        <section className="w-[55%] h-full bg-neutral-900">
          <div className="w-full h-1/2 p-5 rounded-lg">
            <MapBox lng={location.longitude} lat={location.latitude} />
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
      {/* <Dialog open={isOptimizedModalOpen} handler={handleOpen} size="md">
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
      </Dialog> */}
      {selectedRoute && (
        <BusRouteModal
          route={selectedRoute}
          isOpen={routeModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};
<<<<<<< HEAD
=======

const HeatmapLayer = ({ heatmapData }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    const heatLayer = L.heatLayer(heatmapData, {
      radius: 10, // Adjust the spread of the heatmap
      blur: 15,
      maxZoom: 17,
      max: 1.0,
    }).addTo(map);

    return () => {
      heatLayer.remove(); // Cleanup the layer when data updates
    };
  }, [map, heatmapData]);

  return null;
};
>>>>>>> aa5370f84fa0dacff31fc133428352fface2ea58
