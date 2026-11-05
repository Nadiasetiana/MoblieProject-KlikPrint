import { Stack } from "expo-router";
import { ThemeProvider } from "../constants/themecontext";
import { OrderProvider } from "../constants/ordercontext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <OrderProvider>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="index" options={{ title: "KlikPrint", headerShown: false }}/>
          <Stack.Screen name="theme" options={{ title: "Pengaturan Tema" }}/>
          <Stack.Screen name="orders/[id]" options={{ title: "Detail Pesanan" }}/>
          <Stack.Screen name="orders/new" options={{ title: "Buat Pesanan", presentation: "modal" }}/>
        </Stack>
      </OrderProvider>
    </ThemeProvider>
  );
}
