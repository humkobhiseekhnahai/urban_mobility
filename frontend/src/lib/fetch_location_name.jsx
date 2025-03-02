// const geoapifyKey = import.meta.env.VITE_GEOAPIFY_KEY;

// export const fetchLocationName = async (latitude, longitude) => {
//     try {
//         const response = await fetch(
//             `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${geoapifyKey}`
//         );
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (data.features?.length > 0) {
//             const properties = data.features[0].properties;
            
//             // Prioritize formatted address, then construct from components
//             return properties.formatted || 
//                    [
//                     properties.address_line1,
//                     properties.address_line2,
//                     properties.postcode,
//                     properties.city,
//                     properties.country
//                    ].filter(Boolean).join(', ') || 
//                    "No address found";
//         }
//         return "No address found";
        
//     } catch (error) {
//         console.error("Error fetching location name:", error);
//         return "Address unavailable";
//     }
// }

export const fetchLocationName = async (lat, lng) => {
    try {
      // Use a geocoding API like Google Maps or OpenStreetMap Nominatim
      // Example with OpenStreetMap Nominatim:
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'MyLocalDevApp (pratham.mailme09@gmail.com)' // Nominatim requires a User-Agent
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract a meaningful name from the response
      if (data && data.display_name) {
        // Return a shortened version for display
        const parts = data.display_name.split(', ');
        return parts.slice(0, 2).join(', '); // Just the first two parts for brevity
      }
      
      return "No address found";
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Location lookup failed";
    }
  };