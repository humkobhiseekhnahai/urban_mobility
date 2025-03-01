import { useGeolocation } from "@uidotdev/usehooks";

// Components
import { MapBox } from "../components/dashboardComponents/Map";
import { LocationLoading } from "../components/dashboardComponents/LocationLoading";
import { IncidentList } from "../components/dashboardComponents/TrafficIncidents/IncidentList";
import { Weather } from "../components/dashboardComponents/Weather";
import { HeatMap } from "../components/dashboardComponents/HeatMap/HeatMap";

export const Dashboard = () => {
  const location = useGeolocation();

  if (location.loading || location.error) return <LocationLoading />;

  return (
    <main className="w-full h-auto bg-[#2a2c38] flex flex-col items-center">
      {/* Navigation */}
      <section className="w-full bg-[#303243] h-[10vh]"></section>

      {/* Main Wrapper */}
      <section className="h-full w-full grid grid-cols-4 p-8 gap-4">
        {/* Map */}
        <div className="col-span-3 h-[60vh] bg-[#303243] rounded-sm shadow-[0px_6px_16px_rgba(20,22,30,0.6),0px_3px_8px_rgba(20,22,30,0.4)] relative">
          <section className="w-full h-[20%] bg-black rounded-t-sm opacity-75 absolute top-0 left-0 z-10 backdrop-blur-sm"></section>
          <div className="w-full h-[100%] z-0">
            {/* <MapBox lat={location.latitude} lng={location.longitude} /> */}
            <HeatMap
              lat={location.latitude}
              lng={location.longitude}
              radius={0.02}
            />
          </div>
        </div>

        {/* Traffic Incidents */}
        <div className="col-span-1 h-[60vh] bg-[#303243] rounded-sm shadow-[0px_6px_16px_rgba(20,22,30,0.6),0px_3px_8px_rgba(20,22,30,0.4)]">
          <section className="w-full h-[20%] bg-[#3b4055] rounded-t-sm"></section>
          <div className="w-full h-[80%] overflow-y-auto">
            <IncidentList
              lat={location.latitude}
              lng={location.longitude}
              radius={10000}
            />
          </div>
        </div>

        {/* Heatmap */}
        <div className="col-span-2 h-[40vh] bg-[#303243] rounded-sm shadow-[0px_6px_16px_rgba(20,22,30,0.6),0px_3px_8px_rgba(20,22,30,0.4)]"></div>

        {/*  */}
        <div className="col-span-1 h-[40vh] bg-[#303243] rounded-sm shadow-[0px_6px_16px_rgba(20,22,30,0.6),0px_3px_8px_rgba(20,22,30,0.4)]">
          <section className="w-full h-[20%] bg-[#3b4055] rounded-t-sm"></section>
        </div>

        {/* Weather */}
        <div className="col-span-1 h-[40vh] bg-[#303243] rounded-sm shadow-[0px_6px_16px_rgba(20,22,30,0.6),0px_3px_8px_rgba(20,22,30,0.4)]">
          <Weather lat={location.latitude} lng={location.longitude} />
        </div>
      </section>
    </main>
  );
};
