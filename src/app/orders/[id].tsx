import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../constants/themecontext";

type OrderStatus = "menunggu" | "dicetak" | "selesai";

interface Order {
  id: string;
  title: string;
  total: number;
  status: OrderStatus;
}

const orders: Order[] = [
  { id: "KP-0021", title: "Laporan Praktikum.pdf", total: 12500, status: "dicetak", },
  { id: "KP-0020", title: "Poster Acara KKN", total: 45000, status: "menunggu", },
  { id: "KP-0019", title: "Foto Wisuda (4R)", total: 18000, status: "selesai", },
];

export default function OrderDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { darkMode } = useTheme();

  const order = orders.find((item) => item.id === id);

  const backgroundColor = darkMode ? "#101827" : "#f6f0f4";
  const textColor = darkMode ? "#FFFFFF" : "#111111";
  const cardColor = darkMode ? "#1E293B" : "#FFFFFF";

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}> Pesanan tidak ditemukan </Text>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Text style={[styles.title, { color: textColor }]}> {order.title}8 </Text>
        <Text style={styles.subtitle}>ID Pesanan: {order.id}</Text>
        <Text style={[styles.total, { color: darkMode ? "#86EFAC" : "green" }]}>
          Rp {order.total.toLocaleString("id-ID")}
        </Text>
        <Text style={[styles.subtitle, { marginTop: 12 }]}> Status: {order.status} </Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.back()} >
        <Text style={styles.buttonText}>Kembali ke Pesanan</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.replace("/")} >
        <Text style={styles.link}>Kembali ke Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    color: "#808080",
    fontSize: 15,
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
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
  },
  secondaryButton: {
    padding: 14,
    alignItems: "center",
  },
  link: {
    color: "#2563EB",
    fontWeight: "600",
  },
});