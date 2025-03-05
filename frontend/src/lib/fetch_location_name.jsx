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



export const fetchLocationName = async (latitude, longitude) => {
    try {
      if (!latitude || !longitude) return "No address found";
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${longitude}&lon=${latitude}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch location");
      }
      
      const data = await response.json();
      return data.display_name.split(",").slice(0, 3).join(", ") || "No address found";
    
    } catch (error) {
      console.error("Error fetching location:", error);
      return "No address found";
    }
  };
  