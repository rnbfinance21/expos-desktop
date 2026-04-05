export type Purchase = {
  id: number;
  outlet_id: number;
  supplier_id: number;
  tanggal: string;
  by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  outlet: {
    id: number;
    name: string;
    code: string;
  };
  supplier: {
    id: number;
    name: string;
    address: string;
  };
  details?: {
    id: number;
    purchase_id: number;
    nama_barang: string;
    qty: number;
    unit: string;
    reason: string;
    status: number;
  }[];
};

export type GetPurchaseParams = {
  date: string;
  search: string;
};

export type GetPurchaseResponse = {
  code: number;
  message: string;
  data: Purchase[];
};

export type GetDetailPurchaseResponse = {
  code: number;
  message: string;
  data: Purchase;
};

export type CreatePurchaseParams = {
  supplier_id: number;
  tanggal: string;
  items: {
    nama_barang: string;
    qty: number;
    unit: string;
  }[];
};
