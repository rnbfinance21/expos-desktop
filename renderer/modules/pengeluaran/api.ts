import axios from "@/utils/axios";
import {
  GetPengeluaranParams,
  GetPengeluaranResponse,
  SavePengeluaranParams,
} from "@/modules/pengeluaran/type";

enum PengeluaranUrl {
  GET_PENGELUARAN = "/api/pengeluaran",
  SAVE_PENGELUARAN = "/api/pengeluaran/create",
  DELETE_PENGELUARAN = "/api/pengeluaran/delete",
}

export const getPengeluaran = async (
  token: string,
  params: GetPengeluaranParams
): Promise<GetPengeluaranResponse> => {
  try {
    const response = await axios.get(PengeluaranUrl.GET_PENGELUARAN, {
      params,
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("getPengeluaran", error);
    throw error;
  }
};

export const savePengeluaran = async (
  token: string,
  params: SavePengeluaranParams
) => {
  try {
    const response = await axios.post(PengeluaranUrl.SAVE_PENGELUARAN, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("savePengeluaran", error);
    throw error;
  }
};

export const deletePengeluaran = async (token: string, id: number) => {
  try {
    const response = await axios.post(
      PengeluaranUrl.DELETE_PENGELUARAN,
      { id },
      { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.log("deletePengeluaran", error);
    throw error;
  }
};
