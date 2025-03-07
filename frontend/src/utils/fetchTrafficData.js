export const fetchTrafficData = async (lat, lng, radius) => {
  try {
    const hereApiKey = import.meta.env.VITE_HEREAPI_KEY;

    const lat1 = lat - radius;
    const lng1 = lng - radius;
    const lat2 = lat + radius;
    const lng2 = lng + radius;

    console.log(lat1, lng1, lat2, lng2);

    const trafficUrl = `https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:${lng1},${lat1},${lng2},${lat2}&apiKey=${hereApiKey}`;
    const response = await fetch(trafficUrl);
    const data = await response.json();

    if (!data.results) {
      console.error("Error fetching traffic data");
      return null;
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

    const normalizedHeatmapData = points.map(([lat, lng, intensity]) => [
      lat,
      lng,
      intensity / maxIntensity,
    ]);

    return normalizedHeatmapData;
  } catch (error) {
    console.log(error);
    return null;
  }
};
