export interface VariantOption {
  id: number;
  variant_id: number;
  name: string;
  price: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  outlet_state: number;
}

export interface Variant {
  id: number;
  name: string;
  type: number;
  state: number;
  required_state: number;
  required_select: number;
  max_state: number;
  max_select: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  options: VariantOption[];
}

export interface Menu {
  id: number;
  kategori_outlet_id: number | null;
  kategori_brand_id: number | null;
  kategori_menu_id: number;
  name: string;
  description: string;
  price: number;
  photo: string;
  published_at: string | null;
  published_end: string | null;
  type: number;
  tax_state: number;
  box_state: number;
  consignment_state: number;
  kuah_state: number;
  level_state: number;
  show_state: number;
  custom_state: number;
  state: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  kategori_menu_name: string;
  in_stock: number;
  state_stock: number;
  variants: Variant[];
}

export interface VariantOptionData {
  id: number;
  id_option_outlet: number;
  name: string;
  outlet_id: number;
  state: number;
}

export interface VariantData {
  id: number;
  name: string;
  options: VariantOptionData[];
}

export type GetMenuOutletResponse = {
  code: number;
  message: string;
  data: Menu[];
};

export type ChangeStockStateParams = {
  outlet_id: number;
  menu_id: number;
  state: number;
};

export type ChangeVariantStateParams = {
  outlet_id: number;
  variant_option_id: number;
  state: number;
};

export type GetVariantOutletResponse = {
  code: number;
  message: string;
  data: VariantData[];
};
