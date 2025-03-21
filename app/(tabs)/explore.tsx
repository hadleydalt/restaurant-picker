import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
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
      <ThemedText type="title" style={styles.title}>About</ThemedText>
      <ThemedText style={styles.paragraph}>
        Wheel of Meals helps you make a decision about where to eat and discover new restaurants in your area. Simply set your preferred distance,
        and let us surprise you with a curated selection of nearby dining spots. Don't like what you see?
        Just tap "Try Another" for a new suggestion!
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 0,
    marginTop: -110,
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
  title: {
    fontFamily: 'PixelifySans-Regular',
    marginBottom: 16,
    fontWeight: 'normal',
  },
  paragraph: {
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 375,
  },
});
