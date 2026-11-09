import { Ionicons } from "@expo/vector-icons";

// Jenis layanan cetak
export type ServiceType = "dokumen" | "foto" | "poster";

// Interface untuk data layanan
export interface Service {
  readonly id: string;
  name: string;
  description: string;
  price: number;
  type: ServiceType;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string;
}

// Satu-satunya sumber data layanan cetak
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
