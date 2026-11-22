import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Order, orders as initialOrders } from "../data/service";

// Data yang dibagikan ke semua layar (Home, Detail, Buat Pesanan)
type NewOrderInput = Omit<Order, "id" | "status">;

type OrderContextType = {
  orders: Order[];
  addOrder: (data: NewOrderInput) => string; // mengembalikan id pesanan baru
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  // useState: daftar pesanan disimpan sebagai state agar bisa bertambah
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // useEffect: jalan setiap kali jumlah pesanan berubah
  useEffect(() => {
    console.log(`Jumlah pesanan sekarang: ${orders.length}`);
  }, [orders.length]);

  const addOrder = (data: NewOrderInput) => {
    // Cari nomor terbesar (KP-0021 -> 21), lalu tambah 1
    const lastNumber = Math.max(...orders.map((o) => parseInt(o.id.replace("KP-", ""), 10)));
    const newId = "KP-" + String(lastNumber + 1).padStart(4, "0");

    const newOrder: Order = { id: newId, status: "menunggu", ...data };
    setOrders((previous) => [newOrder, ...previous]); // pesanan baru di paling atas
    return newId;
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) { throw new Error("useOrders harus digunakan di dalam OrderProvider"); }
  return context;
}
