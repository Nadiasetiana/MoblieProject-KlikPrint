import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../constants/themecontext";

export default function ThemePage() {
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <View style={[ styles.container, { backgroundColor: darkMode ? "#101827" : "#ffffff" }, ]}>
      <Text style={[ styles.title, { color: darkMode ? "#FFFFFF" : "#111111" }, ]} > Pengaturan Tema </Text>
      <Text style={[ styles.description, { color: darkMode ? "#CBD5E1" : "#666666" }, ]}>
        Pilih tampilan yang nyaman untuk aplikasi KlikPrint.
      </Text>

      <View style={[ styles.card, { backgroundColor: darkMode ? "#1E293B" : "#FFFFFF" }, ]}>
        <Text style={styles.icon}>{darkMode ? "🌙" : "☀️"}</Text>
        <Text style={[ styles.themeName, { color: darkMode ? "#FFFFFF" : "#111111" }, ]} > {darkMode ? "Dark Mode" : "Light Mode"} </Text>

        <Pressable style={styles.button} onPress={toggleTheme}>
          <Text style={styles.buttonText}> {darkMode ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"} </Text>
        </Pressable>
      </View>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()} >
        <Text style={styles.secondaryText}>Kembali ke halaman sebelumnya</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.replace("/")}>
        <Text style={styles.secondaryText}>Kembali ke Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    alignItems: "center",
    padding: 24,
    borderRadius: 18,
    marginBottom: 20,
  },
  icon: {
    fontSize: 100,
    marginBottom: 5,
  },
  themeName: {
    fontSize:50,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  secondaryButton: {
    padding: 12,
    alignItems: "center",
  },
  secondaryText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});