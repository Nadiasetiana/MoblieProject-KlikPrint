import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider } from "../constants/themecontext";
import { OrderProvider } from "../constants/ordercontext";
import { AuthProvider, useAuth } from "../constants/authcontext";

// =====================================================================
// ROUTE PROTECTION GUARD
// Mengecek status login setiap kali sesi atau halaman aktif berubah.
// =====================================================================
function RootNavigator() {
  const { session, isLoading } = useAuth();
  const segments = useSegments(); // contoh: ["(auth)", "login"] atau ["orders", "new"]
  const router = useRouter();

  useEffect(() => {
    // RULE 1: masih membaca sesi tersimpan -> jangan redirect dulu
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      // RULE 2 & 4: belum login (atau baru logout) tapi di halaman aplikasi -> ke login
      router.replace("/login");
    } else if (session && inAuthGroup) {
      // RULE 3: sudah login tapi masih di halaman login -> ke Home
      router.replace("/");
    }
  }, [session, isLoading, segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: "KlikPrint", headerShown: false }}/>
        <Stack.Screen name="theme" options={{ title: "Pengaturan Tema" }}/>
        <Stack.Screen name="orders/[id]" options={{ title: "Detail Pesanan" }}/>
        <Stack.Screen name="orders/new" options={{ title: "Buat Pesanan", presentation: "modal" }}/>
        <Stack.Screen name="delivery" options={{ title: "Cek Area Pengantaran" }}/>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }}/>
      </Stack>

      {/* Layar loading selama sesi tersimpan dibaca, supaya tidak berkedip */}
      {isLoading ? (
        <View style={loadingStyles.overlay}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : null}
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <OrderProvider>
          <RootNavigator />
        </OrderProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const loadingStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f6f0f4",
    alignItems: "center",
    justifyContent: "center",
  },
});
