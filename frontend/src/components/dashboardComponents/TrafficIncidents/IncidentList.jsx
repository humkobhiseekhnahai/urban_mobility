import { useFetch } from "@mantine/hooks";
import { coordsToBbox } from "../../../utils/coordsToBbox";

// Components
import { IncidentElement } from "./IncidentElement";

const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;

export const IncidentList = ({ lat, lng, radius }) => {

  const lati = parseFloat("12.9516");
  const lngi = parseFloat("77.6961");
  const bbox = coordsToBbox(lat, lng, radius);
  const tempbbox = "77.5726,12.9536,77.6166,12.9896";

  const { data, error, loading } = useFetch(
    `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${tomtomApiKey}&bbox=${tempbbox}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory}}}&language=en-GB&t=1111&timeValidityFilter=present`
  );

  console.log(data);

  if (loading)
    return (
      <div>
        <p className="text-gray-200">Loading Incidents Near 5 KM of you...</p>

      </div>
    );

  if (error)
    return (
      <div>
        <p className="text-gray-200">
          There was an error loading incidents in your area.
        </p>
      </div>
    );

  return (

    <div className="w-full h-full overflow-y-auto">

      {data?.incidents.map((incident, indx) => {
        return (
          <IncidentElement
            key={indx}
            coordinates={incident.geometry.coordinates}
            category={incident.properties.iconCategory}
          />
        );
      })}
      {data?.incidents.length === 0 && (
        <p className="text-gray-200 text-center">
          No incidents in the area. Drive safe!
        </p>
      )}
    </div>
  );
};
