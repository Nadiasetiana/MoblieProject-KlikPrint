import { Stack } from "expo-router";

// Layout minimal: satu layar saja (index.tsx), tanpa tab bawaan template
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}