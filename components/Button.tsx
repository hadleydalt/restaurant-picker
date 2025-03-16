import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps {
  onPress: () => void;
  text: string;
  disabled?: boolean;
}

export function Button({ onPress, text, disabled }: ButtonProps) {
  const backgroundColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const pressedBackgroundColor = useThemeColor({ light: '#0051A8', dark: '#0060BC' }, 'tabIconSelected');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? pressedBackgroundColor : backgroundColor },
        disabled && styles.disabled
      ]}>
      <ThemedText style={styles.text}>{text}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
}); 