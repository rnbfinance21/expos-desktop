
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Tambahkan interceptor untuk Authorization
api.interceptors.request.use(
    (config: any) => {
        // Ambil token dari localStorage (atau ganti sesuai storage yang digunakan)
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        config.headers = config.headers || {};

        config.headers["Content-Type"] = "application/json";

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

// Tambahkan interceptor untuk response error
api.interceptors.response.use(
    (response) => response,
    (error: any) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error, misalnya dengan menghapus token dan redirect ke login
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                window.location.href = "/login"; // Ganti dengan path login yang sesuai
            }
        }
        return Promise.reject(error);
    }
);

export default api;
