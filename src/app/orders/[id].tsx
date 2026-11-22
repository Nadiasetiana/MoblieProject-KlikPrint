import { View, Text, Pressable, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../constants/themecontext";
import { useOrders } from "../../constants/ordercontext";
import { formatRupiah, getStatusColor } from "../../data/service";

export default function OrderDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { darkMode } = useTheme();
  const { orders } = useOrders(); // ambil dari state, jadi pesanan baru juga bisa dibuka
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
      {/* Stack.Screen di dalam halaman: judul header ikut id pesanan */}
      <Stack.Screen options={{ title: `Pesanan ${order.id}` }} />
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Text style={[styles.title, { color: textColor }]}> {order.title} </Text>
        <Text style={styles.subtitle}>ID Pesanan: {order.id}</Text>
        {order.serviceName ? (
          <Text style={styles.subtitle}>Layanan: {order.serviceName} · {order.sheets} lembar</Text>
        ) : null}
        {order.discount ? (
          <Text style={[styles.subtitle, { color: "#DC2626" }]}>
            Promo {order.voucherCode}: -{formatRupiah(order.discount)}
          </Text>
        ) : null}
        <Text style={[styles.total, { color: darkMode ? "#86EFAC" : "green" }]}>
          {formatRupiah(order.total)}
        </Text>
        <Text style={[styles.status, { backgroundColor: getStatusColor(order.status) }]}> Status: {order.status} </Text>
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
  status: {
    alignSelf: "flex-start",
    marginTop: 12,
    padding: 6,
    borderRadius: 8,
    overflow: "hidden",
    color: "#111111",
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
