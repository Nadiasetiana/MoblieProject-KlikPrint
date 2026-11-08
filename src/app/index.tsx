import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../constants/styles";
import { useTheme } from "../constants/themecontext";
import { useOrders } from "../constants/ordercontext";
// TYPE, INTERFACE, ARRAY OF OBJECTS, CONDITION ada di src/data/service.ts
import { services, formatRupiah, getStatusColor } from "../data/service";
import { getQuote, type Quote } from "../services/api";

export default function Index() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const { orders } = useOrders(); // daftar pesanan dari state (bisa bertambah)

  // FITUR BARU: Kata Semangat dari External API
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState("");

  const loadQuote = (forceRefresh = false) => {
    setQuoteLoading(true);
    setQuoteError("");
    getQuote(forceRefresh)
      .then((result) => setQuote(result))
      .catch(() => setQuoteError("Gagal memuat kata semangat. Cek koneksi internet."))
      .finally(() => setQuoteLoading(false));
  };

  // useEffect: ambil kutipan sekali saat Home dibuka
  useEffect(() => {
    loadQuote();
  }, []);

  const backgroundColor = darkMode ? "#101827" : "#f6f0f4";
  const textColor = darkMode ? "#FFFFFF" : "#000000";
  const subtitleColor = darkMode ? "#CBD5E1" : "gray";
  const cardColor = darkMode ? "#1E293B" : "#FFFFFF";

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

      {/* FITUR BARU: kartu Kata Semangat */}
      <View style={[styles.quoteCard, { backgroundColor: cardColor }]}>
        <View style={styles.quoteHeader}>
          <Text style={[styles.quoteLabel, { color: textColor }]}>💡 Kata Semangat Hari Ini</Text>
          <Pressable onPress={() => loadQuote(true)} disabled={quoteLoading}>
            <Ionicons name="refresh" size={18} color="#2563EB" />
          </Pressable>
        </View>
        {quoteLoading ? (
          <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 8 }} />
        ) : quoteError ? (
          <Text style={styles.quoteError}>{quoteError}</Text>
        ) : quote ? (
          <>
            <Text style={[styles.quoteText, { color: textColor }]}>“{quote.text}”</Text>
            <Text style={[styles.quoteAuthor, { color: subtitleColor }]}>— {quote.author}</Text>
          </>
        ) : null}
      </View>

      {/* FITUR BARU: buka halaman Cek Area Pengantaran */}
      <Pressable style={styles.deliveryButton} onPress={() => router.push("/delivery")}>
        <Ionicons name="bicycle" size={20} color="#FFFFFF" />
        <Text style={styles.themeButtonText}>Cek Area Pengantaran</Text>
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
            <Text style={[ styles.cardSubtitle, { color: subtitleColor }, ]} > {service.description} </Text>
            <Text style={styles.cardPrice}> {formatRupiah(service.price)} / lembar </Text>
          </View>
        </Pressable>
      ))}

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: textColor }]}> Pesanan Terakhir </Text>
        <Text style={[styles.cardSubtitle, { color: subtitleColor, marginBottom: 10 }]}>{orders.length} pesanan</Text>
      </View>

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

      {/* FITUR BARU: buka form Buat Pesanan dengan router.push() */}
      <Pressable style={styles.newOrderButton} onPress={() => router.push("/orders/new")}>
        <Ionicons name="add-circle" size={20} color="#FFFFFF" />
        <Text style={styles.newOrderButtonText}>Buat Pesanan Baru</Text>
      </Pressable>
    </ScrollView>
  );
}
