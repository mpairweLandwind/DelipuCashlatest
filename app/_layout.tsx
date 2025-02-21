// RootLayout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { MobxProvider } from '@/store/MobxContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';





export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // Explicitly hiding the splash screen is no longer necessary.
      console.log('Fonts loaded, app is ready.');
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
  
   <MobxProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Toast  position="bottom" visibilityTime={3000} />
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      </MobxProvider>
   
  );
}
