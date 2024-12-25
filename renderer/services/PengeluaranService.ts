/* eslint-disable no-console */

import axios from "../utils/axios";

enum PengeluaranUrl {
    GET_PENGELUARAN = "/api/pengeluaran",
    SAVE_PENGELUARAN = "/api/pengeluaran/create",
    DELETE_PENGELUARAN = "/api/pengeluaran/delete",
}

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

const getPengeluaran = async (
    token: string,
    params: GetPengeluaranParams
): Promise<GetPengeluaranResponse> => {
    try {
        const response = await axios.get(`${PengeluaranUrl.GET_PENGELUARAN}`, {
            params,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log("getPengeluaran", error);
        throw error;
    }
};

const savePengeluaran = async (
    token: string,
    params: SavePengeluaranParams
) => {
    try {
        const response = await axios.post(
            `${PengeluaranUrl.SAVE_PENGELUARAN}`,
            params,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.log("updatePayment", error);
        throw error;
    }
};

const deletePengeluaran = async (token: string, id: number) => {
    try {
        const response = await axios.post(
            `${PengeluaranUrl.DELETE_PENGELUARAN}`,
            {
                id,
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.log("deletePayment", error);
        throw error;
    }
};

const PengeluaranService = {
    getPengeluaran,
    savePengeluaran,
    deletePengeluaran,
};

export default PengeluaranService;
