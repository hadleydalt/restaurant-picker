import { StyleSheet, View, Linking, Text, Image, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { getCurrentLocation } from '@/scripts/get-location';
import { findNearbyRestaurants } from '@/scripts/find-restaurants';
import { useState, useCallback } from 'react';
import React from 'react';
import { Restaurant } from '@/types';
import Slider from '@react-native-community/slider';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { MapArrow } from '@/components/icons/MapArrow';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient }from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

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
  const [fontsLoaded] = useFonts({
    'PixelifySans-Regular': require('../../assets/fonts/PixelifySans-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

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
      <LinearGradient colors={['white', !selectedRestaurant ? 'rgba(187, 208, 234, 0.6)' : 'white']} style={styles.gradientContainer}>
      {!selectedRestaurant && (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/Fork_Knife.png')}
              style={styles.backgroundImage}
              resizeMode="contain"
            />
            <Image
              source={require('../../assets/images/Plate.png')}
              style={styles.overlayImage}
              resizeMode="contain"
            />
          </View>
          <ThemedView style={styles.titleContainer}>
            <Image
              source={require('../../assets/images/titulo2.png')}
              style={styles.titleImage}
              resizeMode="contain"
            />
          </ThemedView>
        </>
      )}

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
            minimumTrackTintColor="#647B93"
            maximumTrackTintColor="rgba(255, 255, 255, 0.7)"
          />
          <Button 
            onPress={handleFindSpot}
            text={loading ? "Finding your next meal..." : "Find me a spot!"}
            disabled={loading}
            backgroundImage={require('../../assets/images/Button 2.png')}
            style={{ width: '100%', height: 60 }}
          />
        </View>
      )}

      {selectedRestaurant && (
        <>
          <View style={[styles.buttonContainer, { marginTop: 0, paddingTop: 70 }]}>
            <View style={styles.buttonRow}>
              <View style={styles.backButtonContainer}>
                <Button 
                  onPress={() => setSelectedRestaurant(null)}
                  text={<Image source={require('../../assets/images/Back.png')} style={{width: 35, height: 35}} />}
                  disabled={loading}
                />
              </View>
              <Button 
                onPress={handleTryAgain}
                text="Try Another"
                disabled={loading}
                textStyle={{ color: '#444547', textShadowColor: 'transparent', fontSize: 25 }}
              />
              <View style={styles.mapButtonContainer}>
                <Button 
                  onPress={() => selectedRestaurant && openInMaps(selectedRestaurant)}
                  text={<Image source={require('../../assets/images/Map.png')} style={{width: 28, height: 28}} />}
                  disabled={loading}
                />
              </View>
            </View>
          </View>

          <ThemedView style={styles.resultContainer}>
            {selectedRestaurant.photoReference && getPhotoUrl(selectedRestaurant.photoReference) && (
              <View style={styles.topResultContainer}>
                <Image
                  source={{ uri: getPhotoUrl(selectedRestaurant.photoReference) }}
                  style={styles.restaurantImage}
                  resizeMode="cover"
                />
              </View>
            )}
            <LinearGradient colors={['rgba(187, 208, 234, 0.6)', 'rgba(187, 208, 234, 1)']} style={styles.infoCard}>
              <ThemedText type="subtitle" style={styles.restaurantName}>
                {selectedRestaurant.name}
              </ThemedText>
              <ThemedView style={styles.hoursContainer}>
                <View style={styles.statusContainer}>
                  <Image 
                    source={selectedRestaurant.isOpenNow ? 
                      require('../../assets/images/Open.png') : 
                      require('../../assets/images/Closed.png')} 
                    style={styles.statusIcon}
                  />
                  <ThemedText style={[styles.detail, styles.openStatus]}>
                    {selectedRestaurant.isOpenNow ? 'OPEN' : 'CLOSED'}
                  </ThemedText>
                </View>
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
              <ThemedView style={styles.ratingContainer}>
                <View style={styles.ratingCard}>
                  <View style={styles.ratingCardContent}>
                    <Image 
                      source={require('../../assets/images/Rating.png')}
                      style={styles.ratingIcon}
                    />
                    <ThemedText style={[styles.detail, styles.ratingText]}>
                      Rating: {selectedRestaurant.rating}/5
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.ratingCard}>
                  <View style={styles.ratingCardContent}>
                    <Image 
                      source={require('../../assets/images/Price.png')}
                      style={styles.ratingIcon}
                    />
                    <ThemedText style={[styles.detail, styles.ratingText]}>
                      Price: {selectedRestaurant.formattedPriceLevel}
                    </ThemedText>
                  </View>
                </View>
              </ThemedView>
              <Pressable 
                onPress={() => selectedRestaurant && openInMaps(selectedRestaurant)}
                style={styles.addressCard}
              >
                <ThemedText style={[styles.detail, styles.addressText]}>
                  {selectedRestaurant.address}
                </ThemedText>
              </Pressable>
              </LinearGradient>
            {/*</View>*/}
          </ThemedView>
        </>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 24,
    padding: 10,
    width: '100%',
  },
  titleImage: {
    width: '80%',
    height: 120,
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'PixelifySans-Regular',
  },
  slider: {
    width: '80%',
    height: 40,
  },
  radiusText: {
    textAlign: 'center',
    opacity: 0.8,
    fontSize: 16,
    fontFamily: 'PixelifySans-Regular',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
  },
  topResultContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
  },
  infoCard: {
    width: '100%',
    padding: 32,
    paddingBottom: 40,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'rgba(187, 208, 234, 0.6)',
    alignItems: 'center',
    height: '75%'
  },
  restaurantName: {
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'PixelifySans-Regular',
    fontWeight: 'normal',
    fontSize: 30,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  ratingCard: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#647B93',
  },
  ratingCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingIcon: {
    width: 25,
    height: 25,
  },
  detail: {
    textAlign: 'center',
    marginVertical: 4,
    fontFamily: 'PixelifySans-Regular',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
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
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    width: 25,
    height: 25,
  },
  openStatus: {
    fontSize: 25,
    fontWeight: 'normal',
    marginBottom: 4,
    fontFamily: 'PixelifySans-Regular',
    color: '#444547',
  },
  hours: {
    fontSize: 20,
    color: '#647B93',
    marginVertical: 2,
    fontFamily: 'PixelifySans-Regular',
    paddingTop: 10,
  },
  restaurantImage: {
    width: '80%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageContainer: {
    marginTop: '30%',
    position: 'relative',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayImage: {
    width: '85%',
    height: '85%',
    position: 'absolute',
    alignSelf: 'center',
    top: '10%',
  },
  ratingText: {
    color: '#444547',
    fontSize: 18,
  },
  addressCard: {
    backgroundColor: '#647B93',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#444547',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  addressText: {
    fontSize: 18,
    fontWeight: 'normal',
    color: 'white',
  },
});
