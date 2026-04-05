export type SupplierData = {
  id: number;
  outlet_id: number;
  supplier_id: number;
  tanggal: string;
  jumlah: number;
  state: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  outlet_name: string;
  supplier_name: string;
};

export type SupplierName = {
  id: number;
  name: string;
  address: string;
  order_number: number;
  state: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GetSupplierParams = {
  date: string;
  search: string;
};

export type SaveSupplierParams = {
  supplier_id: number;
  jumlah: string;
};

export type GetSupplierResponse = {
  code: number;
  message: string;
  data: SupplierData[];
};

export type GetSupplierNameResponse = {
  code: number;
  message: string;
  data: SupplierName[];
};
