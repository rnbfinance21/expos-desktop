export type PengeluaranData = {
  id: number;
  outlet_id: number;
  kasir_id: number;
  transaksi: string;
  description: string | null;
  date: string;
  amount: number;
  type: number;
  type_transaction: number;
  state: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  outlet_name: string;
  user_name: string;
  qty: number;
  price: number;
  satuan: string;
};

export type GetPengeluaranParams = {
  outlet_id: number;
  date: string;
  search: string;
};

export type SavePengeluaranParams = {
  outlet_id: number;
  transaksi: string;
  description?: string;
  amount: string;
  qty: string;
  price: string;
  satuan: string;
  type: number;
  type_transaction: number;
};

export type GetPengeluaranResponse = {
  code: number;
  message: string;
  data: PengeluaranData[];
};
