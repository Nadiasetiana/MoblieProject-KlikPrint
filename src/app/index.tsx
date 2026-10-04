import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../constants/styles";

// ---------- TYPE & INTERFACE (modul 5.5.B) ----------
type OrderStatus = "menunggu" | "dicetak" | "selesai";

interface Service {
  readonly id: string;
  name: string;
  description: string;
  price: number;
  badge?: string; // opsional
}

interface Order {
  readonly id: string;
  title: string;
  total: number;
  status: OrderStatus;
}

// ---------- ARRAY OF OBJECTS (modul 5.5.A) ----------
const services: Service[] = [
  { id: "1", name: "Cetak Dokumen", description: "PDF, Word, tugas kuliah", price: 500 },
  { id: "2", name: "Cetak Foto", description: "Berbagai ukuran foto", price: 3000, badge: "Populer" },
  { id: "3", name: "Cetak Poster", description: "A3, A2, A1 untuk acara", price: 15000 },
];

const orders: Order[] = [
  { id: "KP-0021", title: "Laporan Praktikum.pdf", total: 12500, status: "dicetak" },
  { id: "KP-0020", title: "Poster Acara KKN", total: 45000, status: "menunggu" },
  { id: "KP-0019", title: "Foto Wisuda (4R)", total: 18000, status: "selesai" },
];

// ---------- CONDITION (modul 5.2) ----------
const getStatusColor = (status: OrderStatus) => {
  if (status === "selesai") {
    return "#DCFCE7"; // hijau muda
  } else if (status === "dicetak") {
    return "#DBEAFE"; // biru muda
  } else {
    return "#FEF3C7"; // kuning muda
  }
};

// ---------- CUSTOM FUNCTION (modul 5.3.B) ----------
const renderServiceCard = (service: Service) => {
  // fungsi bawaan: Alert.alert (modul 5.3.A)
  const handlePress = () => {
    Alert.alert(service.name, "Harga Rp " + service.price + " per lembar");
  };

  return (
    <Pressable key={service.id} style={styles.card} onPress={handlePress}>
      <Ionicons name="print-outline" size={28} color="green" />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{service.name}</Text>
        {service.badge ? <Text style={styles.badge}>{service.badge}</Text> : null}
        <Text style={styles.cardSubtitle}>{service.description}</Text>
        <Text style={styles.cardPrice}>Rp {service.price} / lembar</Text>
      </View>
    </Pressable>
  );
};

const renderOrderCard = (order: Order) => {
  return (
    <View key={order.id} style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{order.title}</Text>
        <Text style={styles.cardSubtitle}>{order.id}</Text>
        <Text style={styles.cardPrice}>Rp {order.total}</Text>
      </View>
      {/* INLINE STYLE (modul 3.3): warna berubah sesuai status */}
      <Text style={{ backgroundColor: getStatusColor(order.status), padding: 6, borderRadius: 8 }}>
        {order.status}
      </Text>
    </View>
  );
};

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Klikprint</Text>
      <Text style={styles.subtitle}>Cetak dokumen, foto, dan poster tanpa antre.</Text>

      <Text style={styles.sectionTitle}>Layanan Cetak</Text>
      {/* LOOP: map() + key (modul 5.4.A) */}
      {services.map((service) => renderServiceCard(service))}

      <Text style={styles.sectionTitle}>Pesanan Terakhir</Text>
      {orders.map((order) => renderOrderCard(order))}
    </ScrollView>
  );
}