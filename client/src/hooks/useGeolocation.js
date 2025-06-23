import { useState, useEffect } from "react";
import axios from "axios";

export default function useGeolocation() {
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await axios.get(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const { city, principalSubdivision, countryName } = res.data;
              setLocation(
                city && principalSubdivision && countryName
                  ? `${city}/${principalSubdivision}, ${countryName}`
                  : "Location not available"
              );
            } catch (error) {
              setLocation("Error fetching location");
            }
          },
          () => setLocation("Location access denied")
        );
      } else {
        setLocation("Geolocation not supported");
      }
    };
    fetchLocation();
  }, []);

  return location;
}
