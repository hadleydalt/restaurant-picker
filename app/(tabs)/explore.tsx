import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.imagePlaceholder} />
      <ThemedText type="title" style={styles.title}>About</ThemedText>
      <ThemedText style={styles.paragraph}>
        Wheel of Meals helps you discover new restaurants in your area. Simply set your preferred distance,
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
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#808080',
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  paragraph: {
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 375,
  },
});
