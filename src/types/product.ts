
// Interface untuk satu data produk dari API
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
}

// Interface untuk keseluruhan response dari API
export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
