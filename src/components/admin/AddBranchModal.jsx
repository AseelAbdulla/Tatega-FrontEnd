import React, { useState, useEffect, useRef } from 'react';
import partnerService from '../../services/partnerService';
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

function extractCoordinates(input) {
    if (!input) return null;
    const cleanInput = input.trim();

    const directMatch = cleanInput.match(/^(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)$/);
    if (directMatch) {
        return { lat: parseFloat(directMatch[1]), lng: parseFloat(directMatch[2]) };
    }

    const googleAtMatch = cleanInput.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (googleAtMatch) {
        return { lat: parseFloat(googleAtMatch[1]), lng: parseFloat(googleAtMatch[2]) };
    }

    const queryMatch = cleanInput.match(/[?&](?:q|destination|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (queryMatch) {
        return { lat: parseFloat(queryMatch[1]), lng: parseFloat(queryMatch[2]) };
    }

    return null;
}

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
    const [pasteInput, setPasteInput] = useState('');
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFormData(initialFormState);
            setPasteInput('');
            setLogoPreview(null);
            setShowHelp(false);
        }
    }, [isOpen]);

    const updateLocationOnMap = (lat, lng, zoomLevel = 16) => {
        const cleanLat = parseFloat(lat.toFixed(6));
        const cleanLng = parseFloat(lng.toFixed(6));

        setFormData(prev => ({ ...prev, lat: cleanLat, lng: cleanLng }));

        if (markerRef.current) {
            markerRef.current.setLatLng([cleanLat, cleanLng]);
        }
        if (mapRef.current) {
            mapRef.current.setView([cleanLat, cleanLng], zoomLevel);
        }
    };

    const handlePasteInputChange = (e) => {
        const val = e.target.value;
        setPasteInput(val);

        const coords = extractCoordinates(val);
        if (coords) {
            updateLocationOnMap(coords.lat, coords.lng, 16);
        }
    };

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
                markerRef.current = marker;

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
                    updateLocationOnMap(y, x, 15);
                });

                map.on('click', (e) => {
                    const { lat, lng } = e.latlng;
                    updateLocationOnMap(lat, lng, map.getZoom());
                });

                marker.on('dragend', (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    setFormData(prev => ({
                        ...prev,
                        lat: parseFloat(lat.toFixed(6)),
                        lng: parseFloat(lat.toFixed(6))
                    }));
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
                markerRef.current = null;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await partnerService.createPartner(formData);
            if (onSuccess) onSuccess('تمت إضافة نقطة البيع بنجاح');
            onClose();
        } catch (error) {
            console.error('تفاصيل خطأ 422:', error.response?.data);

            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                if (errors) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
                onClick={!loading ? onClose : undefined} 
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-surface-container-high z-10 max-h-[90vh] overflow-y-auto dir-rtl text-right transition-all">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-surface-container-high pb-3 mb-4">
                    <h3 className="text-base font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">add_location_alt</span>
                        إضافة نقطة بيع جديدة
                    </h3>
                    <button 
                        type="button"
                        onClick={onClose} 
                        disabled={loading} 
                        className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface transition"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    
                    {/* Arabic & English Names */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1">اسم نقطة البيع (بالعربي) *</label>
                            <input
                                type="text"
                                required
                                value={formData.name_ar}
                                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                                className="w-full rounded-xl border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-xs transition-all outline-none"
                                placeholder="مثال: فرع صنعاء - حدة"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1">اسم نقطة البيع (بالإنجليزية)</label>
                            <input
                                type="text"
                                value={formData.name_en}
                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                className="w-full rounded-xl border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-xs transition-all outline-none"
                                placeholder="e.g. Sanaa Branch"
                            />
                        </div>
                    </div>

                    {/* Website URL */}
                    <div>
                        <label className="block text-xs font-semibold text-secondary mb-1">الموقع الإلكتروني (Website URL)</label>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={formData.website_url}
                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                            className="w-full rounded-xl border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-xs transition-all outline-none dir-ltr text-right"
                        />
                    </div>

                    {/* Order, Status, Logo */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1">الترتيب</label>
                            <input
                                type="number"
                                value={formData.sort_order}
                                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                                className="w-full rounded-xl border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-xs transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1">الحالة</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full rounded-xl border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-xs transition-all outline-none cursor-pointer"
                            >
                                <option value="active">نشط</option>
                                <option value="inactive">غير نشط</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1">الشعار</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-[11px] text-on-surface-variant file:mr-0 file:ml-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:bg-surface-container file:text-primary file:font-semibold cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Coordinates & Link Helper Box */}
                    <div className="bg-surface-container-low/60 p-3 rounded-xl border border-outline-variant/40 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-primary flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">pin_drop</span>
                                لصق الإحداثيات أو رابط الخريطة
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowHelp(!showHelp)}
                                className="flex items-center gap-1 text-[10px] font-semibold text-terracotta bg-white px-2 py-1 rounded-full border border-outline-variant/60 shadow-xs hover:bg-surface-container transition"
                            >
                                <span className="material-symbols-outlined text-xs">help</span>
                                <span>كيف تحصل عليها؟</span>
                            </button>
                        </div>

                        {showHelp && (
                            <div className="p-2.5 bg-white rounded-lg border border-terracotta/30 shadow-xs text-[10px] text-on-surface-variant space-y-1">
                                <p className="font-bold text-primary">خطوات نسخ الإحداثيات:</p>
                                <ol className="list-decimal list-inside space-y-0.5 text-[9.5px] leading-relaxed">
                                    <li>افتح الرابط المرسل من الخريطة/الواتساب.</li>
                                    <li>انقر بزر الماوس الأيمن (أو اضغط مطولاً) فوق الدبوس.</li>
                                    <li>نسخ الأرقام (مثال: <code className="bg-surface-container px-1 rounded dir-ltr inline-block font-mono">15.3694, 44.1910</code>).</li>
                                    <li>الصق النص المنسوخ في الحقل أدناه ليتم تحديث الموقع فوراً.</li>
                                </ol>
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="الصق الإحداثيات 15.3694, 44.1910 أو رابط جوجل ماب..."
                            value={pasteInput}
                            onChange={handlePasteInputChange}
                            className="w-full rounded-xl border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-xs transition-all outline-none"
                        />
                    </div>

                    {/* Map Box */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-bold text-secondary">تحديد الموقع على الخريطة</label>
                            <span className="text-[10px] text-on-surface-variant font-mono bg-surface-container px-2 py-0.5 rounded-md">
                                {formData.lat}, {formData.lng}
                            </span>
                        </div>
                        <div
                            id="add-map-container"
                            style={{ height: '220px', width: '100%' }}
                            className="rounded-xl border border-outline-variant overflow-hidden relative z-0 shadow-inner"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-xs hover:bg-primary/90 active:scale-[0.99] transition-all shadow-xs disabled:opacity-50"
                        >
                            {loading ? 'جاري الحفظ...' : 'حفظ نقطة البيع'}
                        </button>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={onClose}
                            className="flex-1 border border-outline-variant text-on-surface-variant py-2.5 rounded-xl font-bold text-xs hover:bg-surface-container transition-all disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

