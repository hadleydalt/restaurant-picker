import { Restaurant } from './types';

interface PlaceResult {
  id: string;
  displayName: {
    text: string;
  };
  rating?: number;
  userRatingCount?: number;
  formattedAddress: string;
  priceLevel?: number;
}

interface PlacesResponse {
  places?: PlaceResult[];
}

/**
 * Formats the price level to dollar signs
 * @param priceLevel - Number from 0 to 4
 * @returns string of $ symbols
 */
const formatPriceLevel = (priceLevel: number | undefined): string => {
  if (priceLevel === undefined) return 'Price not available';
  return ''.padStart(priceLevel, '$');
};

/**
 * Fetches nearby restaurants using Google Places API
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @param {number} radius - Search radius in meters (default 1500 = 1.5km)
 * @returns {Promise<Restaurant[]>} Array of restaurant objects
 */
export const findNearbyRestaurants = async (
  latitude: number,
  longitude: number,
  radius: number = 1500
): Promise<Restaurant[]> => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Places API key not found');
  }

  try {
    console.log('Fetching restaurants...');
    console.log('Using coordinates:', { latitude, longitude });
    
    const endpoint = 'https://places.googleapis.com/v1/places:searchText';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.id'
      },
      body: JSON.stringify({
        textQuery: `restaurants near ${latitude},${longitude}`,
        maxResultCount: 20,
        locationBias: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude
            },
            radius: radius
          }
        }
      })
    });

    const data: PlacesResponse = await response.json();

    if (!data.places) {
      throw new Error(
        `API Error - No places returned\n` +
        `Details: ${JSON.stringify(data, null, 2)}`
      );
    }

    return data.places.map((place: PlaceResult): Restaurant => ({
      id: place.id,
      name: place.displayName.text,
      rating: place.rating || 0,
      userRatingsTotal: place.userRatingCount || 0,
      address: place.formattedAddress,
      priceLevel: place.priceLevel || 0,
      formattedPriceLevel: formatPriceLevel(place.priceLevel)
    }));
  } catch (error: unknown) {
    console.error('Full error:', error);
    if (error instanceof Error) {
      throw new Error(`Error fetching restaurants: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching restaurants');
  }
}; 