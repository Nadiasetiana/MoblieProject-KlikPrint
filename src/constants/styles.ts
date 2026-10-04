import { StyleSheet } from "react-native";

// EXTERNAL STYLE (modul 3.2)
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF0FF",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "gray",
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "green",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "pink",
    color: "white",
    fontSize: 11,
    padding: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
});