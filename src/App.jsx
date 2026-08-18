import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { CartProvider } from "./context/CartContext";

import Reviews from "./pages/site/Reviews";
import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";
import Banners from "./pages/admin/Banners";

import Home from "./pages/site/Home";
import Cart from "./pages/site/Cart";
import OrderSuccess from "./pages/site/OrderSuccess";

import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import Features from "./pages/admin/Features";

export default function App() {

    const { i18n } = useTranslation();

    useEffect(() => {
        const lang = i18n.language?.startsWith("en") ? "en" : "ar";

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }, [i18n.language]);

    return (
        <CartProvider>
            <Router>
                <Routes>

                    <Route element={<SiteLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/reviews" element={<Reviews />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route
                            path="/OrderSuccess"
                            element={<OrderSuccess />}
                        />
                    </Route>

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route
                         path="banners"
                         element={<Banners />}
                        />

                        <Route
                           path="features"
                           element={<Features />}
                        />

                        <Route
                            path="categories"
                            element={<Categories />}
                        />

                        <Route
                            path="products"
                            element={<Products />}
                        />
                    </Route>

                </Routes>
            </Router>
        </CartProvider>
    );
}