import StoreLocator from '../../components/site/StoreLocator';
import Reviews from "../../components/site/Reviews";
import BestSell from "../../components/site/BestSell";
import HomeCategories from "../../components/site/HomeCategories";
import HomeFeatures from "../../components/site/HomeFeatures";
export default function Home() {

  return (
    <div>
      <BestSell />
      <HomeCategories />
      <HomeFeatures />
    
      {/* Store Locator */}
      <StoreLocator />
      <Reviews />

    </div>
  );
}