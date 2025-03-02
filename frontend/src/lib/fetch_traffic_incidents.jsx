
const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;
export const FetchRoadClosures = async (startLat, startLng, endLat, endLng) => {
    try {
      // Step 1: Get route from start to end using TomTom Routing API
      const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${startLat},${startLng}:${endLat},${endLng}/json?key=${tomtomApiKey}&traffic=true`;
      const routeResponse = await fetch(routeUrl);
      const routeData = await routeResponse.json();
  
      if (!routeData.routes || routeData.routes.length === 0) {
        console.error("No route found.");
        return { real_time_data: { traffic: "Unknown", road_closures: [] } };
      }
  
      // Step 2: Get bounding box along the route
      const routePoints = routeData.routes[0].legs[0].points;
      let minLat = Math.min(...routePoints.map((p) => p.latitude));
      let maxLat = Math.max(...routePoints.map((p) => p.latitude));
      let minLng = Math.min(...routePoints.map((p) => p.longitude));
      let maxLng = Math.max(...routePoints.map((p) => p.longitude));
  
      const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;
  
      // Step 3: Fetch incidents along the route
      const incidentsUrl = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${tomtomApiKey}&bbox=${bbox}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory}}}&language=en-GB&t=1111&timeValidityFilter=present`;
  
      const incidentsResponse = await fetch(incidentsUrl);
      const incidentsData = await incidentsResponse.json();
  
      let roadClosures = [];
  
      if (incidentsData.incidents) {
        incidentsData.incidents.forEach((incident) => {
          if (incident.properties.iconCategory === 8) {
            // Category 8 means "Road Closed"
            roadClosures.push("Road closure at coordinates: " + incident.geometry.coordinates);
          }
        });
      }
  
      // Step 4: Determine traffic level (simplified logic)
      let trafficLevel = "Moderate";
      if (roadClosures.length > 0) trafficLevel = "Heavy";
      
      return {
        real_time_data: {
          traffic: trafficLevel,
          road_closures: roadClosures.length > 0 ? roadClosures : ["No road closures detected"]
        }
      };
    } catch (error) {
      console.error("Error fetching road closures:", error);
      return { real_time_data: { traffic: "Unknown", road_closures: [] } };
    }
  };
  