import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    useMap,
} from "react-leaflet";

import { partnerService } from "../../services/partnerService";

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

    /*
    |--------------------------------------------------------------------------
    | Get Partners
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        partnerService
            .getPublicPartners()
            .then((data) => {
                // تصفية الفروع التي تحتوي على إحداثيات صحيحة فقط
                const validPartners = data.filter(
                    (partner) => partner.lat && partner.lng
                );

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

    /*
    |--------------------------------------------------------------------------
    | Get Localized Partner Name
    |--------------------------------------------------------------------------
    */

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

                {/* Section Heading */}

                <div className="text-center mb-12">

                    <span className="text-accent-terracotta font-bold text-xs mb-4 block uppercase">
                        {t("storeLocator.label")}
                    </span>

                    <h2 className="text-3xl font-bold text-primary mb-6">
                        {t("storeLocator.title")}
                    </h2>

                </div>

                {/* Map Container */}

                <div
                    className="relative rounded-[3rem] overflow-hidden rustic-shadow border border-black/10 z-0"
                    style={{
                        height: "500px",
                        width: "100%",
                    }}
                >

                    {/* Leaflet Map */}

                    <MapContainer
                        center={defaultPosition}
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
                            <ChangeMapView
                                coords={[
                                    parseFloat(selectedPartner.lat),
                                    parseFloat(selectedPartner.lng),
                                ]}
                            />
                        )}

                        {/* Partner Markers */}

                        {partners.map((partner) => {
                            const isSelected =
                                selectedPartner?.id === partner.id;

                            return (
                                <CircleMarker
                                    key={partner.id}
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
                                    }}
                                    eventHandlers={{
                                        click: () =>
                                            setSelectedPartner(partner),
                                    }}
                                >

                                    {/* Popup */}

                                    <Popup>
                                        <div className="text-right p-1">

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

                                {/* Partner Logo */}

                                {selectedPartner.logo && (
                                    <img
                                        src={selectedPartner.logo}
                                        alt="Logo"
                                        className="w-16 h-16 object-contain mb-4 rounded-lg bg-background p-1"
                                    />
                                )}

                                {/* Partner Name */}

                                <h4 className="font-bold text-primary text-lg mb-2">
                                    {getPartnerName(
                                        selectedPartner.name
                                    )}
                                </h4>

                                {/* Partner Status */}

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