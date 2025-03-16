import { useFetch } from "@mantine/hooks";

const weatherApiKey = import.meta.env.VITE_WEATHERAPI_KEY;

export const Weather = ({ lat, lng }) => {
  const { data, error, loading } = useFetch(
    `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${lat},${lng}`
  );

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-white">Fetching weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-white">Failed to fetch weather data</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[250px] sm:min-h-[300px] md:h-full overflow-hidden relative rounded-md">
      {/* Background Image */}
      <img
        src={
          "https://images.pexels.com/photos/1743392/pexels-photo-1743392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        }
        alt="Weather Image"
        className="w-full h-full object-cover absolute top-0 left-0 z-0"
      />

      {/* Dark Overlay */}
      <div className="w-full h-full bg-black opacity-60 absolute top-0 left-0 z-10"></div>

      {/* Weather Data */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-4 sm:p-6">
        <p className="text-base sm:text-lg md:text-xl font-semibold text-center">
          Weather: {data?.current.condition.text}
        </p>
        <p className="text-sm sm:text-lg md:text-xl">
          Temp: {data?.current.temp_c}°C
        </p>
        <p className="text-sm sm:text-lg md:text-xl">
          Humidity: {data?.current.humidity}%
        </p>
        <p className="text-sm sm:text-lg md:text-xl">
          Wind: {data?.current.wind_kph} km/h
        </p>
      </div>
    </div>
  );
};
