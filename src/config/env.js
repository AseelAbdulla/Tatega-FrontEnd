export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
    console.error("رابط الـ .env غير معرف في ملف API");
}