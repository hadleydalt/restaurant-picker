import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ReactNode } from 'react';

interface ButtonProps {
  onPress: () => void;
  text: string | ReactNode;
  disabled?: boolean;
}

export function Button({ onPress, text, disabled }: ButtonProps) {
  const backgroundColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const pressedBackgroundColor = useThemeColor({ light: '#0051A8', dark: '#0060BC' }, 'tabIconSelected');
  const isMinor = typeof text !== 'string';

  const renderContent = () => {
    if (typeof text === 'string') {
      return (
        <ThemedText style={styles.text}>
          {text}
        </ThemedText>
      );
    }
    return text;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isMinor ? styles.minorButton : { backgroundColor: pressed ? pressedBackgroundColor : backgroundColor },
        disabled && styles.disabled
      ]}>
      {renderContent()}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minorButton: {
    backgroundColor: 'transparent',
    minWidth: 44,
    width: 44,
    height: 44,
    paddingHorizontal: 0,
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