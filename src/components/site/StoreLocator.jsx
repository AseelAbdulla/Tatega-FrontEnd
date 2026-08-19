import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    useMap,
} from "react-leaflet";

import { partnerService } from "../../services/partnerService";

// دالة حساب المسافة بالـ كم (Haversine Formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// مكون مساعد لإعادة توجيه كاميرا الخريطة نحو الفرع المحدد
function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView(coords, 13);
    return null;
}

export default function StoreLocator() {
    const { t, i18n } = useTranslation();

    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locating, setLocating] = useState(false); // حالة التحديد اليدوي

    /*
    |--------------------------------------------------------------------------
    | Select Partner & Update Cookie
    |--------------------------------------------------------------------------
    */
    const handleSelectPartner = (partner) => {
        setSelectedPartner(partner);
        Cookies.set("nearest_partner_id", partner.id, {
            expires: 30,
            path: "/",
            sameSite: "lax",
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Manual Trigger: Locate Nearest Branch
    |--------------------------------------------------------------------------
    */
    const handleLocateNearest = () => {
        if (!navigator.geolocation) {
            alert(t("storeLocator.gpsNotSupported") || "المتصفح لا يدعم تحديد الموقع");
            return;
        }

        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                let closestPartner = partners[0];
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
                        closestPartner = partner;
                    }
                });

                if (closestPartner) {
                    handleSelectPartner(closestPartner);
                }
                setLocating(false);
            },
            (error) => {
                console.warn("GPS Error:", error.message);
                alert(t("storeLocator.gpsError") || "تعذر الوصول لموقعك الجغرافي");
                setLocating(false);
            },
            { timeout: 7000 }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Initial Data Fetch & Automatic GPS Check
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        partnerService
            .getPublicPartners()
            .then((data) => {
                const validPartners = data.filter(
                    (partner) => partner.lat && partner.lng
                );

                setPartners(validPartners);

                if (validPartners.length > 0) {
                    const savedPartnerId = Cookies.get("nearest_partner_id");
                    const cookiePartner = validPartners.find(
                        (p) => p.id === Number(savedPartnerId)
                    );

                    let initialPartner = cookiePartner || validPartners[0];
                    setSelectedPartner(initialPartner);

                    // فحص تلقائي خفيف عند أول زيارة
                    if (navigator.geolocation && !cookiePartner) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const userLat = position.coords.latitude;
                                const userLng = position.coords.longitude;

                                let closestPartner = validPartners[0];
                                let minDistance = Infinity;

                                validPartners.forEach((partner) => {
                                    const dist = calculateDistance(
                                        userLat,
                                        userLng,
                                        parseFloat(partner.lat),
                                        parseFloat(partner.lng)
                                    );
                                    if (dist < minDistance) {
                                        minDistance = dist;
                                        closestPartner = partner;
                                    }
                                });

                                if (closestPartner.id !== initialPartner.id) {
                                    handleSelectPartner(closestPartner);
                                }
                            },
                            null,
                            { timeout: 5000 }
                        );
                    }
                }
            })
            .catch((err) => console.error("Error fetching partners:", err))
            .finally(() => setLoading(false));
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Get Localized Partner Name
    |--------------------------------------------------------------------------
    */
    const getPartnerName = (name) => {
        if (!name) return t("storeLocator.defaultBranch");

        const currentLang = i18n.language?.startsWith("en") ? "en" : "ar";

        if (typeof name === "object") {
            return (
                name[currentLang] ||
                name.ar ||
                name.en ||
                t("storeLocator.defaultBranch")
            );
        }

        if (typeof name === "string") {
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
                return name;
            }
            return name;
        }

        return t("storeLocator.defaultBranch");
    };

    if (loading) {
        return (
            <div className="py-16 text-center text-primary font-bold">
                {t("storeLocator.loading")}
            </div>
        );
    }

    const defaultPosition = selectedPartner
        ? [parseFloat(selectedPartner.lat), parseFloat(selectedPartner.lng)]
        : [24.7136, 46.6753];

    return (
        <section className="py-16 bg-surface-container/50" id="parteners">
            <div className="px-4 md:px-16 max-w-7xl mx-auto">
                {/* Heading & Locate Button */}
                <div className="text-center mb-8">
                    <span className="text-accent-terracotta font-bold text-xs mb-2 block uppercase">
                        {t("storeLocator.label")}
                    </span>
                    <h2 className="text-3xl font-bold text-primary mb-6">
                        {t("storeLocator.title")}
                    </h2>

                    {/* 📍 زر تحديد أقرب فرع لي */}
                    <button
                        onClick={handleLocateNearest}
                        disabled={locating}
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-2xl font-bold text-xs hover:bg-accent-hover transition-all shadow-md disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">
                            {locating ? "sync" : "my_location"}
                        </span>
                        <span>
                            {locating
                                ? t("storeLocator.locating") 
                                : t("storeLocator.locateMe") }
                        </span>
                    </button>
                </div>

                {/* Map Container */}
                <div
                    className="relative rounded-[3rem] overflow-hidden rustic-shadow border border-black/10 z-0"
                    style={{ height: "500px", width: "100%" }}
                >
                    <MapContainer
                        center={defaultPosition}
                        zoom={13}
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

                        {partners.map((partner) => {
                            const isSelected = selectedPartner?.id === partner.id;

                            return (
                                <CircleMarker
                                    key={partner.id}
                                    center={[
                                        parseFloat(partner.lat),
                                        parseFloat(partner.lng),
                                    ]}
                                    radius={isSelected ? 10 : 6}
                                    pathOptions={{
                                        color: isSelected ? "#F07A26" : "#24572b",
                                        fillColor: isSelected ? "#F07A26" : "#24572b",
                                        fillOpacity: isSelected ? 0.9 : 0.6,
                                        weight: isSelected ? 2 : 1,
                                    }}
                                    eventHandlers={{
                                        click: () => handleSelectPartner(partner),
                                    }}
                                >
                                    <Popup>
                                        <div className="text-right p-1">
                                            <h4 className="font-bold text-primary">
                                                {getPartnerName(partner.name)}
                                            </h4>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        })}
                    </MapContainer>

                    {/* Floating Partner Card */}
                    {selectedPartner && (
                        <div className="absolute top-10 right-10 z-[1000] w-full max-w-xs pointer-events-auto">
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
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPartner.lat},${selectedPartner.lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        directions
                                    </span>
                                    <span>{t("storeLocator.directions")}</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

