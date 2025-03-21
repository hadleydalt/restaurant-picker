import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/Home.png')} 
              style={{ width: 28, height: 28 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/About.png')} 
              style={{ width: 28, height: 28 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
