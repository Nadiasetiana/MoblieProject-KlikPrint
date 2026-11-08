import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/themecontext";
import { useOrders } from "../../constants/ordercontext";
import { services, formatRupiah } from "../../data/service";
import { validateVoucher, type Voucher } from "../../services/api";

// FITUR BARU: form Buat Pesanan
export default function NewOrderPage() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const { addOrder } = useOrders();

  // ---------- useState ----------
  const [title, setTitle] = useState("");                    // nama file / judul pesanan
  const [serviceId, setServiceId] = useState(services[0].id); // layanan yang dipilih
  const [sheets, setSheets] = useState(1);                    // jumlah lembar
  const [total, setTotal] = useState(0);                      // total harga
  const [error, setError] = useState("");                     // pesan validasi
  // State untuk fitur Kode Promo
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [checkingVoucher, setCheckingVoucher] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId) ?? services[0];
  const subtotal = selectedService.price * sheets;
  const discount = voucher ? Math.round((subtotal * voucher.percent) / 100) : 0;

  // ---------- useEffect ----------
  // Total dihitung ulang setiap kali layanan, jumlah lembar, atau promo berubah
  useEffect(() => {
    const service = services.find((s) => s.id === serviceId) ?? services[0];
    const price = service.price * sheets;
    const cut = voucher ? Math.round((price * voucher.percent) / 100) : 0;
    setTotal(price - cut);
  }, [serviceId, sheets, voucher]);

  // FITUR BARU: cek kode promo -> Promise dengan .then() / .catch() / .finally()
  const handleApplyVoucher = () => {
    if (voucherCode.trim() === "") {
      setVoucherMessage("Masukkan kode promo dulu.");
      return;
    }
    setCheckingVoucher(true);
    setVoucherMessage("");
    validateVoucher(voucherCode)
      .then((result) => {
        // resolve(): kode benar
        setVoucher(result);
        setVoucherMessage(`Berhasil! ${result.label} dipakai.`);
      })
      .catch((err: Error) => {
        // reject(): kode salah
        setVoucher(null);
        setVoucherMessage(err.message);
      })
      .finally(() => setCheckingVoucher(false));
  };

  const removeVoucher = () => {
    setVoucher(null);
    setVoucherCode("");
    setVoucherMessage("");
  };

  // Pesan error hilang otomatis begitu user mulai mengetik judul
  useEffect(() => {
    if (title.trim() !== "") setError("");
  }, [title]);

  const decreaseSheets = () => setSheets((prev) => (prev > 1 ? prev - 1 : 1));
  const increaseSheets = () => setSheets((prev) => (prev < 100 ? prev + 1 : 100));

  // Simpan pesanan; total dihitung langsung dari promo yang dipakai
  const saveOrder = (usedVoucher: Voucher | null) => {
    const cut = usedVoucher ? Math.round((subtotal * usedVoucher.percent) / 100) : 0;
    const newId = addOrder({
      title: title.trim(),
      total: subtotal - cut,
      serviceName: selectedService.name,
      sheets,
      discount: cut,
      voucherCode: usedVoucher?.code,
    });
    // router.replace(): form diganti halaman detail, jadi tombol back tidak kembali ke form
    router.replace({ pathname: "/orders/[id]", params: { id: newId } });
  };

  const handleSubmit = () => {
    if (title.trim() === "") {
      setError("Nama file / judul pesanan wajib diisi.");
      return;
    }
    // Kode promo sudah diketik tapi belum ditekan "Pakai" -> dicek otomatis dulu
    if (voucherCode.trim() !== "" && !voucher) {
      setCheckingVoucher(true);
      validateVoucher(voucherCode)
        .then((result) => saveOrder(result)) // resolve(): kode benar -> simpan dengan diskon
        .catch((err: Error) => {
          // reject(): kode salah -> pesanan TIDAK dikirim
          setVoucherMessage(`${err.message}. Perbaiki atau kosongkan kode promo.`);
        })
        .finally(() => setCheckingVoucher(false));
      return;
    }
    saveOrder(voucher);
  };

  const backgroundColor = darkMode ? "#101827" : "#f6f0f4";
  const textColor = darkMode ? "#FFFFFF" : "#111111";
  const subtitleColor = darkMode ? "#CBD5E1" : "#666666";
  const cardColor = darkMode ? "#1E293B" : "#FFFFFF";

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={[styles.label, { color: textColor }]}>Nama file / judul</Text>
      <TextInput
        style={[styles.input, { backgroundColor: cardColor, color: textColor, borderColor: error ? "#DC2626" : "#CBD5E1" }]}
        placeholder="Contoh: Makalah Basis Data.pdf"
        placeholderTextColor={subtitleColor}
        value={title}
        onChangeText={setTitle}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={[styles.label, { color: textColor }]}>Pilih layanan</Text>
      {services.map((service) => {
        const active = service.id === serviceId;
        return (
          <Pressable
            key={service.id}
            style={[styles.option, { backgroundColor: cardColor, borderColor: active ? "green" : "transparent" }]}
            onPress={() => setServiceId(service.id)}
          >
            <Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={20} color="green" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.optionTitle, { color: textColor }]}>{service.name}</Text>
              <Text style={{ color: subtitleColor, fontSize: 13 }}>{formatRupiah(service.price)} / lembar</Text>
            </View>
          </Pressable>
        );
      })}

      <Text style={[styles.label, { color: textColor }]}>Jumlah lembar</Text>
      <View style={styles.stepper}>
        <Pressable style={styles.stepButton} onPress={decreaseSheets}>
          <Ionicons name="remove" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={[styles.sheetsText, { color: textColor }]}>{sheets}</Text>
        <Pressable style={styles.stepButton} onPress={increaseSheets}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <Text style={[styles.label, { color: textColor }]}>Kode promo (opsional)</Text>
      <View style={styles.voucherRow}>
        <TextInput
          style={[styles.input, { flex: 1, minWidth: 0, backgroundColor: cardColor, color: textColor, borderColor: voucher ? "green" : "#CBD5E1" }]}
          placeholder="Contoh: HEMAT10"
          placeholderTextColor={subtitleColor}
          autoCapitalize="characters"
          value={voucherCode}
          editable={!voucher}
          onChangeText={setVoucherCode}
        />
        <Pressable
          style={[styles.voucherButton, { backgroundColor: voucher ? "#DC2626" : "#2563EB" }]}
          onPress={voucher ? removeVoucher : handleApplyVoucher}
          disabled={checkingVoucher}
        >
          {checkingVoucher ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{voucher ? "Hapus" : "Pakai"}</Text>
          )}
        </Pressable>
      </View>
      {voucherMessage ? (
        <Text style={{ color: voucher ? "green" : "#DC2626", fontSize: 13, marginTop: 6 }}>{voucherMessage}</Text>
      ) : null}

      <View style={[styles.summary, { backgroundColor: cardColor }]}>
        <Text style={{ color: subtitleColor }}>
          {selectedService.name} × {sheets} lembar = {formatRupiah(subtotal)}
        </Text>
        {voucher ? (
          <Text style={{ color: "#DC2626", marginTop: 2 }}>
            {voucher.label}: -{formatRupiah(discount)}
          </Text>
        ) : null}
        <Text style={[styles.totalText, { color: darkMode ? "#86EFAC" : "green" }]}>{formatRupiah(total)}</Text>
      </View>

      <Pressable style={[styles.button, checkingVoucher && { opacity: 0.6 }]} onPress={handleSubmit} disabled={checkingVoucher}>
        <Text style={styles.buttonText}>{checkingVoucher ? "Mengecek kode promo..." : "Kirim Pesanan"}</Text>
      </Pressable>
      {/* router.back(): batal, kembali ke halaman sebelumnya */}
      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.link}>Batal</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 6,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  voucherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  voucherButton: {
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 76,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  stepButton: {
    backgroundColor: "#2563EB",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetsText: {
    fontSize: 22,
    fontWeight: "bold",
    minWidth: 40,
    textAlign: "center",
  },
  summary: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  totalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  button: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
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
