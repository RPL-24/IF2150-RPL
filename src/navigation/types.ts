import type { Produk } from '../models/Produk';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ResetPassword: { mode?: 'request' | 'recovery' | 'change' } | undefined;
  Home: undefined;
  SearchProduct: undefined;
  TrenBahanBaku: undefined;
  Profile: undefined;
  AddProduct: undefined;
  Notifikasi: undefined;
  IzinNotifikasi: undefined;
  ProductDetail: { idProduk: string };
  EditProduct: { idProduk: string; produkData: Produk };
  PriceHistoryPage: { idProduk: string; currentHargaJual: number; namaProduk: string };
};