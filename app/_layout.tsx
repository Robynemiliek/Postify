import { Stack } from "expo-router";

// Root stack connects the tab screens with screens outside the tab bar.
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="postDetails/[id]" />
    </Stack>
  );
}
