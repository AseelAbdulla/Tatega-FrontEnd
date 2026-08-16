import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
<<<<<<< HEAD
    useMap
=======
    useMap,
>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c
} from "react-leaflet";

<<<<<<< HEAD
=======
import { partnerService } from "../../services/partnerService";

// مكون مساعد لإعادة توجيه كاميرا الخريطة نحو الفرع المحدد
>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c
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
    const { t, i18n } = useTranslation();

    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locating, setLocating] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Get Partners
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        partnerService
            .getPublicPartners()
            .then((data) => {
<<<<<<< HEAD
                const validPartners = data.filter(p => p.lat && p.lng);
=======
                // تصفية الفروع التي تحتوي على إحداثيات صحيحة فقط
                const validPartners = data.filter(
                    (partner) => partner.lat && partner.lng
                );

>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c
                setPartners(validPartners);

                if (validPartners.length > 0) {
                    setSelectedPartner(validPartners[0]);
                }
            })
            .catch((err) => {
                console.error("Error fetching partners:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

<<<<<<< HEAD
=======
    /*
    |--------------------------------------------------------------------------
    | Get Localized Partner Name
    |--------------------------------------------------------------------------
    */

>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c
    const getPartnerName = (name) => {
        if (!name) {
            return t("storeLocator.defaultBranch");
        }

        const currentLang = i18n.language?.startsWith("en")
            ? "en"
            : "ar";

        // إذا كان الاسم Object
        if (typeof name === "object") {
            return (
                name[currentLang] ||
                name.ar ||
                name.en ||
                t("storeLocator.defaultBranch")
            );
        }

        // إذا كان الاسم String
        if (typeof name === "string") {
            // محاولة قراءة JSON
            try {
                const parsed = JSON.parse(name);

                if (parsed && typeof parsed === "object") {
                    return (
                        parsed[currentLang] ||
                        parsed.ar ||
                        parsed.en ||
                        t("storeLocator.defaultBranch")
                    );
                }
            } catch {
                // إذا لم يكن JSON، نستخدم النص كما هو
                return name;
            }

            return name;
        }

        return t("storeLocator.defaultBranch");
    };

<<<<<<< HEAD
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
=======
    /*
    |--------------------------------------------------------------------------
    | Default Map Position
    |--------------------------------------------------------------------------
    */

    const defaultPosition = selectedPartner
        ? [
              parseFloat(selectedPartner.lat),
              parseFloat(selectedPartner.lng),
          ]
        : [24.7136, 46.6753];

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */
>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c

    if (loading) {
        return (
            <div className="py-16 text-center text-primary font-bold">
                {t("storeLocator.loading")}
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <section
            className="py-16 bg-surface-container/50"
            id="parteners"
        >
            <div className="px-4 md:px-16 max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <span className="text-accent-terracotta font-bold text-xs mb-4 block uppercase">
                        {t("storeLocator.label")}
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
                        center={defaultPosition}
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
                            <ChangeMapView
                                coords={[
                                    parseFloat(selectedPartner.lat),
                                    parseFloat(selectedPartner.lng),
                                ]}
                            />
                        )}

<<<<<<< HEAD
=======
                        {/* Partner Markers */}

>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c
                        {partners.map((partner) => {
                            const isSelected =
                                selectedPartner?.id === partner.id;

                            return (
                                <CircleMarker
                                    key={partner.id}
<<<<<<< HEAD
                                    center={[parseFloat(partner.lat), parseFloat(partner.lng)]}
                                    radius={isSelected ? 10 : 6}
                                    pathOptions={{
                                        color: isSelected ? '#F07A26' : '#24572b',
                                        fillColor: isSelected ? '#F07A26' : '#24572b',
                                        fillOpacity: isSelected ? 0.9 : 0.6,
                                        weight: isSelected ? 2 : 1
=======
                                    center={[
                                        parseFloat(partner.lat),
                                        parseFloat(partner.lng),
                                    ]}
                                    radius={isSelected ? 10 : 6}
                                    pathOptions={{
                                        color: isSelected
                                            ? "#F07A26"
                                            : "#24572b",

                                        fillColor: isSelected
                                            ? "#F07A26"
                                            : "#24572b",

                                        fillOpacity: isSelected
                                            ? 0.9
                                            : 0.6,

                                        weight: isSelected ? 2 : 1,
>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c
                                    }}
                                    eventHandlers={{
                                        click: () =>
                                            setSelectedPartner(partner),
                                    }}
                                >

                                    {/* Popup */}

                                    <Popup>
                                        <div className="text-right p-1">
<<<<<<< HEAD
                                            <h4 className="font-bold text-primary">{getPartnerName(partner.name)}</h4>
=======

                                            <h4 className="font-bold text-primary">
                                                {getPartnerName(
                                                    partner.name
                                                )}
                                            </h4>

                                            {partner.website_url && (
                                                <a
                                                    href={
                                                        partner.website_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-accent-terracotta underline block mt-1"
                                                >
                                                    {t(
                                                        "storeLocator.visitWebsite"
                                                    )}
                                                </a>
                                            )}

>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c
                                        </div>
                                    </Popup>

                                </CircleMarker>
                            );
                        })}

                    </MapContainer>

<<<<<<< HEAD
                    {/* الكارت العائم */}
=======
                    {/* Floating Partner Card */}

>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c
                    {selectedPartner && (
                        <div className="absolute top-10 right-10 z-[1000] w-full max-w-xs pointer-events-auto">

                            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-2xl">

                                {/* Partner Logo */}

                                {selectedPartner.logo && (
                                    <img
                                        src={selectedPartner.logo}
                                        alt="Logo"
                                        className="w-16 h-16 object-contain mb-4 rounded-lg bg-background p-1"
                                    />
                                )}
<<<<<<< HEAD
                                <h4 className="font-bold text-primary text-lg mb-1">
                                    {getPartnerName(selectedPartner.name)}
                                </h4>

                                {/* عرض المسافة بالكيلومتر إذا تم حسابها */}
                                {selectedPartner.distance && (
                                    <p className="text-xs text-accent-terracotta font-bold mb-3">
                                        يبعد عنك حوالي {selectedPartner.distance} كم
                                    </p>
                                )}
=======

                                {/* Partner Name */}

                                <h4 className="font-bold text-primary text-lg mb-2">
                                    {getPartnerName(
                                        selectedPartner.name
                                    )}
                                </h4>

                                {/* Partner Status */}
>>>>>>> 6b0dec191e1e6789d71b3a886bd9ed76dbff065c

                                <div className="flex items-center gap-3 mb-6">

                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            selectedPartner.status ===
                                            "active"
                                                ? "bg-primary animate-pulse"
                                                : "bg-gray-400"
                                        }`}
                                    />

                                    <span className="text-xs font-bold text-primary">
                                        {t("storeLocator.status")}:{" "}
                                        {selectedPartner.status ||
                                            t(
                                                "storeLocator.available"
                                            )}
                                    </span>

                                </div>

                                {/* Directions */}

                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPartner.lat},${selectedPartner.lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors"
                                >

                                    <span className="material-symbols-outlined text-[20px]">
                                        directions
                                    </span>

                                    <span>
                                        {t(
                                            "storeLocator.directions"
                                        )}
                                    </span>

                                </a>

                            </div>

                        </div>
                    )}

                </div>

            </div>
        </section>
    );
}