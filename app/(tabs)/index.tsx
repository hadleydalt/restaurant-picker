import { StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { getCurrentLocation } from '@/scripts/get-location';
import { findNearbyRestaurants } from '@/scripts/find-restaurants'
import { useState } from 'react';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const handleFindSpot = async () => {
    setLoading(true);
    try {
      const { latitude, longitude } = await getCurrentLocation();
      const restaurants = await findNearbyRestaurants(latitude, longitude);
      
      if (restaurants.length === 0) {
        Alert.alert('No restaurants found', 'Try increasing the search radius or try again later.');
        return;
      }

      // Randomly select a restaurant
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      const selected = restaurants[randomIndex];
      
      Alert.alert(
        'Your spot!',
        `${selected.name}\n${selected.address}\n${selected.rating ? `Rating: ${selected.rating}/5` : ''}`
      );
      
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">🍽️ Wheel of Meals</ThemedText>
      </ThemedView>
      <Button 
        onPress={handleFindSpot}
        text={loading ? "Finding..." : "Find me a spot"}
        disabled={loading}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
});
