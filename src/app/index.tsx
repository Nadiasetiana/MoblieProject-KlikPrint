import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import {useRouter} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../constants/styles";
import { useTheme } from "../constants/themecontext";

//TYPE & INTERFACE
type OrderStatus = "menunggu" | "dicetak" | "selesai";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
}

interface Order {
  id: string;
  title: string;
  total: number;
  status: OrderStatus;
}

//ARRAY OF OBJECTS
const services: Service[] = [
  { id: "1", name: "Cetak Dokumen", description: "PDF, Word, tugas kuliah", price: 500, badge: "Populer"},
  { id: "2", name: "Cetak Foto", description: "Berbagai ukuran foto", price: 500},
  { id: "3", name: "Cetak Poster", description: "A3, A2, A1 untuk acara", price: 15000 },
];

const orders: Order[] = [
  { id: "KP-0021", title: "Laporan Praktikum.pdf", total: 12500, status: "dicetak" },
  { id: "KP-0020", title: "Poster Acara KKN", total: 45000, status: "menunggu" },
  { id: "KP-0019", title: "Foto Wisuda (4R)", total: 18000, status: "selesai" },
];

//CONDITION
const getStatusColor = (status: OrderStatus) => {
  if (status === "selesai") return "#84ffaf"; 
  else if (status === "dicetak") return "#95bbee"; 
  else return "#faf3d9";
};

export default function Index() {
  const router = useRouter();
  const { darkMode } = useTheme();

  const backgroundColor = darkMode ? "#101827" : "#f6f0f4";
  const textColor = darkMode ? "#FFFFFF" : "#000000";
  const subtitleColor = darkMode ? "#CBD5E1" : "gray";
  const cardColor = darkMode ? "#1E293B" : "#FFFFFF";

  const formatRupiah = (amount: number) =>
    "Rp " + amount.toLocaleString("id-ID");

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text style={[styles.title, { color: textColor }]}> KlikPrint </Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}> Cetak dokumen, foto, dan poster tanpa antre. </Text>

      <Pressable style={styles.themeButton} onPress={() => router.push("/theme")} >
        <Ionicons name={darkMode ? "moon" : "sunny"} size={18} color="#FFFFFF" />
        <Text style={styles.themeButtonText}> {darkMode ? "Dark Mode" : "Light Mode"} · Pengaturan Tema </Text>
      </Pressable>

      <Text style={[styles.sectionTitle, { color: textColor }]}> Layanan Cetak </Text>

      {services.map((service) => (
        <Pressable
          key={service.id} style={[styles.card, { backgroundColor: cardColor }]} 
          onPress={() => Alert.alert( service.name,`Harga ${formatRupiah(service.price)} per lembar`)}
        >
          <Ionicons name="print" size={28} color="green" />

          <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, { color: textColor }]}> {service.name}</Text>
           {service.badge ? (<Text style={styles.badge}>{service.badge}</Text>) : null}
            <Text style={[ styles.cardSubtitle, { color: subtitleColor }, ]} > service.description} </Text>

            <Text style={styles.cardPrice}> {formatRupiah(service.price)} / lembar </Text>
          </View>
        </Pressable>
      ))}

      <Text style={[styles.sectionTitle, { color: textColor }]}> Pesanan Terakhir </Text>

      {orders.map((order) => (
        <Pressable key={order.id} style={[styles.card, { backgroundColor: cardColor }]}
          onPress={() => router.push({ pathname: "/orders/[id]", params: { id: order.id }, }) }
        >
          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: textColor }]}> {order.title}</Text>
            <Text style={[ styles.cardSubtitle, { color: subtitleColor },]}> {order.id} </Text>
            <Text style={styles.cardPrice}> {formatRupiah(order.total)}</Text>
          </View>

          <Text style={[ styles.status, { backgroundColor: getStatusColor(order.status) }, ]}> {order.status} </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}