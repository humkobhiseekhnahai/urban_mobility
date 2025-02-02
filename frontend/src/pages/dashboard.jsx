import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "";

export const Dashboard = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [77.1025, 28.7041],
      zoom: 10,
    });
  }, []);

  return (
    <div className="min-h-screen w-full px-8 py-6 bg-gray-50">
      <header className="grid grid-cols-3 bg-white shadow-lg p-4 rounded-lg mb-6">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold">Uplyft</h1>
        </div>

        <div className="flex justify-center items-center">
          <div className="flex space-x-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200">
              Delivery
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200">
              City
            </button>
          </div>
        </div>

        <div className="flex justify-end items-center">
          <p className="text-gray-700 font-medium">Delhi, India</p>
        </div>
      </header>

      <div className="h-72 w-full flex items-center justify-center bg-green-100 rounded-lg">
        <div ref={mapContainer} className="h-full w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6 w-full">
        <div className="p-6 bg-white shadow-lg rounded-lg flex items-start space-x-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2646/2646499.png"
            alt="Incident"
            className="w-12 h-12"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🚨</span> Incident Reports
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span> Traffic accident
                near St. Laurent Blvd.
              </li>
              <p className="text-xs text-gray-500 ml-6">
                Two vehicles involved, minor injuries reported. Emergency
                services on site.
              </p>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">🚧</span> Road closure at
                Highway 40 due to construction.
              </li>
              <p className="text-xs text-gray-500 ml-6">
                Expected reopening by 6:00 PM. Use alternate routes via
                Boulevard des Sources.
              </p>
            </ul>
          </div>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-lg flex items-start space-x-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3347/3347924.png"
            alt="Traffic"
            className="w-12 h-12"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🚦</span> Traffic Congestion
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">🟡</span> Moderate
                congestion on Rue Sainte-Catherine.
              </li>
              <p className="text-xs text-gray-500 ml-6">
                Average speed: 25 km/h. Delay: 10-15 mins.
              </p>
              <li className="flex items-center">
                <span className="text-red-600 mr-2">🔴</span> Heavy traffic on
                Avenue du Parc.
              </li>
              <p className="text-xs text-gray-500 ml-6">
                Major delay: Up to 30 mins. Consider taking Sherbrooke St. as an
                alternative.
              </p>
            </ul>
          </div>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-lg flex items-start space-x-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1064/1064065.png"
            alt="Transport"
            className="w-12 h-12"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🚌</span> Public Transport
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-green-600 mr-2">🚇</span> Metro Line 2
                running on schedule.
              </li>
              <p className="text-xs text-gray-500 ml-6">
                All trains operating at normal frequency. No reported delays.
              </p>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">🚌</span> Bus 55 delayed
                by 10 minutes.
              </li>
              <p className="text-xs text-gray-500 ml-6">
                Next bus expected at 3:45 PM. Check real-time updates on the STM
                app.
              </p>
            </ul>
          </div>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-lg flex items-start space-x-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/414/414927.png"
            alt="Weather"
            className="w-12 h-12"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🌦️</span> Weather Report
            </h2>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium text-gray-600">🌧️ Conditions:</span>{" "}
              Light Rain
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium text-gray-600">💨 Wind:</span> 12
              km/h NW
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium text-gray-600">💧 Humidity:</span>{" "}
              76%
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Rain expected to continue until 5:00 PM. Carry an umbrella.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
