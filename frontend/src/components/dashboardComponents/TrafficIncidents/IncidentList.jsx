import { useFetch } from "../../../hooks/useFetch";
import { coordsToBbox } from "../../../utils/coordsToBbox";

// Components
import { IncidentElement } from "./IncidentElement";

const tomtomApiKey = import.meta.env.VITE_TOMTOM_KEY;

export const IncidentList = ({ lat, lng, radius }) => {
  const bbox = coordsToBbox(lat, lng, radius);
  // const tempbbox = "77.5726,12.9536,77.6166,12.9896";

  const { data, error, isPending } = useFetch(
    `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${tomtomApiKey}&bbox=${bbox}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory}}}&language=en-GB&t=1111&timeValidityFilter=present`
  );

  if (isPending)
    return (
      <div>
        <p>Loading Incidents Near 1 KM of you...</p>
      </div>
    );

  if (error)
    return (
      <div>
        <p>There was an error loading incidents in your area.</p>
      </div>
    );

  return (
    <div className="w-full h-full mt-4">
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
        <p>No incidents in the area. Drive safe!</p>
      )}
    </div>
  );
};
