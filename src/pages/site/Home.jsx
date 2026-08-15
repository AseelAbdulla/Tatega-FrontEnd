import { useTranslation } from "react-i18next";
// import HeroCarousel from '../../components/site/HeroCarousel';
// import BestSellersSection from '../../components/site/BestSellersSection';
// import CategoriesGrid from '../../components/site/CategoriesGrid';
// import WhyUsTimeline from '../../components/site/WhyUsTimeline';
import StoreLocator from '../../components/site/StoreLocator';
// import TestimonialsCarousel from '../../components/site/TestimonialsCarousel';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      {/* <HeroCarousel />
      <BestSellersSection />
      <CategoriesGrid />
      <WhyUsTimeline /> */}
      <StoreLocator />
      {/* <TestimonialsCarousel /> */}
    </div>
  );
}

