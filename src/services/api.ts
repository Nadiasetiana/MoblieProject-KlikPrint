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

// API Hari Libur Nager.Date: https://nagerholidays.com/api
interface HolidayResponse {
  date: string; // contoh: "2026-12-25"
  name: string; // nama hari libur (bahasa Inggris), contoh: "Christmas Day"
  countryCode: string; // "ID" = Indonesia
  nationalHoliday: boolean; // true = libur di seluruh Indonesia
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

export interface Holiday {
  name: string;
  date: string; // sudah diformat, contoh: "25 Desember 2026"
  daysLeft: number; // berapa hari lagi
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
const HOLIDAY_URL = "https://nagerholidays.com/api/v4/Holidays/ID"; // ID = Indonesia
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
// FITUR 3: LIBUR NASIONAL TERDEKAT (toko tutup)
// Memakai rantai .then(), Promise.resolve(), dan Promise.reject()
// =====================================================================

const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// "2026-12-25" -> "25 Desember 2026"
const formatTanggal = (date: string): string => {
  const [tahun, bln, tgl] = date.split("-");
  return `${Number(tgl)} ${bulan[Number(bln) - 1]} ${tahun}`;
};

// Tanggal hari ini dalam format "YYYY-MM-DD"
const hariIni = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

let cachedHoliday: Holiday | null = null;

export function getNextHoliday(forceRefresh = false): Promise<Holiday> {
  // Kalau sudah pernah diambil, langsung kembalikan dari cache
  if (cachedHoliday && !forceRefresh) {
    return Promise.resolve(cachedHoliday);
  }

  const tahun = new Date().getFullYear();
  return fetch(`${HOLIDAY_URL}/${tahun}`)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error("Server hari libur sedang bermasalah"));
      }
      return response.json();
    })
    .then((data: HolidayResponse[]) => {
      // Cari libur nasional pertama yang tanggalnya hari ini atau sesudahnya
      const today = hariIni();
      const next = data.find((item) => item.nationalHoliday && item.date >= today);
      if (!next) {
        return Promise.reject(new Error("Tidak ada libur nasional lagi tahun ini"));
      }
      // Data API dimasukkan ke Object sesuai interface Holiday
      const holiday: Holiday = {
        name: next.name,
        date: formatTanggal(next.date),
        daysLeft: Math.round((Date.parse(next.date) - Date.parse(today)) / 86400000),
      };
      cachedHoliday = holiday;
      return holiday;
    });
}
