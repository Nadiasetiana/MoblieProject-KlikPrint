import { Stack } from "expo-router";
import { ThemeProvider } from "../context/themecontext";

// Layout minimal: satu layar saja (index.tsx), tanpa tab bawaan template
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}