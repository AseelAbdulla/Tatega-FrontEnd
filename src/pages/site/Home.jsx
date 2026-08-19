import BannerCarousel from "../../components/site/BannerCarousel";
import HomeFeatures from "../../components/site/HomeFeatures";
import FeaturedProducts from "../../components/site/FeaturedProducts";
import StoreLocator from "../../components/site/StoreLocator";
import Reviews from "../../components/site/Reviews";

export default function Home() {
    return (
        <div>
            {/* =========================
                Banner
            ========================== */}
            <BannerCarousel />

            {/* =========================
                Features
            ========================== */}
            <HomeFeatures />

            {/* =========================
                Featured Products
            ========================== */}
            <FeaturedProducts />

            {/* =========================
                Store Locator
            ========================== */}
            <StoreLocator />

            {/* =========================
                Reviews
            ========================== */}
            <Reviews />
        </div>
    );
}