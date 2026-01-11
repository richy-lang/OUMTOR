import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DataProvider } from "@/contexts/DataContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="client/[id]" 
        options={{ 
          title: "Détails Client",
          headerStyle: { backgroundColor: '#191970' },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="client/add" 
        options={{ 
          title: "Nouveau Client",
          presentation: "modal",
          headerStyle: { backgroundColor: '#191970' },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="model/add" 
        options={{ 
          title: "Nouveau Modèle",
          presentation: "modal",
          headerStyle: { backgroundColor: '#191970' },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="model/[id]" 
        options={{ 
          title: "Détails Modèle",
          headerStyle: { backgroundColor: '#191970' },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="measurements/[clientId]" 
        options={{ 
          title: "Mesures",
          headerStyle: { backgroundColor: '#191970' },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="creation/add" 
        options={{ 
          title: "Nouvelle Création",
          presentation: "modal",
          headerStyle: { backgroundColor: '#191970' },
          headerTintColor: '#FFFFFF',
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </DataProvider>
    </QueryClientProvider>
  );
}
