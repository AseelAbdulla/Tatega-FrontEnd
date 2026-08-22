import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import i18n from '../i18n';

// إنشاء نسخة مخصصة من Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// إضافة التوكن تلقائيًا مع كل طلب
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// إضافة اللغة تلقائيًا مع كل طلب
api.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.language || 'ar';

    return config;
});

export default api;


