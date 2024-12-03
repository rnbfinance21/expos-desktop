/* eslint-disable no-console */

import axios from "../utils/axios";

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

const get = async (
    token: string,
    params: GetPurchaseParams
): Promise<GetPurchaseResponse> => {
    try {
        const response = await axios.get("/api/purchase", {
            params,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log("getSupplier", error);
        throw error;
    }
};

const detail = async (
    token: string,
    id: number
): Promise<GetDetailPurchaseResponse> => {
    try {
        const response = await axios.get(`/api/purchase/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log("getSupplier", error);
        throw error;
    }
};

const create = async (token: string, params: CreatePurchaseParams) => {
    try {
        const response = await axios.post(`/api/purchase`, params, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log("createPurchase", error);
        throw error;
    }
};

const remove = async (token: string, id: number) => {
    try {
        const response = await axios.delete(`/api/purchase/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log("deletePurchase", error);
        throw error;
    }
};

const cancel = async (token: string, id: number) => {
    try {
        const response = await axios.delete(`/api/purchase/cancel/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log("cancelPurchase", error);
        throw error;
    }
};

const PurchaseService = {
    get,
    remove,
    cancel,
    create,
    detail,
    // save,
    // deleteSupplier,
};

export default PurchaseService;
