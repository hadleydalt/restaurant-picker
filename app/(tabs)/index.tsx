import { StyleSheet, View, Linking, Text, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { getCurrentLocation } from '@/scripts/get-location';
import { findNearbyRestaurants } from '@/scripts/find-restaurants';
import { useState } from 'react';
import { Restaurant } from '@/types';
import Slider from '@react-native-community/slider';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { MapArrow } from '@/components/icons/MapArrow';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient }from 'expo-linear-gradient';

const METERS_TO_MILES = 0.000621371;

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export default function HomeScreen() {
  const backgroundColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [radius, setRadius] = useState(1500);

  const selectRandomRestaurant = (restaurantList: Restaurant[]) => {
    const randomIndex = Math.floor(Math.random() * restaurantList.length);
    setSelectedRestaurant(restaurantList[randomIndex]);
  };

  // try another and see previous???

  const handleFindSpot = async () => {
    setLoading(true);
    try {
      const { latitude, longitude } = await getCurrentLocation();
      const fetchedRestaurants = await findNearbyRestaurants(latitude, longitude, radius);
      
      if (fetchedRestaurants.length === 0) {
        setSelectedRestaurant(null);
        setRestaurants([]);
        return;
      }

      setRestaurants(fetchedRestaurants);
      selectRandomRestaurant(fetchedRestaurants);
    } catch (error: any) {
      console.error('Error:', error.message);
      setSelectedRestaurant(null);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    if (restaurants.length > 0) {
      selectRandomRestaurant(restaurants);
    }
  };

  const formatDistance = (meters: number) => {
    const miles = meters * METERS_TO_MILES;
    let description = '';
    
    if (miles <= 0.5) {
      description = '(10-15 minute walk)';
    } else if (miles <= 5) {
      description = '(10-20 minute drive)';
    } else if (miles <= 10) {
      description = '(20-30 minute drive)';
    }
    
    return `${miles.toFixed(1)} miles ${description}`.trim();
  };

  const openInMaps = (restaurant: Restaurant) => {
    // Create a Google Maps URL with the place ID
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}&query_place_id=${restaurant.placeId}`;
    Linking.openURL(url).catch((err) => console.error('Error opening maps:', err));
  };

  const getTodaysHours = (openingHours?: string[]) => {
    if (!openingHours?.length) return null;
    
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const todayName = DAYS_OF_WEEK[today];
    
    const todaysSchedule = openingHours.find(schedule => 
      schedule.startsWith(todayName)
    );
    
    if (!todaysSchedule) return null;
    
    // Remove the day name from the schedule
    return todaysSchedule.replace(`${todayName}: `, '');
  };

  const getPhotoUrl = (photoReference?: string) => {
    if (!photoReference) return undefined;
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
    return `https://places.googleapis.com/v1/${photoReference}/media?key=${apiKey}&maxHeightPx=400&maxWidthPx=400`;
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['white', 'rgba(187, 208, 234, 0.6)']} style={styles.gradientContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">🍽️ Wheel of Meals</ThemedText>
      </ThemedView>

      {!selectedRestaurant && (
        <View style={styles.searchContainer}>
          <ThemedText style={styles.description}>
            How far are you willing to go?
          </ThemedText>
          <ThemedText style={styles.radiusText}>
            {formatDistance(radius)}
          </ThemedText>
          <Slider
            style={styles.slider}
            minimumValue={400}    // ~0.25 miles
            maximumValue={16093}  // 10 miles
            step={400}           // ~0.25 mile steps
            value={radius}
            onValueChange={setRadius}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#D8D8D8"
          />
          <Button 
            onPress={handleFindSpot}
            text={loading ? "Finding your next meal..." : "Find me a spot!"}
            disabled={loading}
          />
        </View>
      )}

      {selectedRestaurant && (
        <ThemedView style={styles.resultContainer}>
          {selectedRestaurant.photoReference && getPhotoUrl(selectedRestaurant.photoReference) && (
            <Image
              source={{ uri: getPhotoUrl(selectedRestaurant.photoReference) }}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
          )}
          <ThemedText type="subtitle" style={styles.restaurantName}>
            {selectedRestaurant.name}
          </ThemedText>
          <ThemedText style={styles.detail}>
            {selectedRestaurant.address}
          </ThemedText>
          <ThemedView style={styles.ratingContainer}>
            <ThemedText style={styles.detail}>
              Rating: {selectedRestaurant.rating}/5
            </ThemedText>
            <ThemedText style={styles.detail}>
              Price: {selectedRestaurant.formattedPriceLevel}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.hoursContainer}>
            <ThemedText style={[styles.detail, styles.openStatus]}>
              {selectedRestaurant.isOpenNow ? '✓ Open now' : '✗ Closed'}
            </ThemedText>
            {getTodaysHours(selectedRestaurant.openingHours) ? (
              <ThemedText style={styles.hours}>
                Today: {getTodaysHours(selectedRestaurant.openingHours)}
              </ThemedText>
            ) : (
              <ThemedText style={styles.hours}>
                Hours not available
              </ThemedText>
            )}
          </ThemedView>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <View style={styles.backButtonContainer}>
                <Button 
                  onPress={() => setSelectedRestaurant(null)}
                  text={<ChevronLeft size={28} color={backgroundColor} />}
                  disabled={loading}
                />
              </View>
              <Button 
                onPress={handleTryAgain}
                text="Try Another"
                disabled={loading}
              />
              <View style={styles.mapButtonContainer}>
                <Button 
                  onPress={() => selectedRestaurant && openInMaps(selectedRestaurant)}
                  text={<MapArrow size={28} color={backgroundColor} />}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </ThemedView>
      )}
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  description: {
    fontSize: 18,
    marginBottom: 8,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  radiusText: {
    textAlign: 'center',
    opacity: 0.8,
    fontSize: 16,
  },
  resultContainer: {
    alignItems: 'center',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  restaurantName: {
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  detail: {
    textAlign: 'center',
    marginVertical: 4,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 0,
  },
  mapButtonContainer: {
    position: 'absolute',
    right: 0,
  },
  hoursContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  openStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  hours: {
    fontSize: 14,
    opacity: 0.8,
    marginVertical: 2,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
});
