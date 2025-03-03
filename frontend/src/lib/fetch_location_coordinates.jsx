const geoapifyKey = import.meta.env.VITE_GEOAPIFY_KEY;

export const fetchCoordinates = async (locationName) => {
    try {
        const encodedLocation = encodeURIComponent(locationName);
        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodedLocation}&apiKey=${geoapifyKey}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.features?.length > 0) {
            const firstResult = data.features[0];
            return {
                lat: firstResult.properties.lat,
                lon: firstResult.properties.lon,
                address: firstResult.properties.formatted
            };
        }
        return null;
        
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
}
