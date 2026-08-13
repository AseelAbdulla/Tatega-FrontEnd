import { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    Tooltip,
    useMap
} from "react-leaflet";
import L from 'leaflet';
import { partnerService } from '../../services/partnerService';

// إصلاح مشكلة أيقونات Leaflet الافتراضية
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
// مكون مساعد لإعادة توجيه كاميرا الخريطة نحو الفرع المحدد
function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView(coords, 13);
    return null;
}

export default function StoreLocator() {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        partnerService.getPublicPartners()
            .then((data) => {
                // تصفية العناصر التي تحتوي على إحداثيات صحيحة فقط
                const validPartners = data.filter(p => p.lat && p.lng);
                setPartners(validPartners);
                if (validPartners.length > 0) {
                    setSelectedPartner(validPartners[0]); // اختيار أول فرع افتراضياً
                }
            })
            .catch((err) => console.error("خطأ في جلب الفروع:", err))
            .finally(() => setLoading(false));
    }, []);

    // دالة مساعدة لقراءة اسم الفرع من حقل الـ name الخاضع لـ array cast
    const getPartnerName = (name) => {
        if (!name) return 'فرع تعتيقة';
        if (typeof name === 'string') return name;
        if (typeof name === 'object') return name.ar || name.en || Object.values(name)[0] || 'فرع تعتيقة';
        return 'فرع تعتيقة';
    };

    // مركز الخريطة الافتراضي
    const defaultPosition = selectedPartner
        ? [parseFloat(selectedPartner.lat), parseFloat(selectedPartner.lng)]
        : [24.7136, 46.6753]; // إحداثيات افتراضية

    if (loading) {
        return (
            <div className="py-16 text-center text-primary font-bold">
                جاري جلب الفروع ونقاط البيع...
            </div>
        );
    }

    return (
        <section className="py-16 bg-surface-container/50" id="parteners">
            <div className="px-4 md:px-16 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-accent-terracotta font-bold text-xs mb-4 block uppercase">
                        تواصل معنا مكانياً
                    </span>
                    <h2 className="text-3xl font-bold text-primary mb-6">ابحث عن جذورنا وفروعنا</h2>
                </div>

                {/* الحاوية الأب الرئيسية - يجب أن تكون relative */}
                <div className="relative rounded-[3rem] overflow-hidden rustic-shadow border border-black/10 z-0" style={{ height: '500px', width: '100%' }}>

                    {/* 1. الخريطة (تحتوي فقط على مكونات Leaflet) */}
                    <MapContainer
                        center={[15, 40]}
                        zoom={3}
                        minZoom={2}
                        maxZoom={6}
                        zoomSnap={0.5}
                        zoomDelta={0.5}
                        style={{
                            height: "500px",
                            width: "100%",
                            borderRadius: "10px",
                        }}
                    >
                        <TileLayer
                            attribution="© OpenStreetMap"
                            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                        />

                        {selectedPartner && (
                            <ChangeMapView coords={[parseFloat(selectedPartner.lat), parseFloat(selectedPartner.lng)]} />
                        )}


                        {/* 2. استبدال Marker بـ CircleMarker وتنسيقه بألوان الهوية */}
                        {partners.map((partner) => {
                            const isSelected = selectedPartner?.id === partner.id;

                            return (
                                <CircleMarker
                                    key={partner.id}
                                    center={[parseFloat(partner.lat), parseFloat(partner.lng)]}
                                    radius={isSelected ? 10 : 6} // نصف القطر بالبكسل (يكبر عند التحديد)
                                    pathOptions={{
                                        color: isSelected ? '#F07A26' : '#24572b',       // لون الإطار الخارجي (برتقالي إذا محدد / أخضر للملف العام)
                                        fillColor: isSelected ? '#F07A26' : '#24572b',   // لون التعبئة الداخلية
                                        fillOpacity: isSelected ? 0.9 : 0.6,             // درجة الشفافية
                                        weight: isSelected ? 2 : 1                       // سمك الإطار الخارجي
                                    }}
                                    eventHandlers={{
                                        click: () => setSelectedPartner(partner)
                                    }}
                                >
                                    <Popup>
                                        <div className="text-right p-1">
                                            <h4 className="font-bold text-primary">{getPartnerName(partner.name)}</h4>
                                            {partner.website_url && (
                                                <a
                                                    href={partner.website_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-accent-terracotta underline block mt-1"
                                                >
                                                    زيارة الموقع
                                                </a>
                                            )}
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        })}
                    </MapContainer>

                    {/* 2. الكارت العائم (خارج MapContainer وتحت تأثير absolute للبُعد الرئيسي) */}
                    {selectedPartner && (
                        <div className="absolute top-10 right-10 z-1000 w-full max-w-xs pointer-events-auto">
                            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-2xl">
                                {selectedPartner.logo && (
                                    <img
                                        src={selectedPartner.logo}
                                        alt="Logo"
                                        className="w-16 h-16 object-contain mb-4 rounded-lg bg-background p-1"
                                    />
                                )}
                                <h4 className="font-bold text-primary text-lg mb-2">
                                    {getPartnerName(selectedPartner.name)}
                                </h4>

                                <div className="flex items-center gap-3 mb-6">
                                    <span className={`w-2 h-2 rounded-full ${selectedPartner.status === 'active' ? 'bg-primary animate-pulse' : 'bg-gray-400'}`}></span>
                                    <span className="text-xs font-bold text-primary">
                                        الحالة: {selectedPartner.status || 'متاح'}
                                    </span>
                                </div>

                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPartner.lat},${selectedPartner.lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">directions</span>
                                    <span>الاتجاهات</span>
                                </a>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}

