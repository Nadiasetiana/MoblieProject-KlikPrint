// =====================================================================
// SERVICES: semua fungsi untuk mengambil data dari External API
// dan fungsi async (Promise) yang dipakai di aplikasi KlikPrint
// =====================================================================

// ---------- INTERFACE: bentuk data MENTAH dari External API ----------
// API Wilayah Indonesia: https://www.emsifa.com/api-wilayah-indonesia/
interface ProvinceResponse {
  id: string;
  name: string; // contoh: "JAWA TIMUR"
}

interface RegencyResponse {
  id: string;
  province_id: string;
  name: string; // contoh: "KOTA MALANG"
}

// API Kutipan: https://dummyjson.com/quotes/random
interface QuoteResponse {
  id: number;
  quote: string;
  author: string;
}

// ---------- INTERFACE: Object yang dipakai di dalam aplikasi ----------
export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  provinceId: string;
  name: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface DeliveryInfo {
  city: string;
  cost: number;
  estimate: string;
}

export interface Voucher {
  code: string;
  percent: number; // besar diskon dalam persen
  label: string;
}

const WILAYAH_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";
const QUOTE_URL = "https://dummyjson.com/quotes/random";
const STORE_PROVINCE_ID = "35"; // toko KlikPrint ada di Malang, Jawa Timur

// "KOTA MALANG" -> "Kota Malang"
const toTitleCase = (text: string) =>
  text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

// =====================================================================
// FITUR 1: CEK AREA PENGANTARAN
// CUSTOM ASYNC FUNCTION dengan async/await.
// Di dalamnya memakai PRE-BUILT ASYNC FUNCTION: fetch() dan response.json()
// =====================================================================
export async function getProvinces(): Promise<Province[]> {
  const response = await fetch(`${WILAYAH_URL}/provinces.json`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data provinsi");
  }
  const data: ProvinceResponse[] = await response.json();

  // Data API dimasukkan ke Object sesuai interface Province
  return data.map((item) => ({
    id: item.id,
    name: toTitleCase(item.name),
  }));
}

export async function getCities(provinceId: string): Promise<City[]> {
  const response = await fetch(`${WILAYAH_URL}/regencies/${provinceId}.json`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data kota");
  }
  const data: RegencyResponse[] = await response.json();

  // Data API dimasukkan ke Object sesuai interface City
  return data.map((item) => ({
    id: item.id,
    provinceId: item.province_id,
    name: toTitleCase(item.name),
  }));
}

// Cek apakah kota bisa dijangkau kurir.
// Membuat Promise sendiri: resolve() kalau bisa, reject() kalau tidak.
export function checkDelivery(city: City): Promise<DeliveryInfo> {
  return new Promise((resolve, reject) => {
    // setTimeout = simulasi menunggu jawaban server
    setTimeout(() => {
      if (city.provinceId === STORE_PROVINCE_ID) {
        const isMalang = city.name.includes("Malang");
        resolve({
          city: city.name,
          cost: isMalang ? 5000 : 15000,
          estimate: isMalang ? "Hari ini" : "1-2 hari",
        });
      } else {
        reject(new Error(`Maaf, pengantaran ke ${city.name} belum tersedia. Saat ini hanya untuk wilayah Jawa Timur.`));
      }
    }, 700);
  });
}

// =====================================================================
// FITUR 2: KODE PROMO
// new Promise((resolve, reject) => ...) lalu dipakai dengan .then() / .catch()
// =====================================================================
const vouchers: Voucher[] = [
  { code: "HEMAT10", percent: 10, label: "Diskon 10%" },
  { code: "MAHASISWA", percent: 20, label: "Diskon Mahasiswa 20%" },
];

export function validateVoucher(code: string): Promise<Voucher> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = vouchers.find((v) => v.code === code.trim().toUpperCase());
      if (found) {
        resolve(found); // kode benar -> Promise berhasil
      } else {
        reject(new Error("Kode promo tidak valid")); // kode salah -> Promise gagal
      }
    }, 600);
  });
}

// =====================================================================
// FITUR 3: KATA SEMANGAT
// Memakai rantai .then(), Promise.resolve(), dan Promise.reject()
// =====================================================================
let cachedQuote: Quote | null = null;

export function getQuote(forceRefresh = false): Promise<Quote> {
  // Kalau sudah pernah diambil, langsung kembalikan dari cache
  if (cachedQuote && !forceRefresh) {
    return Promise.resolve(cachedQuote);
  }

  return fetch(QUOTE_URL)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error("Server kutipan sedang bermasalah"));
      }
      return response.json();
    })
    .then((data: QuoteResponse) => {
      // Data API dimasukkan ke Object sesuai interface Quote
      const quote: Quote = { text: data.quote, author: data.author };
      cachedQuote = quote;
      return quote;
    });
}
