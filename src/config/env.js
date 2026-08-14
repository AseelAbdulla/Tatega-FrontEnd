const fallbackApiBase = "http://127.0.0.1:8000/api";
const fallbackStorageBase = "http://127.0.0.1:8000";

export const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || fallbackApiBase
).replace(/\/+$/, "");

export const STORAGE_BASE_URL = (
    import.meta.env.VITE_STORAGE_BASE_URL || fallbackStorageBase
).replace(/\/+$/, "");

if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn("VITE_API_BASE_URL غير معرف، تم استخدام الرابط الافتراضي:", API_BASE_URL);
}