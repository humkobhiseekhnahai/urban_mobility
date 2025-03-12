import { Search } from "lucide-react";
import { Select, Option, Input } from "@material-tailwind/react";
import { filterRoutesBySourceDest } from "../../utils/dashboard/filterRoutesBySourceDest";

const Times = ["All Time", "Morning", "Afternoon", "Evening", "Night"];

export const Filter = ({
  busRoutes,
  source,
  destination,
  setSource,
  setDestination,
  setSelectedTime,
  setFilteredRoutes,
}) => {
  const handleRouteFiltering = () => {
    const filteredRoutes = filterRoutesBySourceDest(
      busRoutes,
      source,
      destination
    );
    setFilteredRoutes(filteredRoutes);
  };

  return (
    <div className="w-full h-[20%] bg-neutral-900 border-b border-b-neutral-700 ">
      {/* Top */}
      <section className="w-full h-1/2 flex items-center justify-center px-4 gap-3">
        <div className="w-full h-full flex items-center justify-center">
          <Input
            label="From: "
            className="w-full h-10 px-4 text-neutral-200 bg-neutral-800 border border-gray-200 rounded-md"
            onChange={(e) => setSource(e.target.value)}
            color="light-blue"
          />
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <Input
            label="To: "
            className="w-full h-10 px-4 text-neutral-200 bg-neutral-800 border border-gray-200 rounded-md"
            onChange={(e) => setDestination(e.target.value)}
            color="light-blue"
          />
        </div>

        <div>
          <button
            className="w-[40px] h-[40px] bg-blue-600 rounded-md flex items-center justify-center hover:cursor-pointer hover:bg-blue-700 transition-colors"
            type="button"
            onClick={handleRouteFiltering}
          >
            <Search size={20} className="text-white" />
          </button>
        </div>
      </section>

      {/* Bottom */}
      <section className="w-full h-1/2 flex items-center justify-center px-4 gap-3">
        <div className="w-full h-full flex items-center justify-center">
          <Select
            defaultValue={"All Time"}
            label="Select Time"
            className="bg-neutral-800 text-neutral-200 border border-neutral-600 rounded-md"
            color="light-blue"
            menuProps={{
              className:
                "bg-neutral-800 text-neutral-200 border border-neutral-600 rounded-md",
            }}
            onChange={(value) => {
              setSelectedTime(value);
              console.log(value);
            }}
          >
            {Times.map((time) => (
              <Option value={time} className="hover:bg-neutral-700" key={time}>
                {time}
              </Option>
            ))}
          </Select>
        </div>
      </section>
    </div>
  );
};
