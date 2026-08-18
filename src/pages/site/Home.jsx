import BannerCarousel from "../../components/site/BannerCarousel";
import HomeFeatures from "../../components/site/HomeFeatures";
import StoreLocator from "../../components/site/StoreLocator";
import Reviews from "../../components/site/Reviews";

export default function Home() {
    return (
        <div>
            <BannerCarousel />

            <HomeFeatures />

            <StoreLocator />

            <Reviews />
        </div>
    );
}