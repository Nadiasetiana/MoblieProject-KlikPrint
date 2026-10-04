import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Order, OrderStatus, Service, orders, services } from "../data/service";
import { colors, styles } from "../constants/styles";

// ---------- CUSTOM FUNCTION (modul 5.3.B) ----------
// Mengubah angka jadi format rupiah
const formatRupiah = (amount: number): string => {
  return "Rp " + amount.toLocaleString("id-ID");
};

// Menentukan warna badge status (pakai condition, modul 5.2)
const getStatusColor = (status: OrderStatus): string => {
  if (status === "selesai") {
    return "#DCFCE7"; // hijau muda
  } else if (status === "dicetak") {
    return "#DBEAFE"; // biru muda
  } else {
    return "#FEF3C7"; // kuning muda
  }
};

// Custom function yang mengembalikan komponen kartu layanan
const renderServiceCard = (service: Service) => {
  // FUNCTION BAWAAN (modul 5.3.A): Alert.alert
  const handlePress = () => {
    Alert.alert(service.name, `Harga mulai ${formatRupiah(service.price)} per lembar`);
  };

  return (
    <Pressable key={service.id} style={styles.card} onPress={handlePress}>
      <View style={styles.cardIcon}>
        <Ionicons name={service.icon} size={26} color={colors.teal} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{service.name}</Text>
          {service.badge ? <Text style={styles.badge}>{service.badge}</Text> : null}
        </View>
        <Text style={styles.cardSubtitle}>{service.description}</Text>
        <Text style={styles.cardPrice}>{formatRupiah(service.price)} / lembar</Text>
      </View>
    </Pressable>
  );
};

// Custom function untuk satu baris pesanan (dipakai oleh FlatList)
const renderOrderItem = (order: Order) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{order.title}</Text>
        <Text style={styles.cardSubtitle}>{order.id}</Text>
        <Text style={styles.orderTotal}>{formatRupiah(order.total)}</Text>
      </View>
      {/* INLINE STYLE (modul 3.3): warna bergantung pada nilai status (dinamis) */}
      <Text
        style={[
          styles.statusText,
          { backgroundColor: getStatusColor(order.status), color: colors.textDark },
        ]}
      >
        {order.status.toUpperCase()}
      </Text>
    </View>
  );
};

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Klikprint</Text>
        <Text style={styles.greeting}>Hai, mau ngeprint ya?</Text>
        <Text style={styles.greetingSub}>Cetak dokumen, foto, dan poster tanpa antre.</Text>
      </View>

      {/* LOOP 1: FlatList untuk daftar pesanan (modul 5.4.B), header memuat layanan */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderOrderItem(item)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Layanan Cetak</Text>
            {/* LOOP 2: map() untuk daftar layanan (modul 5.4.A), key = id */}
            {services.map((service) => renderServiceCard(service))}
            <Text style={styles.sectionTitle}>Pesanan Terakhir</Text>
          </View>
        }
        ListFooterComponent={
          <Pressable
            style={styles.button}
            onPress={() => Alert.alert("Klikprint", "Fitur pesan baru menyusul di modul berikutnya")}
          >
            <Text style={styles.buttonText}>Mulai Pesan</Text>
          </Pressable>
        }
      />
    </View>
  );
}