import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";

import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";

// ==================== Site Pages ====================
import Home from "./pages/site/Home";
import Products from "./pages/site/Products";
import ProductDetails from "./pages/site/ProductDetails";
import Cart from "./pages/site/Cart";
import OrderSuccess from "./pages/site/OrderSuccess";

// ==================== Admin Pages ====================
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import AdminProducts from "./pages/admin/Products";

export default function App() {
    const { i18n } = useTranslation();

    useEffect(() => {
        const lang = i18n.language?.startsWith("en")
            ? "en"
            : "ar";

        document.documentElement.lang = lang;
        document.documentElement.dir =
            lang === "ar" ? "rtl" : "ltr";
    }, [i18n.language]);

    return (
        <CartProvider>
            <Router>
                <LanguageProvider>

                    <Routes>

                        {/* ==================== Site ==================== */}

                        <Route element={<SiteLayout />}>

                            {/* الرئيسية */}
                            <Route
                                path="/"
                                element={<Home />}
                            />

                            {/* صفحة المنتجات */}
                            <Route
                                path="/products"
                                element={<Products />}
                            />

                            {/* تفاصيل المنتج */}
                            <Route
                                path="/products/:id"
                                element={<ProductDetails />}
                            />

                            {/* السلة */}
                            <Route
                                path="/cart"
                                element={<Cart />}
                            />

                            {/* نجاح الطلب */}
                            <Route
                                path="/OrderSuccess"
                                element={<OrderSuccess />}
                            />

                        </Route>


                        {/* ==================== Admin ==================== */}

                        <Route
                            path="/admin"
                            element={<AdminLayout />}
                        >

                            <Route
                                index
                                element={<Dashboard />}
                            />

                            <Route
                                path="categories"
                                element={<Categories />}
                            />

                            <Route
                                path="products"
                                element={<AdminProducts />}
                            />

                        </Route>

                    </Routes>

                </LanguageProvider>
            </Router>
        </CartProvider>
    );
}