import React, { useState, useEffect, useRef } from 'react';
import partnerService from '../../services/partnerService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function EditBranchModal({ isOpen, onClose, branch, onSuccess }) {
    const [formData, setFormData] = useState({
        name_ar: '',
        name_en: '',
        website_url: '',
        sort_order: 0,
        status: 'active',
        lat: '',
        lng: '',
    });

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    // 1. قراءة البيانات الإبتدائية عند فتح المودال
    useEffect(() => {
        if (branch && isOpen) {
            let arName = '';
            let enName = '';

            if (typeof branch.name === 'object' && branch.name !== null) {
                arName = branch.name.ar || '';
                enName = branch.name.en || '';
            } else if (typeof branch.name === 'string') {
                arName = branch.name;
            }

            setFormData({
                name_ar: arName || branch.name_ar || '',
                name_en: enName || branch.name_en || '',
                website_url: branch.website_url || '',
                sort_order: branch.sort_order ?? 0,
                status: branch.status || 'active',
                lat: branch.lat ? String(branch.lat) : '24.7136',
                lng: branch.lng ? String(branch.lng) : '46.6753',
            });

            // تعيين الصورة الحالية للفرع إن وجدت
            setLogoPreview(branch.logo || branch.logo_path || '');
            setLogoFile(null);
        }
    }, [branch, isOpen]);

    // 2. تهيئة الخريطة
    useEffect(() => {
        if (!isOpen || !branch) return;

        const timer = setTimeout(() => {
            const initialLat = formData.lat ? parseFloat(formData.lat) : 24.7136;
            const initialLng = formData.lng ? parseFloat(formData.lng) : 46.6753;

            const mapElement = document.getElementById('edit-branch-map');
            if (!mapElement) return;

            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }

            const map = L.map('edit-branch-map').setView([initialLat, initialLng], 13);
            mapRef.current = map;

            L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: '&copy; Google Maps'
            }).addTo(map);

            const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
            markerRef.current = marker;

            marker.on('dragend', () => {
                const position = marker.getLatLng();
                setFormData(prev => ({
                    ...prev,
                    lat: position.lat.toFixed(6),
                    lng: position.lng.toFixed(6)
                }));
            });

            map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                setFormData(prev => ({
                    ...prev,
                    lat: lat.toFixed(6),
                    lng: lng.toFixed(6)
                }));
            });
        }, 200);

        return () => clearTimeout(timer);
    }, [isOpen, branch]);

    if (!isOpen || !branch) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 3. معالجة اختيار ملف الصورة وتوليد المعاينة
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    // 4. إرسال البيانات باستخدام FormData (لدعم الرفع ومحاكاة PUT في Laravel)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = new FormData();
            data.append('_method', 'PUT'); // يخبر Laravel أن هذا طلب PUT
            data.append('name[ar]', formData.name_ar || '');
            if (formData.name_en) data.append('name[en]', formData.name_en);
            if (formData.website_url) data.append('website_url', formData.website_url);
            data.append('sort_order', formData.sort_order ?? 0);
            data.append('status', formData.status || 'active');
            if (formData.lat) data.append('lat', formData.lat);
            if (formData.lng) data.append('lng', formData.lng);

            // إرفاق الملف فقط في حال تم رفعه
            if (logoFile instanceof File) {
                data.append('logo', logoFile);
            }

            await partnerService.updatePartner(branch.id, data);

            if (onSuccess) onSuccess('تم تعديل بيانات الفرع بنجاح');
            onClose();
        } catch (error) {
            console.error("خطأ أثناء تحديث بيانات الفرع:", error);
            alert("حدث خطأ أثناء حفظ البيانات، حاول مجدداً.");
        } finally {
            setIsLoading(false);
        }
        
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
            <div
                className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
                onClick={!isLoading ? onClose : undefined}
            ></div>

            <div className="relative bg-white rounded-2xl max-w-lg w-full p-4 shadow-2xl modal-content border border-surface-container-high z-10 dir-rtl text-right max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-800">تعديل بيانات الفرع / نقطة البيع</h3>
                    <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="mt-3 space-y-3 text-xs">

                    {/* حقل رفع ومعاينة الشعار */}
                    <div>
                        <label className="block text-gray-600 mb-1 font-medium">شعار الفرع / الصورة</label>
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] text-gray-400">لا توجد صورة</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* الاسم باللغة العربية والإنجليزية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-600 mb-1 font-medium">اسم الفرع (بالعربي) *</label>
                            <input
                                type="text"
                                name="name_ar"
                                value={formData.name_ar}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1 font-medium">اسم الفرع (بالإنجليزي)</label>
                            <input
                                type="text"
                                name="name_en"
                                value={formData.name_en}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* رابط الموقع والترتيب */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-600 mb-1 font-medium">رابط الموقع الإلكتروني</label>
                            <input
                                type="url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1 font-medium">ترتيب العرض (Sort Order)</label>
                            <input
                                type="number"
                                name="sort_order"
                                value={formData.sort_order}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* الحالة */}
                    <div>
                        <label className="block text-gray-600 mb-1 font-medium">الحالة</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                        >
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                        </select>
                    </div>

                    {/* الخريطة للإحداثيات */}
                    <div>
                        <label className="block text-gray-600 mb-1 font-medium">تحديد الموقع على الخريطة</label>
                        <div id="edit-branch-map" className="w-full h-36 rounded-lg border border-gray-200 z-0"></div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <span className="text-[10px] text-gray-400">خط العرض: {formData.lat}</span>
                            <span className="text-[10px] text-gray-400">خط الطول: {formData.lng}</span>
                        </div>
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-primary text-white py-2 rounded-lg font-bold text-xs hover:opacity-90 transition disabled:opacity-50"
                        >
                            {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                        </button>

                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={onClose}
                            className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg font-bold text-xs hover:bg-gray-50 transition"
                        >
                            إلغاء
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

