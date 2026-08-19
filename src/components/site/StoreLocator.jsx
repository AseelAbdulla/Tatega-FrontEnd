import { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    useMap
} from "react-leaflet";
import L from 'leaflet';
import { partnerService } from '../../services/partnerService';

function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView(coords, 13);
    return null;
}

// دالة حساب المسافة بالكيلومتر (Haversine Formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default function StoreLocator() {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        partnerService.getPublicPartners()
            .then((data) => {
                const validPartners = data.filter(p => p.lat && p.lng);
                setPartners(validPartners);
                if (validPartners.length > 0) {
                    setSelectedPartner(validPartners[0]);
                }
            })
            .catch((err) => console.error("خطأ في جلب الفروع:", err))
            .finally(() => setLoading(false));
    }, []);

    const getPartnerName = (name) => {
        if (!name) return 'فرع تعتيقة';
        if (typeof name === 'string') return name;
        if (typeof name === 'object') return name.ar || name.en || Object.values(name)[0] || 'فرع تعتيقة';
        return 'فرع تعتيقة';
    };

    // دالة العثور على أقرب فرع لموقع المستخدم
    const findNearestPartner = () => {
        if (!navigator.geolocation) {
            alert("خدمة تحديد الموقع غير مدعومة في متصفحك.");
            return;
        }

        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                let nearest = null;
                let minDistance = Infinity;

                partners.forEach((partner) => {
                    const dist = calculateDistance(
                        userLat,
                        userLng,
                        parseFloat(partner.lat),
                        parseFloat(partner.lng)
                    );

                    if (dist < minDistance) {
                        minDistance = dist;
                        nearest = { ...partner, distance: dist.toFixed(1) };
                    }
                });

                if (nearest) {
                    setSelectedPartner(nearest);
                }
                setLocating(false);
            },
            (error) => {
                console.error("خطأ في تحديد الموقع:", error);
                alert("تعذر الوصول إلى موقعك الحالي. يرجى تفعيل الإذن.");
                setLocating(false);
            }
        );
    };

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
                <div className="text-center mb-8">
                    <span className="text-accent-terracotta font-bold text-xs mb-4 block uppercase">
                        تواصل معنا مكانياً
                    </span>
                    <h2 className="text-3xl font-bold text-primary mb-4">ابحث عن جذورنا وفروعنا</h2>

                    {/* زر العثور على أقرب فرع */}
                    <button
                        onClick={findNearestPartner}
                        disabled={locating}
                        className="bg-primary hover:bg-accent-hover text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-lg">my_location</span>
                        <span>{locating ? 'جاري تحديد موقعك...' : 'تحديد أقرب فرع لي'}</span>
                    </button>
                </div>

                <div className="relative rounded-[3rem] overflow-hidden rustic-shadow border border-black/10 z-0" style={{ height: '500px', width: '100%' }}>

                    <MapContainer
                        center={[15, 40]}
                        zoom={3}
                        minZoom={2}
                        maxZoom={16}
                        style={{ height: "500px", width: "100%", borderRadius: "10px" }}
                    >
                        <TileLayer
                            attribution="© OpenStreetMap"
                            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                        />

                        {selectedPartner && (
                            <ChangeMapView coords={[parseFloat(selectedPartner.lat), parseFloat(selectedPartner.lng)]} />
                        )}

                        {partners.map((partner) => {
                            const isSelected = selectedPartner?.id === partner.id;

                            return (
                                <CircleMarker
                                    key={partner.id}
                                    center={[parseFloat(partner.lat), parseFloat(partner.lng)]}
                                    radius={isSelected ? 10 : 6}
                                    pathOptions={{
                                        color: isSelected ? '#F07A26' : '#24572b',
                                        fillColor: isSelected ? '#F07A26' : '#24572b',
                                        fillOpacity: isSelected ? 0.9 : 0.6,
                                        weight: isSelected ? 2 : 1
                                    }}
                                    eventHandlers={{
                                        click: () => setSelectedPartner(partner)
                                    }}
                                >
                                    <Popup>
                                        <div className="text-right p-1">
                                            <h4 className="font-bold text-primary">{getPartnerName(partner.name)}</h4>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        })}
                    </MapContainer>

                    {/* الكارت العائم */}
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
                                <h4 className="font-bold text-primary text-lg mb-1">
                                    {getPartnerName(selectedPartner.name)}
                                </h4>

                                {/* عرض المسافة بالكيلومتر إذا تم حسابها */}
                                {selectedPartner.distance && (
                                    <p className="text-xs text-accent-terracotta font-bold mb-3">
                                        يبعد عنك حوالي {selectedPartner.distance} كم
                                    </p>
                                )}

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

