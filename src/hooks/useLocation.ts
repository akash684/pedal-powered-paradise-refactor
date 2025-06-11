
import { useState, useEffect } from 'react';

interface LocationState {
  city: string | null;
  isLoading: boolean;
  error: string | null;
  coordinates: { lat: number; lng: number } | null;
}

const INDIAN_CITIES = [
  'Chennai', 'Bengaluru', 'Delhi', 'Hyderabad', 
  'Kochi', 'Pune', 'Kolkata', 'Mumbai'
];

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    city: null,
    isLoading: false,
    error: null,
    coordinates: null,
  });

  const getCurrentLocation = async () => {
    setLocation(prev => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        isLoading: false,
        error: 'Geolocation is not supported by this browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Using Nominatim (OpenStreetMap) for reverse geocoding - free API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }
          
          const data = await response.json();
          const detectedCity = data.address?.city || data.address?.town || data.address?.village;
          
          // Find the closest Indian city from our predefined list
          let nearestCity = null;
          if (detectedCity) {
            nearestCity = INDIAN_CITIES.find(city => 
              city.toLowerCase().includes(detectedCity.toLowerCase()) ||
              detectedCity.toLowerCase().includes(city.toLowerCase())
            );
          }
          
          setLocation({
            city: nearestCity || INDIAN_CITIES[0], // Default to Chennai if no match
            isLoading: false,
            error: null,
            coordinates: { lat: latitude, lng: longitude },
          });
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          setLocation(prev => ({
            ...prev,
            isLoading: false,
            error: 'Failed to detect city',
            coordinates: { lat: latitude, lng: longitude },
          }));
        }
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setLocation(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  };

  const clearLocation = () => {
    setLocation({
      city: null,
      isLoading: false,
      error: null,
      coordinates: null,
    });
  };

  return {
    ...location,
    getCurrentLocation,
    clearLocation,
    availableCities: INDIAN_CITIES,
  };
};
