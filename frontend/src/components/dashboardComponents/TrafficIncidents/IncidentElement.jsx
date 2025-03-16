import { IncidentCategory } from "../../../utils/incidentCategory";

import { Info, TriangleAlert } from "lucide-react";
import { fetchLocationName } from "../../../lib/fetch_location_name";
import { useEffect, useState } from "react";

export const IncidentElement = ({ coordinates, category, location }) => {
  // const latitude = coordinates[0][1];
  // const longitude = coordinates[0][0];

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(false);

  // useEffect(() => {
  //   fetchLocationName(latitude, longitude)
  //     .then((location) => {
  //       setLocation(location);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching location:", err);
  //       setError(true);
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <div className="p-4 mx-4 mb-3 border-b border-b-[rgba(255,255,255,0.1)] border-opacity-5 flex">
      {IncidentCategory[category][1] == 1 ? (
        <Info
          width={20}
          height={20}
          className="text-blue-400 relative top-1.5 mr-5"
        />
      ) : (
        <TriangleAlert
          width={20}
          height={20}
          className="text-yellow-300 relative top-1.5 mr-5"
        />
      )}
      <span>
        <p className="text-lg font-semibold text-white mb-0.5">
          {IncidentCategory[category][0]}
        </p>
        <p className="text-sm text-gray-500">Location: {location}</p>
      </span>
    </div>
  );
};
