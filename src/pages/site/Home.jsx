import StoreLocator from '../../components/site/StoreLocator';
import Reviews from "../../components/site/Reviews";
import BestSell from "../../components/site/BestSell";
import HomeCategories from "../../components/site/HomeCategories";
import HomeFeatures from "../../components/site/HomeFeatures";
import FeaturedProducts from "../../components/site/FeaturedProducts";

export default function Home() {

  return (
    <div>
      <BestSell />
      <HomeCategories />
      <HomeFeatures />
     <FeaturedProducts />

      {/* Store Locator */}
      <StoreLocator />
      <Reviews />

    </div>
  );
}