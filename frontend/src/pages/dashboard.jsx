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

// Functions
import { filterRoutesByTime } from "../utils/dashboard/filterRoutesByTime";

export const Dashboard = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const location = useGeolocation();
  const [isOptimizedModalOpen, setIsOptimizedModalOpen] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedTime, setSelectedTime] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [busRoutesLimit, setBusRoutesLimit] = useState(10);
  const [selectedRoute] = useAtom(selectedRouteAtom);
  const [routeModalOpen, setIsRouteModalOpen] = useState(false);

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
      setFilteredRoutes(busRoutes);
    } catch (error) {
      setBusRoutes(null);
      console.error(error);
    }
  };

  useEffect(() => {
    setFilteredRoutes(filterRoutesByTime(busRoutes, selectedTime));
  }, [selectedTime]);

  useEffect(() => {
    getAllBusRoutes();
  }, [busRoutesLimit]);

  if (location.loading || location.error) return <LocationLoading />;

  return (
    <main className="bg-neutral-850">
      <div className="w-full h-screen flex flex-col md:flex-row">
        <div className="hidden md:block">
          <NavBarComponent />
        </div>

        {/* Sidebar Section (Dashboard Heading, Filter & Bus Routes) */}
        <section className="w-full md:w-[45%] h-auto md:h-full bg-neutral-900 border-r border-r-neutral-800 p-4">
          {/* ✅ Added Dashboard Heading */}
          <div className="mb-4 text-center">
            <h1 className="text-white text-2xl font-semibold">Dashboard</h1>
            <p className="text-neutral-400 text-sm">
              View traffic incidents, weather data, and bus routes in your area
            </p>
          </div>

          {/* Filters */}
          <Filter
            busRoutes={busRoutes}
            setSource={setSource}
            source={source}
            destination={destination}
            setDestination={setDestination}
            setSelectedTime={setSelectedTime}
            setFilteredRoutes={setFilteredRoutes}
          />

          {/* Bus Route List */}
          <BusRouteList
            filteredRoutes={filteredRoutes}
            handleViewRouteDetails={handleViewRouteDetails}
            busRoutes={busRoutes}
            limit={busRoutesLimit}
            setLimit={setBusRoutesLimit}
          />
        </section>

        {/* Main Content Section (Map & Tabs) */}
        <section className="w-full md:w-[55%] h-auto md:h-full bg-neutral-900">
          <div className="w-full h-[300px] md:h-1/2 p-5 rounded-lg">
            <MapBox lng={location.longitude} lat={location.latitude} />
          </div>

          <div className="w-full h-auto md:h-1/2 p-3 rounded-t-md bg-neutral-900 border-t border-t-neutral-800">
            <Tabs value="heatmap" className="h-full flex flex-col">
              <TabsHeader
                className="bg-neutral-900 flex justify-between py-1 overflow-x-auto"
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
    </main>
  );
};
