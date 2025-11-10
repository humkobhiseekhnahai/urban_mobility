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

  const data = {
    incidents: [
      {
        type: "Feature",
        properties: {
          iconCategory: 6,
          incidentType: "Jam",
          time: "15:10",
          severity: 1,
          location: "MG Road",
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [77.5946, 12.9716],
            [77.595, 12.9718],
            [77.5955, 12.9721],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          iconCategory: 8,
          incidentType: "Road Closed",
          time: "15:20",
          severity: 2,
          location: "Koramangala",
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [77.6109, 12.9867],
            [77.6114, 12.9869],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          iconCategory: 8,
          incidentType: "Road Closed",
          time: "16:05",
          severity: 2,
          location: "Whitefield",
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [77.5982, 12.9754],
            [77.5988, 12.9757],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          iconCategory: 6,
          incidentType: "Jam",
          time: "15:55",
          severity: 1,
          location: "Electronic City",
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [77.6051, 12.9812],
            [77.6058, 12.9815],
            [77.6063, 12.9819],
          ],
        },
      },
    ],
  };

  // const { data, error, loading } = useFetch(
  //   `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${tomtomApiKey}&bbox=${tempbbox}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory}}}&language=en-GB&t=1111&timeValidityFilter=present`
  // );

  console.log(data);

  // if (loading)
  //   return (
  //     <div>
  //       <p className="text-gray-200">Loading Incidents Near 5 KM of you...</p>
  //     </div>
  //   );

  // if (error)
  //   return (
  //     <div>
  //       <p className="text-gray-200">
  //         There was an error loading incidents in your area.
  //       </p>
  //     </div>
  //   );

  return (
    <div className="w-full h-full md:h-full max-h-[50vh] md:max-h-none overflow-y-auto p-2">
      {data?.incidents.map((incident, indx) => (
        <IncidentElement
          key={indx}
          coordinates={incident.geometry.coordinates}
          category={incident.properties.iconCategory}
          location={incident.properties.location}
        />
      ))}
      {data.incidents?.length === 0 && (
        <p className="text-gray-200 text-center">
          No incidents in the area. Drive safe!
        </p>
      )}
    </div>
  );
};
