import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // إضافة استيراد Link

import StoreLocator from '../../components/site/StoreLocator';
import BannerCarousel from "../../components/site/BannerCarousel";
import Reviews from "../../components/site/Reviews";
import BestSell from "../../components/site/BestSell";
import HomeFeatures from "../../components/site/HomeFeatures";
import FeaturedProducts from "../../components/site/FeaturedProducts";

export default function Home() {

  return (
    <div>
      <BannerCarousel />

      <BestSell />
      <HomeFeatures />
     <FeaturedProducts />

      {/* Store Locator */}
      <StoreLocator />
      <Reviews />

    </div>
  );
}