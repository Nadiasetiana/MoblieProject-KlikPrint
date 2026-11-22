import { StyleSheet } from "react-native";

// EXTERNAL STYLE (modul 3.2)
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f0f4",
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  themeButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  themeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "green",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#F48FB1",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  status: {
    padding: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
  // Kartu pengguna + tombol Keluar (Modul 4)
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: "#DC2626",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 72,
    alignItems: "center",
  },
  signOutText: {
    color: "#DC2626",
    fontWeight: "bold",
  },
  // Kartu "Libur Nasional Terdekat" (fitur baru)
  holidayCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  holidayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  holidayLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  holidayText: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 20,
    marginTop: 8,
  },
  holidayDate: {
    fontSize: 13,
    marginTop: 4,
  },
  holidayErrorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 8,
  },
  // Tombol "Cek Area Pengantaran" (fitur baru)
  deliveryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F59E0B",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  // Tombol "Buat Pesanan" (fitur baru)
  newOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "green",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  newOrderButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
