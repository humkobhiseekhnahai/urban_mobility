import { useEffect, useState, useCallback } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import { TileLayer, MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useMap } from "react-leaflet";

const mapBoxAccessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;
const hereApiKey = import.meta.env.VITE_HEREAPI_KEY;
const weatherApiKey = import.meta.env.VITE_WEATHERAPI_KEY;
const geoapifyKey = import.meta.env.VITE_GEOAPIFY_KEY;

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

export const Dashboard = () => {
  const [location, setLocation] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incidentLocations, setIncidentLocations] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);

  const fetchTrafficData = async (lat, lng) => {
    try {
      const lat1 = lat - 0.01;
      const lat2 = lat + 0.01;
      const lng1 = lng - 0.01;
      const lng2 = lng + 0.01;

      const trafficUrl = `https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:${lng1},${lat1},${lng2},${lat2}&apiKey=${hereApiKey}`;
      const response = await fetch(trafficUrl);
      const data = await response.json();

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
    } catch (error) {
      console.error("Error fetching traffic heatmap data:", error);
    }
  };

  const fetchLocationName = useCallback(async (lng, lat) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${geoapifyKey}`
      );
      const data = await response.json();
      return data.features[0].properties.name || "Unknown location";
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Unknown location";
    }
  }, []);

  const resolveIncidentLocations = useCallback(
    async (incidents) => {
      const locations = await Promise.all(
        incidents.map(async (incident) => {
          const [lat] = incident.geometry.coordinates;
          const locationName = await fetchLocationName(lat[0], lat[1]);
          return {
            ...incident,
            locationName,
            categoryName:
              incidentCategoryMap[incident.properties.iconCategory] ||
              "Unknown",
          };
        })
      );
      setIncidentLocations(locations);
    },
    [fetchLocationName]
  );

  const fetchIncidents = useCallback(
    async (latitude, longitude) => {
      setLoading(true);
      const bbox = `${longitude - 0.01},${latitude - 0.01},${
        longitude + 0.01
      },${latitude + 0.01}`;

      const tomtomApiUrl = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${tomtomApiKey}&bbox=${bbox}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory}}}&language=en-GB&t=1111&timeValidityFilter=present`;

      try {
        const response = await fetch(tomtomApiUrl);
        const data = await response.json();

        if (data.incidents && data.incidents.length > 0) {
          setIncidents(data.incidents);
          await resolveIncidentLocations(data.incidents);
        } else {
          setIncidents([]);
        }
      } catch (error) {
        console.error("Error fetching traffic incidents:", error);
        setIncidents([]);
      }
      setLoading(false);
    },
    [resolveIncidentLocations]
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          setLocation({ latitude, longitude });
          await fetchIncidents(latitude, longitude);
          await fetchTrafficData(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported.");
      setLoading(false);
    }
  }, [fetchIncidents]);

  return (
    <div className="min-h-screen w-full px-8 py-6 bg-inherit">
      <header className="grid grid-cols-3 bg-white shadow-lg p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Uplyft</h1>
        <div className="flex justify-center">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
            City
          </button>
        </div>
        <p className="text-gray-700 font-medium text-right">
          {loading ? "Locating..." : "Your Location"}
        </p>
      </header>

      {/* Mapbox */}
      <div className="h-[50vh] w-full bg-green-100 rounded-lg mb-6 drop-shadow-lg">
        {loading ? (
          <p className="text-center text-gray-700 mt-20">Loading map...</p>
        ) : (
          <Map
            mapboxAccessToken={mapBoxAccessToken}
            initialViewState={{
              latitude: location?.latitude || 37.8,
              longitude: location?.longitude || -122.4,
              zoom: 14,
            }}
            mapStyle="mapbox://styles/mapbox/navigation-day-v1"
          >
            {/* User Location Marker */}
            {location && (
              <Marker
                longitude={location.longitude}
                latitude={location.latitude}
                color="blue"
              />
            )}

            {/* Incident Areas */}
            {incidents.map((incident, index) => (
              <Source
                key={index}
                type="geojson"
                data={{
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      geometry: {
                        type: "Polygon",
                        coordinates: [
                          [
                            [
                              incident.geometry.coordinates[0] - 0.001,
                              incident.geometry.coordinates[1] - 0.001,
                            ],
                            [
                              incident.geometry.coordinates[0] + 0.001,
                              incident.geometry.coordinates[1] - 0.001,
                            ],
                            [
                              incident.geometry.coordinates[0] + 0.001,
                              incident.geometry.coordinates[1] + 0.001,
                            ],
                            [
                              incident.geometry.coordinates[0] - 0.001,
                              incident.geometry.coordinates[1] + 0.001,
                            ],
                            [
                              incident.geometry.coordinates[0] - 0.001,
                              incident.geometry.coordinates[1] - 0.001,
                            ],
                          ],
                        ],
                      },
                      properties: {},
                    },
                  ],
                }}
              >
                <Layer
                  id={`incident-${index}`}
                  type="fill"
                  paint={{
                    "fill-color": "red",
                    "fill-opacity": 0.4,
                  }}
                />
              </Source>
            ))}
          </Map>
        )}
      </div>

      {/* Main Grid Section (Incidents + Future Sections) */}
      <main className="grid grid-cols-3 gap-6 grid-rows-2">
        {/* Traffic Incidents Box */}
        <section className="bg-white p-4 shadow-lg rounded-lg h-[400px] overflow-hidden">
          <h2 className="text-xl font-semibold mb-3">Traffic Incidents</h2>
          {loading ? (
            <p className="text-gray-600">Fetching incidents...</p>
          ) : incidents.length === 0 ? (
            <p className="text-gray-600">No incidents reported in your area.</p>
          ) : (
            <div className="overflow-y-auto h-[320px] space-y-3 pr-2">
              {incidentLocations.map((incident, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg shadow-md border-l-4 border-red-500"
                >
                  <h3 className="font-medium text-gray-800">
                    {incident.locationName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Type: {incident.type || "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Category: {incident.categoryName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Placeholder for Future Sections */}
        <section className="bg-white p-4 shadow-lg rounded-lg h-[400px] flex items-center justify-center text-gray-500 col-span-2">
          <MapContainer
            center={location ? [location.latitude, location.longitude] : [0, 0]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {heatmapData.length > 0 && (
              <HeatmapLayer heatmapData={heatmapData} />
            )}
          </MapContainer>
        </section>
        <WeatherApp />
        <section className="bg-white p-4 shadow-lg rounded-lg h-[400px] overflow-hidden my-4">
          <h2 className="text-xl font-semibold mb-3">Public Transport</h2>
          <div className="overflow-y-auto h-[320px] space-y-3 pr-2">
            <div className="bg-gray-100 p-3 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center">
              <div className="mr-3">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Route: 101</h3>
                <p className="text-gray-600 text-sm">
                  From: Downtown To: Uptown
                </p>
                <p className="text-gray-600 text-sm">
                  Timings: 08:00 AM, 09:00 AM, 10:00 AM
                </p>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center">
              <div className="mr-3">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Route: 202</h3>
                <p className="text-gray-600 text-sm">
                  From: Central Park To: City Hall
                </p>
                <p className="text-gray-600 text-sm">
                  Timings: 08:30 AM, 09:30 AM, 10:30 AM
                </p>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center">
              <div className="mr-3">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Route: 303</h3>
                <p className="text-gray-600 text-sm">
                  From: East Side To: West End
                </p>
                <p className="text-gray-600 text-sm">
                  Timings: 09:00 AM, 10:00 AM, 11:00 AM
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const HeatmapLayer = ({ heatmapData }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    const heatLayer = L.heatLayer(heatmapData, {
      radius: 10,
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

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${lat},${lon}`
      );
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported.");
      setLoading(false);
    }
  }, []); // Removed fetchWeatherData from dependencies

  return (
    <section className="bg-gradient-to-br from-blue-200 to-blue-400 p-6 shadow-2xl rounded-3xl h-[400px] flex flex-col justify-between overflow-hidden col-span-2">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-4">
        Weather Updates
      </h2>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
        </div>
      ) : weatherData ? (
        <div className="text-white overflow-y-auto space-y-4">
          <div className="text-center">
            <h3 className="text-4xl font-bold">{weatherData.location.name}</h3>
            <p className="text-md opacity-80">{weatherData.location.region}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <img
                src={weatherData.current.condition.icon || "/placeholder.svg"}
                alt="Weather Icon"
                className="w-24 h-24 drop-shadow-lg"
              />
              <div>
                <p className="text-5xl font-extrabold">
                  {weatherData.current.temp_c}°C
                </p>
                <p className="text-xl capitalize">
                  {weatherData.current.condition.text}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center space-x-2">
                <span className="text-red-500 text-2xl">🌡️</span>
                <span>Feels like {weatherData.current.feelslike_c}°C</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center space-x-2">
                <span className="text-blue-300 text-2xl">💧</span>
                <span>Humidity {weatherData.current.humidity}%</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center space-x-2">
                <span className="text-gray-300 text-2xl">💨</span>
                <span>Wind {weatherData.current.wind_kph} km/h</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center space-x-2">
                <span className="text-gray-400 text-2xl">☁️</span>
                <span>Cloud {weatherData.current.cloud}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-700 text-center font-semibold">
          Unable to fetch weather data.
        </p>
      )}
    </section>
  );
};
