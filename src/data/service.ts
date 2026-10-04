import { Ionicons } from "@expo/vector-icons";

export type ServiceType = "dokumen" | "foto" | "poster";
export type OrderStatus = "menunggu" | "dicetak" | "selesai";

export interface Service {
  readonly id: string;
  name: string;
  description: string;
  price: number; // harga per lembar (data dummy)
  type: ServiceType;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string; // opsional
}

export interface Order {
  readonly id: string;
  title: string;
  total: number;
  status: OrderStatus;
}

export const services: Service[] = [
  {
    id: "1",
    name: "Cetak Dokumen",
    description: "PDF, Word, tugas kuliah",
    price: 500,
    type: "dokumen",
    icon: "document-text-outline",
  },
  {
    id: "2",
    name: "Cetak Foto",
    description: "Berbagai ukuran foto",
    price: 3000,
    type: "foto",
    icon: "image-outline",
    badge: "Populer",
  },
  {
    id: "3",
    name: "Cetak Poster",
    description: "A3, A2, A1 untuk acara",
    price: 15000,
    type: "poster",
    icon: "easel-outline",
  },
];

export const orders: Order[] = [
  { id: "KP-0021", title: "Laporan Praktikum.pdf", total: 12500, status: "dicetak" },
  { id: "KP-0020", title: "Poster Acara KKN", total: 45000, status: "menunggu" },
  { id: "KP-0019", title: "Foto Wisuda (4R)", total: 18000, status: "selesai" },
];