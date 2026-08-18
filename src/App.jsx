import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";

// Site Pages
import Home from "./pages/site/Home";
import Products from "./pages/site/Products";
import ProductDetails from "./pages/site/ProductDetails";
import Cart from "./pages/site/Cart";
import OrderSuccess from "./pages/site/OrderSuccess";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
<<<<<<< Updated upstream
import Products from "./pages/admin/Products";
export default function App() {
    return (
        <Router>
            <LanguageProvider>

                <Routes>

                    {/* ==================== Site ==================== */}
=======
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

                <Routes>

                    {/* ================= SITE ================= */}
>>>>>>> Stashed changes

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


<<<<<<< Updated upstream
                    {/* ==================== Admin ==================== */}

                    <Route path="/admin" element={<AdminLayout />}>

                        <Route index element={<Dashboard />} />
=======
                    {/* ================= ADMIN ================= */}

                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >

                        <Route
                            index
                            element={<Dashboard />}
                        />
>>>>>>> Stashed changes

                        <Route
                            path="categories"
                            element={<Categories />}
                        />
<<<<<<< Updated upstream
                   <Route
    path="products"
    element={<Products />}
/>
=======

                        <Route
                            path="products"
                            element={<AdminProducts />}
                        />

>>>>>>> Stashed changes
                    </Route>

                </Routes>

<<<<<<< Updated upstream
            </LanguageProvider>
        </Router>
=======
            </Router>

        </CartProvider>
>>>>>>> Stashed changes
    );
}