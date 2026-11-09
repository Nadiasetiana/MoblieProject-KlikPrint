import type { Product, ProductResponse } from "../types/product";

// URL untuk mengambil lima produk dari DummyJSON
const API_URL = "https://dummyjson.com/products?limit=5";

// Fungsi untuk mengambil data produk menggunakan Promise
export function getProducts(): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    // fetch merupakan fungsi bawaan untuk melakukan HTTP request
    fetch(API_URL)
      .then((response) => {
        // Memeriksa apakah request berhasil
        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }

        // Mengubah response menjadi JSON
        return response.json();
      })
      .then((data: ProductResponse) => {
        // Jika berhasil, kirim daftar produk menggunakan resolve
        resolve(data.products);
      })
      .catch((error: Error) => {
        // Jika gagal, kirim error menggunakan reject
        reject(error);
      });
  });
}
