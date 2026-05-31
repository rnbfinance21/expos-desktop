
import axios from "axios";
let injectedToken = null;

// Untuk akses ipcRenderer jika ada (Electron)
let ipcRenderer = null;
if (typeof window !== "undefined" && (window as any).require) {
    try {
        ipcRenderer = (window as any).require("electron").ipcRenderer;
    } catch {}
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Setter opsional untuk inject token dari context jika ingin
export function setApiToken(token: string | null) {
    injectedToken = token;
}

api.interceptors.request.use(
    (config: any) => {
        let token = injectedToken;

        // Jika belum ada token injected, coba ambil dari electron-store
        if (!token && ipcRenderer) {
            try {
                token = ipcRenderer.sendSync("electron-store-get", "_token");
            } catch {}
        }

        // Jika masih belum ada, fallback ke localStorage
        if (!token && typeof window !== "undefined") {
            token = localStorage.getItem("token");
        }

        config.headers = config.headers || {};
        config.headers["Content-Type"] = "application/json";
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

export default api;
