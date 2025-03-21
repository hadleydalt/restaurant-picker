import { Pressable, StyleSheet, ImageBackground, ViewStyle, TextStyle, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ReactNode } from 'react';

interface ButtonProps {
  onPress: () => void;
  text: string | ReactNode | number;
  disabled?: boolean;
  backgroundImage?: any;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ onPress, text, disabled, backgroundImage, style, textStyle }: ButtonProps) {
  const backgroundColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const pressedBackgroundColor = useThemeColor({ light: '#0051A8', dark: '#0060BC' }, 'tabIconSelected');
  const isMinor = typeof text !== 'string';

  const renderContent = () => {
    if (typeof text === 'string' || typeof text === 'number') {
      return (
        <ThemedText style={[styles.text, textStyle]}>
          {text}
        </ThemedText>
      );
    }
    return text;
  };

  if (backgroundImage) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          style,
          isMinor && styles.minorButton,
          disabled && styles.disabled
        ]}>
        <ImageBackground 
          source={backgroundImage}
          style={[styles.backgroundImage, { width: style?.width || '100%' }]}
          resizeMode="stretch"
        >
          {renderContent()}
        </ImageBackground>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isMinor ? styles.minorButton : style,
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
    fontSize: 20,
    fontWeight: 'normal',
    fontFamily: 'PixelifySans-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});