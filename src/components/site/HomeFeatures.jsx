import { useTranslation } from "react-i18next";

const features = [
  {
    key: "premiumQuality",
    centerIcon: "verified",
    sideIcon: "workspace_premium",
    color: "green",
  },
  {
    key: "carefullySelected",
    centerIcon: "psychology",
    sideIcon: "pan_tool",
    color: "orange",
  },
  {
    key: "naturalIngredients",
    centerIcon: "eco",
    sideIcon: "potted_plant",
    color: "green",
  },
  {
    key: "trustedCustomers",
    centerIcon: "star",
    sideIcon: "groups",
    color: "orange",
  },
  {
    key: "fastDelivery",
    centerIcon: "local_shipping",
    sideIcon: "speed",
    color: "green",
  },
  {
    key: "secureShopping",
    centerIcon: "lock",
    sideIcon: "security",
    color: "orange",
  },
];

function HomeFeatures() {
  const { t } = useTranslation();

  return (
    <section
      id="why"
      className="py-20 px-4 md:px-16 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-[#F07A26] font-bold tracking-widest text-xs mb-4 block uppercase">
            {t("homeFeatures.label")}
          </span>

          <h2 className="font-bold text-3xl md:text-4xl text-[#24572B] mb-6">
            {t("homeFeatures.title")}
          </h2>

          <div className="w-24 h-1 bg-[#F07A26] mx-auto rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Central Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#24572B]/10 -translate-x-1/2 hidden md:block" />

          <div className="space-y-24 md:space-y-32">

            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              const isGreen = feature.color === "green";

              return (
                <div
                  key={feature.key}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-0 group ${
                    !isEven ? "md:flex-row-reverse" : ""
                  }`}
                >

                  {/* Text */}
                  <div
                    className={`md:w-1/2 ${
                      isEven
                        ? "md:pr-16 text-center md:text-right"
                        : "md:pl-16 text-center md:text-left"
                    }`}
                  >
                    <h3 className="font-bold text-xl md:text-2xl text-[#24572B] mb-4">
                      {t(
                        `homeFeatures.features.${feature.key}.title`
                      )}

                      <span className="block text-xs text-[#F07A26] mt-1">
                        {t(
                          `homeFeatures.features.${feature.key}.english`
                        )}
                      </span>
                    </h3>

                    <p className="text-[#414940] leading-relaxed">
                      {t(
                        `homeFeatures.features.${feature.key}.description`
                      )}
                    </p>
                  </div>

                  {/* Center Circle */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-2 items-center justify-center z-10 hidden md:flex ${
                      isGreen
                        ? "border-[#24572B]"
                        : "border-[#F07A26]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        isGreen
                          ? "text-[#24572B]"
                          : "text-[#F07A26]"
                      }`}
                    >
                      {feature.centerIcon}
                    </span>
                  </div>

                  {/* Side Icon */}
                  <div
                    className={`md:w-1/2 ${
                      isEven
                        ? "md:pl-16"
                        : "md:pr-16 flex justify-end"
                    }`}
                  >
                    <div
                      className={`w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 ${
                        isGreen
                          ? "bg-[#24572B]/5"
                          : "bg-[#F07A26]/5"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-4xl md:text-6xl ${
                          isGreen
                            ? "text-[#24572B]"
                            : "text-[#F07A26]"
                        }`}
                      >
                        {feature.sideIcon}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeFeatures;