import { StyleSheet } from "react-native";

// EXTERNAL STYLE (modul 3.2): style ditulis di file terpisah, lalu di-import ke index.tsx
export const colors = {
  teal: "#0F8B6D",
  pink: "#F48FB1",
  background: "#EEF0FF",
  card: "#FFFFFF",
  textDark: "#0F172A",
  textGray: "#64748B",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: colors.teal,
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  greetingSub: {
    fontSize: 14,
    color: "#E2E8F0",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textDark,
    marginTop: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textDark,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textGray,
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.teal,
    marginTop: 4,
  },
  badge: {
    backgroundColor: colors.pink,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textDark,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.pink,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});