import { Stack } from "expo-router";
import { ThemeProvider } from "../constants/themecontext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: "KlikPrint", headerShown: false }}/>
        <Stack.Screen name="theme" options={{ title: "Pengaturan Tema" }}/>
        <Stack.Screen name="orders/[id]"options={{ title: "Detail Pesanan" }}/>
      </Stack>
    </ThemeProvider>
  );
}