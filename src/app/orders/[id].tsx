import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { orders } from "../../data/orders";
import { useTheme } from "../../context/themecontext";

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { darkMode } = useTheme();
  const order = orders.find((item) => item.id === id);
  const textColor = darkMode ? "#FFFFFF" : "#000000";
  const backgroundColor = darkMode ? "#101827" : "#f6f3f5";
  const cardColor = darkMode ? "#1E293B" : "#FFFFFF";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Pressable onPress={() => router.back()} accessibilityRole="button">
        <Text style={styles.back}>Kembali</Text>
      </Pressable>
      {order ? (
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.heading, { color: textColor }]}>Detail Pesanan</Text>
          <Text style={[styles.label, { color: textColor }]}>ID Pesanan: {order.id}</Text>
          <Text style={[styles.label, { color: textColor }]}>{order.title}</Text>
          <Text style={styles.total}>Rp {order.total.toLocaleString("id-ID")}</Text>
          <Text style={[styles.label, { color: textColor }]}>Status: {order.status}</Text>
        </View>
      ) : (
        <Text style={[styles.heading, { color: textColor }]}>Pesanan tidak ditemukan</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 48,
  },
  back: {
    color: "#0F8B6D",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  total: {
    color: "#0F8B6D",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
