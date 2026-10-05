import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";
import { ActivityIndicator, Platform, View } from "react-native";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
 /*    const [skiaReady, setSkiaReady] = useState(Platform.OS !== "web");

  useEffect(() => {
    if (Platform.OS === "web") {
      LoadSkiaWeb().then(() => setSkiaReady(true));
    }
  }, []); */

/*   if (!skiaReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  } */
    return(
      <GestureHandlerRootView>
        <AuthProvider>
            <Stack screenOptions={{animation: "slide_from_right"}}>
                <Stack.Screen name="(protected)" options={{headerShown: false}} />
                <Stack.Screen name="signIn" options={{headerShown: false}} />
                <Stack.Screen name="logIn" options={{headerShown: false}} />
            </Stack>
        </AuthProvider>
        </GestureHandlerRootView>
)}