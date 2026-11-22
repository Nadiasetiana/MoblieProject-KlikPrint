import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, type ScrollViewInstance } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants/themecontext";
import { formatRupiah } from "../data/service";
import { getProvinces, getCities, checkDelivery, type Province, type City, type DeliveryInfo } from "../services/api";

// FITUR BARU: Cek Area Pengantaran (data provinsi & kota dari External API)
export default function DeliveryPage() {
  const router = useRouter();
  const { darkMode } = useTheme();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingCity, setCheckingCity] = useState<string | null>(null);
  const [result, setResult] = useState<DeliveryInfo | null>(null);
  const [resultError, setResultError] = useState("");
  const scrollRef = useRef<ScrollViewInstance>(null);

  // CUSTOM ASYNC FUNCTION: ambil daftar provinsi (async/await + try/catch)
  const loadProvinces = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProvinces();
      setProvinces(data);
    } catch {
      setError("Gagal memuat provinsi. Periksa koneksi internet kamu.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect: ambil provinsi sekali saat halaman pertama dibuka
  useEffect(() => {
    loadProvinces();
  }, []);

  // CUSTOM ASYNC FUNCTION: ambil kota sesuai provinsi yang dipilih
  const handleSelectProvince = async (province: Province) => {
    setSelectedProvince(province);
    setCities([]);
    setResult(null);
    setResultError("");
    setLoading(true);
    setError("");
    try {
      const data = await getCities(province.id);
      setCities(data);
    } catch {
      setError("Gagal memuat kota. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Cek pengantaran: Promise dipakai dengan .then() / .catch() / .finally()
  const handleSelectCity = (city: City) => {
    setCheckingCity(city.id);
    setResult(null);
    setResultError("");
    checkDelivery(city)
      .then((info) => setResult(info))           // dari resolve()
      .catch((err: Error) => setResultError(err.message)) // dari reject()
      .finally(() => {
        setCheckingCity(null);
        scrollRef.current?.scrollTo({ y: 0, animated: true }); // naik ke atas agar hasil terlihat
      });
  };

  const backToProvinces = () => {
    setSelectedProvince(null);
    setCities([]);
    setResult(null);
    setResultError("");
    setError("");
  };

  const backgroundColor = darkMode ? "#101827" : "#f6f0f4";
  const textColor = darkMode ? "#FFFFFF" : "#111111";
  const subtitleColor = darkMode ? "#CBD5E1" : "#666666";
  const cardColor = darkMode ? "#1E293B" : "#FFFFFF";

  const list: (Province | City)[] = selectedProvince ? cities : provinces;

  return (
    <ScrollView ref={scrollRef} style={[styles.container, { backgroundColor }]} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={[styles.description, { color: subtitleColor }]}>
        Pilih provinsi lalu kota tujuan untuk melihat apakah pesananmu bisa diantar dan berapa ongkirnya.
      </Text>

      {/* Hasil cek pengantaran */}
      {result ? (
        <View style={[styles.resultCard, { backgroundColor: darkMode ? "#14532D" : "#DCFCE7" }]}>
          <Ionicons name="checkmark-circle" size={24} color="green" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.resultTitle, { color: textColor }]}>Bisa diantar ke {result.city}</Text>
            <Text style={{ color: textColor }}>Ongkir {formatRupiah(result.cost)} · Estimasi {result.estimate}</Text>
          </View>
        </View>
      ) : null}
      {resultError ? (
        <View style={[styles.resultCard, { backgroundColor: darkMode ? "#7F1D1D" : "#FEE2E2" }]}>
          <Ionicons name="close-circle" size={24} color="#DC2626" />
          <Text style={{ flex: 1, marginLeft: 10, color: textColor }}>{resultError}</Text>
        </View>
      ) : null}

      {selectedProvince ? (
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Kota di {selectedProvince.name}</Text>
          <Pressable onPress={backToProvinces}>
            <Text style={styles.link}>Ganti provinsi</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={[styles.sectionTitle, { color: textColor }]}>Pilih Provinsi</Text>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{ color: subtitleColor, marginTop: 8 }}>Mengambil data dari server...</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.button}
            onPress={() => (selectedProvince ? handleSelectProvince(selectedProvince) : loadProvinces())}
          >
            <Text style={styles.buttonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error
        ? list.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.item, { backgroundColor: cardColor }]}
              onPress={() =>
                selectedProvince ? handleSelectCity(item as City) : handleSelectProvince(item as Province)
              }
            >
              <Ionicons name={selectedProvince ? "business-outline" : "map-outline"} size={20} color="green" />
              <Text style={[styles.itemText, { color: textColor }]}>{item.name}</Text>
              {checkingCity === item.id ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={subtitleColor} />
              )}
            </Pressable>
          ))
        : null}

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.link}>Kembali</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  center: {
    alignItems: "center",
    paddingVertical: 24,
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
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
