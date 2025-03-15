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
import { OptimizedRouteModal } from "../components/dashboardComponents/OptimizedRoute/OptimizedRouteModal";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Dialog,
  DialogBody,
  Card,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useAtom } from "jotai";

// Functions
import { filterRoutesByTime } from "../utils/dashboard/filterRoutesByTime";

export const Dashboard = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const location = useGeolocation();
  const [isOptimizedModalOpen, setIsOptimizedModalOpen] = useState(false);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [suggestedSource, setSuggestedSource] = useState("");
  const [suggestedDestination, setSuggestedDestination] = useState("");
  const [stops, setStops] = useState([
    { name: "", latitude: "", longitude: "" }, // Initial stop
  ]);

  const [routeModalOpen, setIsRouteModalOpen] = useState(false);
  const [busRoutes, setBusRoutes] = useState([]);
  const [selectedRoute] = useAtom(selectedRouteAtom);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [busRoutesLimit, setBusRoutesLimit] = useState(10);

  const addStop = () => {
    setStops([...stops, { latitude: "", longitude: "" }]);
  };

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
      const data = await response.json();

      const busRoutes = data.data.map((route) => ({
        ...route,
        mapJsonContent: JSON.parse(route.mapJsonContent),
        destination: JSON.parse(route.mapJsonContent)
          .pop()
          ?.busstop.split(",")[0],
      }));

      setBusRoutes(busRoutes);
      setFilteredRoutes(busRoutes); // Initialize filtered list with all routes
    } catch (error) {
      setBusRoutes(null);
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
    const filteredRoutes = filterRoutesByTime(busRoutes, selectedTime);
    setFilteredRoutes(filteredRoutes);
  }, [selectedTime]);

  useEffect(() => {
    getAllBusRoutes();
  }, [busRoutesLimit]);

  if (location.loading || location.error) return <LocationLoading />;
  return (
    <main className="bg-neutral-850">
      <div className="w-full h-screen flex">
        <NavBarComponent />
        <section className="w-[45%] h-full bg-neutral-900 border-r border-r-neutral-800">
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
          <div className="w-full h-1/2 p-3 rounded-t-md bg-neutral-900 border-t border-t-neutral-800">
            <Tabs value="heatmap" className="h-full flex flex-col">
              <TabsHeader
                className="bg-neutral-900 flex justify-between py-1"
                indicatorProps={{
                  className:
                    "bg-neutral-800 shadow-none border-b-2 border-blue-500",
                }}
              >
                <Tab
                  value="heatmap"
                  className="text-sm text-white hover:text-blue-400 transition-colors duration-200 focus:outline-none flex-1 text-center py-1"
                  activeClassName="text-blue-400"
                >
                  Traffic Heatmap
                </Tab>
                <Tab
                  value="incident"
                  className="text-sm text-white hover:text-blue-400 transition-colors duration-200 focus:outline-none flex-1 text-center py-1"
                  activeClassName="text-blue-400"
                >
                  Traffic Incidents
                </Tab>
                <Tab
                  value="weather"
                  className="text-sm text-white hover:text-blue-400 transition-colors duration-200 focus:outline-none flex-1 text-center py-1"
                  activeClassName="text-blue-400"
                >
                  Weather Data
                </Tab>
                <Tab
                  value="ori"
                  className="text-sm text-white hover:text-blue-400 transition-colors duration-200 focus:outline-none flex-1 text-center py-1"
                  activeClassName="text-blue-400"
                >
                  Add Optimized Route
                </Tab>
              </TabsHeader>
              <TabsBody className="text-white flex-1">
                <TabPanel value="heatmap" className="w-full h-full p-2">
                  <HeatMap
                    lat={location.latitude}
                    lng={location.longitude}
                    radius={0.05}
                  />
                </TabPanel>
                <TabPanel value="incident" className="w-full h-full p-2">
                  <IncidentList
                    lat={location.latitude}
                    lng={location.longitude}
                    radius={0.05}
                  />
                </TabPanel>
                <TabPanel value="weather" className="w-full h-full p-2">
                  <Weather lat={location.latitude} lng={location.longitude} />
                </TabPanel>
                <TabPanel value="ori" className="w-full h-full p-2">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Suggest an Optimized Route
                    </h2>

                    <p className="text-gray-300 text-sm mt-2">
                      If you know a more efficient route between the source and
                      destination, help improve the transport network by
                      submitting your suggestion. Better routes mean reduced
                      travel time, fuel efficiency, and improved passenger
                      experience.
                    </p>

                    <div className="mt-4 p-3 bg-black rounded-md">
                      <p className="text-gray-100 text-sm font-medium">
                        Why contribute?
                      </p>
                      <ul className="list-disc list-inside text-blue-400 text-xs mt-1">
                        <li>Reduce congestion and delays.</li>
                        <li>Enhance accessibility for passengers.</li>
                        <li>Optimize fuel consumption and efficiency.</li>
                      </ul>
                    </div>

                    <button
                      className="w-full h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-md mt-4 transition-all transform hover:scale-[102%] active:scale-95 cursor-pointer hover:from-blue-600 hover:to-blue-700"
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
      {selectedRoute && (
        <BusRouteModal
          route={selectedRoute}
          isOpen={routeModalOpen}
          onClose={handleCloseModal}
        />
      )}
      <OptimizedRouteModal
        isOpen={isOptimizedModalOpen}
        handleOpen={handleOpen}
        suggestedSource={suggestedSource}
        setSuggestedSource={setSuggestedSource}
        suggestedDestination={suggestedDestination}
        setSuggestedDestination={setSuggestedDestination}
        stops={stops}
        setStops={setStops}
        addOptimizedRoute={addOptimizedRoute}
      />
    </main>
  );
};
