import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";

// Layouts
import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";

// Site Pages
import Home from "./pages/site/Home";
import Products from "./pages/site/Products";
import ProductDetails from "./pages/site/ProductDetails";
import Cart from "./pages/site/Cart";
import OrderSuccess from "./pages/site/OrderSuccess";
import Register from "./pages/site/Register";
import Login from "./pages/site/Login";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import AdminProducts from "./pages/admin/Products";
import Roles from "./pages/admin/Roles";
import Users from "./pages/admin/Users";
import UserDetails from "./pages/admin/UserDetails";
import Address from "./pages/admin/Address";
import UserEdit from "./pages/admin/UserEdit";
import InternationalImport from "./pages/admin/InternationalImport";
import LocalCustomers from "./pages/admin/LocalCustomers";
import OrderHistory from "./pages/admin/OrderHistory";
import Profile from "./pages/admin/Profile";
import PaymentMethods from "./pages/admin/PaymentMethods";
import Password from "./pages/admin/Password";

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

                            {/* المنتجات */}
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

                            {/* تسجيل الحساب */}
                            <Route
                                path="/register"
                                element={<Register />}
                            />

                            {/* تسجيل الدخول */}
                            <Route
                                path="/login"
                                element={<Login />}
                            />

                        </Route>


                        {/* ==================== Admin ==================== */}

                        <Route
                            path="/admin"
                            element={<AdminLayout />}
                        >

                            {/* Dashboard */}
                            <Route
                                index
                                element={<Dashboard />}
                            />

                            {/* Categories */}
                            <Route
                                path="categories"
                                element={<Categories />}
                            />

                            {/* Products */}
                            <Route
                                path="products"
                                element={<AdminProducts />}
                            />

                            {/* Roles */}
                            <Route
                                path="roles"
                                element={<Roles />}
                            />

                            {/* Users */}
                            <Route
                                path="users"
                                element={<Users />}
                            />

                            {/* User Details */}
                            <Route
                                path="users/:id"
                                element={<UserDetails />}
                            />

                            {/* User Address */}
                            <Route
                                path="users/:id/address"
                                element={<Address />}
                            />

                            {/* Edit User */}
                            <Route
                                path="users/:id/edit"
                                element={<UserEdit />}
                            />

                            {/* International Customers */}
                            <Route
                                path="customers/international"
                                element={<InternationalImport />}
                            />

                            {/* Local Customers */}
                            <Route
                                path="customers/local"
                                element={<LocalCustomers />}
                            />

                            {/* Order History */}
                            <Route
                                path="order-history"
                                element={<OrderHistory />}
                            />

                            {/* Profile */}
                            <Route
                                path="profile"
                                element={<Profile />}
                            />

                            {/* Payment Methods */}
                            <Route
                                path="payment-methods"
                                element={<PaymentMethods />}
                            />

                            {/* Password */}
                            <Route
                                path="profile/password"
                                element={<Password />}
                            />

                        </Route>

                    </Routes>

                </LanguageProvider>
            </Router>
        </CartProvider>
    );
}