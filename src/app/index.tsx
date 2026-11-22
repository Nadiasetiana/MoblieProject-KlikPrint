import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../constants/styles";
import { useTheme } from "../constants/themecontext";
import { useOrders } from "../constants/ordercontext";
import { useAuth } from "../constants/authcontext";
// TYPE, INTERFACE, ARRAY OF OBJECTS, CONDITION ada di src/data/service.ts
import { services, formatRupiah, getStatusColor } from "../data/service";
import { getNextHoliday, type Holiday } from "../services/api";

export default function Index() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const { orders } = useOrders(); // daftar pesanan dari state (bisa bertambah)
  const { user, signOut } = useAuth(); // data pengguna yang sedang login
  const [signingOut, setSigningOut] = useState(false);

  // Nama dari metadata saat daftar; kalau tidak ada, pakai email
  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "Pelanggan";

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut(); // route guard otomatis mengarahkan ke halaman login
    setSigningOut(false);
  };

  // FITUR BARU: Libur Nasional Terdekat dari External API (Nager.Date)
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [holidayLoading, setHolidayLoading] = useState(true);
  const [holidayError, setHolidayError] = useState("");

  const loadHoliday = (forceRefresh = false) => {
    setHolidayLoading(true);
    setHolidayError("");
    getNextHoliday(forceRefresh)
      .then((result) => setHoliday(result))
      .catch((err: Error) => setHolidayError(err.message))
      .finally(() => setHolidayLoading(false));
  };

  // useEffect: ambil jadwal libur sekali saat Home dibuka
  useEffect(() => {
    loadHoliday();
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

      {/* MODUL 4: pengguna yang sedang login + tombol keluar */}
      <View style={[styles.userCard, { backgroundColor: cardColor }]}>
        <Ionicons name="person-circle" size={36} color="#2563EB" />
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Halo, {displayName}</Text>
          <Text style={[styles.cardSubtitle, { color: subtitleColor }]}>{user?.email}</Text>
        </View>
        <Pressable style={styles.signOutButton} onPress={handleSignOut} disabled={signingOut}>
          {signingOut ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <Text style={styles.signOutText}>Keluar</Text>
          )}
        </Pressable>
      </View>
      <Pressable style={styles.themeButton} onPress={() => router.push("/theme")} >
        <Ionicons name={darkMode ? "moon" : "sunny"} size={18} color="#FFFFFF" />
        <Text style={styles.themeButtonText}> {darkMode ? "Dark Mode" : "Light Mode"} · Pengaturan Tema </Text>
      </Pressable>

      {/* FITUR BARU: kartu Libur Nasional Terdekat */}
      <View style={[styles.holidayCard, { backgroundColor: cardColor }]}>
        <View style={styles.holidayHeader}>
          <Text style={[styles.holidayLabel, { color: textColor }]}>📅 Libur Nasional Terdekat</Text>
          <Pressable onPress={() => loadHoliday(true)} disabled={holidayLoading}>
            <Ionicons name="refresh" size={18} color="#2563EB" />
          </Pressable>
        </View>
        {holidayLoading ? (
          <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 8 }} />
        ) : holidayError ? (
          <Text style={styles.holidayErrorText}>{holidayError}</Text>
        ) : holiday ? (
          <>
            <Text style={[styles.holidayText, { color: textColor }]}>{holiday.name}</Text>
            <Text style={[styles.holidayDate, { color: subtitleColor }]}>
              {holiday.date} · {holiday.daysLeft === 0 ? "hari ini" : `${holiday.daysLeft} hari lagi`}
            </Text>
            <Text style={[styles.holidayDate, { color: subtitleColor }]}>Toko KlikPrint tutup pada hari libur nasional.</Text>
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
