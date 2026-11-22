import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../constants/themecontext";

// Ubah pesan error Supabase (bahasa Inggris) menjadi bahasa Indonesia
const translateError = (message: string): string => {
  if (message.includes("Invalid login credentials")) return "Email atau password salah.";
  if (message.includes("User already registered")) return "Email sudah terdaftar. Silakan masuk.";
  if (message.includes("Email not confirmed")) return "Email belum dikonfirmasi. Cek kotak masuk email kamu.";
  if (message.includes("Network request failed") || message.includes("Failed to fetch")) {
    return "Tidak bisa terhubung ke server. Cek koneksi internet.";
  }
  return message;
};

export default function LoginPage() {
  const { darkMode } = useTheme();

  // ---------- STATE ----------
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // false = Masuk, true = Daftar
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // ---------- SUPABASE AUTH FLOW ----------
  const handleAuth = async () => {
    const cleanEmail = email.trim(); // hapus spasi tak terlihat
    const cleanName = fullName.trim();

    // Validasi sederhana sebelum mengirim ke server
    if (isRegistering && cleanName === "") {
      setIsError(true);
      setMessage("Nama wajib diisi.");
      return;
    }
    if (cleanEmail === "" || password.length < 6) {
      setIsError(true);
      setMessage("Isi email dan password (minimal 6 karakter).");
      return;
    }

    setLoading(true); // tampilkan loading + cegah tombol ditekan berkali-kali
    setMessage("");
    try {
      if (isRegistering) {
        // DAFTAR (Sign Up) + nama disimpan sebagai metadata
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: cleanName } },
        });
        if (error) throw error;

        if (!data.session) {
          // "Confirm email" di Supabase masih aktif -> harus konfirmasi dulu
          setIsError(false);
          setMessage("Pendaftaran berhasil! Cek email untuk konfirmasi, lalu masuk.");
          setIsRegistering(false);
        }
        // Kalau session langsung ada, route guard otomatis membuka Home
      } else {
        // MASUK (Sign In)
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
        // Berhasil -> onAuthStateChange di AuthContext -> route guard membuka Home
      }
    } catch (err) {
      setIsError(true);
      setMessage(translateError(err instanceof Error ? err.message : "Terjadi kesalahan."));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegistering((prev) => !prev);
    setMessage("");
  };

  const backgroundColor = darkMode ? "#101827" : "#f6f0f4";
  const textColor = darkMode ? "#FFFFFF" : "#111111";
  const subtitleColor = darkMode ? "#CBD5E1" : "#666666";
  const cardColor = darkMode ? "#1E293B" : "#FFFFFF";
  const inputStyle = [styles.input, { color: textColor, borderColor: darkMode ? "#334155" : "#CBD5E1" }];

  return (
    <ScrollView style={{ backgroundColor }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Ionicons name="print" size={48} color="green" style={{ alignSelf: "center" }} />
      <Text style={[styles.title, { color: textColor }]}>KlikPrint</Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}>
        {isRegistering ? "Buat akun untuk mulai mencetak" : "Masuk untuk melanjutkan"}
      </Text>

      <View style={[styles.card, { backgroundColor: cardColor }]}>
        {isRegistering ? (
          <>
            <Text style={[styles.label, { color: textColor }]}>Nama</Text>
            <TextInput
              style={inputStyle}
              placeholder="Nama lengkap"
              placeholderTextColor={subtitleColor}
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </>
        ) : null}

        <Text style={[styles.label, { color: textColor }]}>Email</Text>
        <TextInput
          style={inputStyle}
          placeholder="nama@email.com"
          placeholderTextColor={subtitleColor}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <Text style={[styles.label, { color: textColor }]}>Password</Text>
        <TextInput
          style={inputStyle}
          placeholder="Minimal 6 karakter"
          placeholderTextColor={subtitleColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />

        <Pressable style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleAuth} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{isRegistering ? "Daftar" : "Masuk"}</Text>
          )}
        </Pressable>

        {message ? (
          <Text style={[styles.message, { color: isError ? "#DC2626" : "green" }]}>{message}</Text>
        ) : null}

        <Pressable onPress={switchMode} disabled={loading} style={styles.switch}>
          <Text style={{ color: subtitleColor }}>
            {isRegistering ? "Sudah punya akun? " : "Belum punya akun? "}
            <Text style={styles.link}>{isRegistering ? "Masuk di sini" : "Daftar di sini"}</Text>
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    padding: 20,
    borderRadius: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  message: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
  },
  switch: {
    marginTop: 16,
    alignItems: "center",
  },
  link: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
