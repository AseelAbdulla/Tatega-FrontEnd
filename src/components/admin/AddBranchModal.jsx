import React, { useState, useEffect, useRef } from 'react';
import partnerService from '../../services/partnerService'; // 1. استيراد الخدمة
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import { GeoSearchControl, EsriProvider } from 'leaflet-geosearch';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

export default function AddBranchModal({ isOpen, onClose, onSuccess }) {
    const initialFormState = {
        name_ar: '',
        name_en: '',
        website_url: '',
        sort_order: 0,
        status: 'active',
        logo: null,
        lat: 15.3694,
        lng: 44.1910,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false); // حالة التحميل أثناء الإرسال
    const mapRef = useRef(null);

    // إعادة ضبط الحقول عند إغلاق المودال
    useEffect(() => {
        if (!isOpen) {
            setFormData(initialFormState);
            setLogoPreview(null);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            const container = document.getElementById('add-map-container');
            if (container && !mapRef.current) {
                const map = L.map(container).setView([formData.lat, formData.lng], 12);

                L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    attribution: '&copy; Google Maps'
                }).addTo(map);

                const marker = L.marker([formData.lat, formData.lng], { draggable: true }).addTo(map);
                const provider = new EsriProvider();

                const searchControl = new GeoSearchControl({
                    provider: provider,
                    style: 'bar',
                    showMarker: false,
                    autoClose: true,
                    searchLabel: 'ابحث عن موقع أو حي...',
                });

                map.addControl(searchControl);

                map.on('geosearch/showlocation', (result) => {
                    const { x, y } = result.location;
                    const lat = parseFloat(y.toFixed(6));
                    const lng = parseFloat(x.toFixed(6));

                    marker.setLatLng([lat, lng]);
                    setFormData(prev => ({ ...prev, lat, lng }));
                });

                map.on('click', (e) => {
                    const { lat, lng } = e.latlng;
                    const cleanLat = parseFloat(lat.toFixed(6));
                    const cleanLng = parseFloat(lng.toFixed(6));
                    marker.setLatLng([cleanLat, cleanLng]);
                    setFormData(prev => ({ ...prev, lat: cleanLat, lng: cleanLng }));
                });

                marker.on('dragend', (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    setFormData(prev => ({ ...prev, lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) }));
                });

                mapRef.current = map;

                setTimeout(() => {
                    map.invalidateSize();
                }, 400);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, logo: file }));
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    // 2. معالجة إرسال البيانات عبر partnerService
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        await partnerService.createPartner(formData);
        if (onSuccess) onSuccess('تمت إضافة نقطة البيع بنجاح');
        onClose();
    } catch (error) {
        console.error('تفاصيل خطأ 422:', error.response?.data);

        // إذا كان الخطأ 422 (خطأ مدخلات)
        if (error.response && error.response.status === 422) {
            const errors = error.response.data.errors;

            if (errors) {
                // نجمع كافة أسباب الرفض ونعرضها للمستخدم
                const messages = Object.values(errors).flat().join('\n• ');
                alert(`عذراً، البيانات غير مقبولة:\n• ${messages}`);
            } else {
                alert(error.response.data.message || 'بيانات غير صالحة');
            }
        } else {
            alert('حدث خطأ في الاتصال بالسيرفر');
        }
    } finally {
        setLoading(false);
    }
};

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2 py-4">
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onClick={!loading ? onClose : undefined}></div>
            <div className="relative bg-white rounded-2xl max-w-xl w-full p-4 shadow-2xl modal-content card-shadow border border-surface-container-high z-10 max-h-[90vh] overflow-y-auto dir-rtl text-right">
                <div className="flex justify-between items-center border-b border-surface-container-high pb-2">
                    <h3 className="text-sm font-bold text-primary">إضافة نقطة بيع جديدة</h3>
                    <button onClick={onClose} disabled={loading} className="p-1 hover:bg-surface-container rounded-full transition">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-3 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[9px] font-bold text-secondary mb-0.5">اسم نقطة البيع (بالعربي) *</label>
                            <input
                                type="text"
                                required
                                value={formData.name_ar}
                                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                                className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-2.5 py-1.5 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold text-secondary mb-0.5">اسم نقطة البيع (بالإنجليزية)</label>
                            <input
                                type="text"
                                value={formData.name_en}
                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-2.5 py-1.5 text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[9px] font-bold text-secondary mb-0.5">الموقع الإلكتروني (Website URL)</label>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={formData.website_url}
                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-2.5 py-1.5 text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-[9px] font-bold text-secondary mb-0.5">الترتيب (Sort Order)</label>
                            <input
                                type="number"
                                value={formData.sort_order}
                                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                                className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-2.5 py-1.5 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold text-secondary mb-0.5">الحالة</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-2.5 py-1.5 text-xs"
                            >
                                <option value="active">نشط</option>
                                <option value="inactive">غير نشط</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold text-secondary mb-0.5">صورة الشعار (Logo)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-surface-container file:text-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-bold text-secondary">
                                حدد الموقع دقيقاً على الخريطة
                            </label>
                            <span className="text-[9px] text-gray-500 font-mono">
                                Lat: {formData.lat} | Lng: {formData.lng}
                            </span>
                        </div>
                        <div
                            id="add-map-container"
                            style={{ height: '230px', width: '100%', minHeight: '230px' }}
                            className="rounded-lg border overflow-hidden relative z-0"
                        ></div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 bg-primary text-white py-1.5 rounded-lg font-bold text-[10px] hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'جاري الحفظ...' : 'حفظ وحفظ الموقع'}
                        </button>
                        <button 
                            type="button" 
                            disabled={loading}
                            onClick={onClose} 
                            className="flex-1 border border-surface-container-high text-on-surface-variant py-1.5 rounded-lg font-bold text-[10px] hover:bg-surface-container transition disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
