import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, Image, ActivityIndicator, } from "react-native";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../constants/styles";
import * as themecontext from "../context/themecontext";

import { orders, type OrderStatus } from "../data/orders";
import { services } from "../data/services";

import type { Product } from "../types/product";
import { getProducts } from "../services/api";

// Fungsi menentukan warna status pesanan
const getStatusColor = (status: OrderStatus) => {
  if (status === "selesai") return "#84ffaf";
  else if (status === "dicetak") return "#95bbee";
  else return "#faf3d9";
};

export default function Index() {
  const router = useRouter();
  const { darkMode, toggleTheme } = themecontext.useTheme();

  // State untuk menyimpan produk API
  const [products, setProducts] = useState<Product[]>([]);

  // State loading
  const [loading, setLoading] = useState(true);

  // State error
  const [error, setError] = useState("");

  // Custom asynchronous function
  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const result = await getProducts();

      setProducts(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  // Mengambil produk saat halaman pertama dibuka
  useEffect(() => {
    loadProducts();
  }, []);

  // Pengaturan warna berdasarkan tema
  const backgroundColor = darkMode ? "#101827" : "#f6f3f5";
  const textColor = darkMode ? "#FFFFFF" : "#000000";
  const subtitleColor = darkMode ? "#0c3f7e" : "grey";
  const cardColor = darkMode ? "#1E293B" : "#FFFFFF";

  // Format harga ke Rupiah
  const formatRupiah = (amount: number) =>
    "Rp " + amount.toLocaleString("id-ID");

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Judul aplikasi */}
      <Text style={[styles.title, { color: textColor }]}>
        KlikPrint
      </Text>

      <Text style={[styles.subtitle, { color: subtitleColor }]}>
        Cetak dokumen, foto, dan poster tanpa antre.
      </Text>

      {/* Tombol Dark Mode */}
      <Pressable
        style={styles.themeButton}
        onPress={toggleTheme}
      >
        <Ionicons
          name={darkMode ? "moon" : "sunny"}
          size={18}
          color="#FFFFFF"
        />

        <Text style={styles.themeButtonText}>
          {darkMode ? "Dark Mode" : "Light Mode"} · Pengaturan Tema
        </Text>
      </Pressable>

      {/* Layanan Cetak */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Layanan Cetak
      </Text>

      {services.map((service) => (
        <Pressable
          key={service.id}
          style={[
            styles.card,
            { backgroundColor: cardColor },
          ]}
          onPress={() =>
            Alert.alert(
              service.name,
              `Harga ${formatRupiah(service.price)} per lembar`
            )
          }
        >
          <Ionicons
            name={service.icon}
            size={28}
            color="green"
          />

          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              {service.name}
            </Text>

            {service.badge ? (
              <Text style={styles.badge}>
                {service.badge}
              </Text>
            ) : null}

            <Text
              style={[
                styles.cardSubtitle,
                { color: subtitleColor },
              ]}
            >
              {service.description}
            </Text>

            <Text style={styles.cardPrice}>
              {formatRupiah(service.price)} / lembar
            </Text>
          </View>
        </Pressable>
      ))}

      {/* Rekomendasi Produk dari API */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Rekomendasi Produk
      </Text>

      {/* Kondisi loading */}
      {loading && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="green" />

          <Text style={{ color: textColor }}>
            Memuat produk...
          </Text>
        </View>
      )}

      {/* Kondisi error */}
      {!!error && (
        <View style={{ padding: 15 }}>
          <Text style={{ color: "red" }}>
            {error}
          </Text>

          <Pressable onPress={loadProducts}>
            <Text style={{ color: "green", marginTop: 8 }}>
              Coba Lagi
            </Text>
          </Pressable>
        </View>
      )}

      {/* Menampilkan produk dari API */}
      {!loading &&
        !error &&
        products.map((product) => (
          <View
            key={product.id}
            style={[
              styles.card,
              {
                backgroundColor: cardColor,
                alignItems: "center",
              },
            ]}
          >
            <Image
              source={{ uri: product.thumbnail }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
              }}
            />

            <View style={styles.cardBody}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: textColor },
                ]}
              >
                {product.title}
              </Text>

              <Text
                style={[
                  styles.cardSubtitle,
                  { color: subtitleColor },
                ]}
                numberOfLines={2}
              >
                {product.description}
              </Text>

              <Text style={styles.cardPrice}>
                {formatRupiah(product.price)}
              </Text>
            </View>
          </View>
        ))}

      {/* Pesanan Terakhir */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Pesanan Terakhir
      </Text>

      {orders.map((order) => (
        <Pressable
          key={order.id}
          style={[
            styles.card,
            { backgroundColor: cardColor },
          ]}
          onPress={() =>
            router.push({
              pathname: "/orders/[id]",
              params: { id: order.id },
            })
          }
        >
          <View style={styles.cardBody}>
            <Text
              style={[
                styles.cardTitle,
                { color: textColor },
              ]}
            >
              {order.title}
            </Text>

            <Text
              style={[
                styles.cardSubtitle,
                { color: subtitleColor },
              ]}
            >
              {order.id}
            </Text>

            <Text style={styles.cardPrice}>
              {formatRupiah(order.total)}
            </Text>
          </View>

          <Text
            style={[
              styles.status,
              {
                backgroundColor: getStatusColor(order.status),
              },
            ]}
          >
            {order.status}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}