import * as Location from 'expo-location';

/**
 * Gets the user's current location coordinates
 * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves with the coordinates
 */
export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };
};