import { AppState, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

// =====================================================================
// SECURE TOKEN STORAGE
// Supabase menyimpan sesi login (access token JWT + refresh token)
// lewat adapter ini.
// - HP (Android/iOS): expo-secure-store -> terenkripsi di Keystore/Keychain
// - Web: localStorage (SecureStore tidak tersedia di browser)
// Token TIDAK disimpan di AsyncStorage karena AsyncStorage tidak terenkripsi.
// =====================================================================
const isWeb = Platform.OS === "web";
const hasWindow = typeof window !== "undefined";

const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    if (isWeb) return Promise.resolve(hasWindow ? window.localStorage.getItem(key) : null);
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (isWeb) {
      if (hasWindow) window.localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    if (isWeb) {
      if (hasWindow) window.localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// URL dan key diambil dari file .env (tidak ditulis langsung di kode)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env");
}

// Satu client Supabase untuk seluruh aplikasi (singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter, // sesi disimpan lewat adapter di atas
    autoRefreshToken: true, // token diperbarui otomatis sebelum kedaluwarsa
    persistSession: true, // sesi tetap ada walau aplikasi ditutup
    detectSessionInUrl: false, // tidak ada URL callback di aplikasi HP
  },
});

// Di HP: refresh token hanya saat aplikasi sedang dibuka (hemat baterai)
if (!isWeb) {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
