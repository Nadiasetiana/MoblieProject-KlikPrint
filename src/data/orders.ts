export type OrderStatus = "menunggu" | "dicetak" | "selesai";

export interface Order {
  id: string;
  title: string;
  total: number;
  status: OrderStatus;
}

export const orders: Order[] = [
  { id: "KP-0021", title: "Laporan Praktikum.pdf", total: 12500, status: "dicetak" },
  { id: "KP-0020", title: "Poster Acara KKN", total: 45000, status: "menunggu" },
  { id: "KP-0019", title: "Foto Wisuda (4R)", total: 18000, status: "selesai" },
];
