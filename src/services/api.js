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

export default api;

