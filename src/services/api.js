// src/services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config/env';

// إنشاء نسخة مخصصة من Axios
const api = axios.create({
    baseURL: API_BASE_URL, // يقرأ الرابط من ملف البيئة .env تلقائياً
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// إرفاق هيدر اللغة التلقائي قبل كل طلب
api.interceptors.request.use((config) => {
    const currentLang = localStorage.getItem('app_lang') || 'ar';
    config.headers['Accept-Language'] = currentLang;
    return config;


});

export default api;

