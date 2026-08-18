import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { CartProvider } from "./context/CartContext";

import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";

// Site Pages
import Home from "./pages/site/Home";
import Cart from "./pages/site/Cart";
import OrderSuccess from "./pages/site/OrderSuccess";
import Register from "./pages/site/Register";
import Login from "./pages/site/Login";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
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
        const lang = i18n.language?.startsWith("en") ? "en" : "ar";

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }, [i18n.language]);

    return (
        <CartProvider>
            <Router>
                <Routes>

                    {/* =========================
                        صفحات الموقع
                    ========================= */}
                    <Route element={<SiteLayout />}>

                        {/* الرئيسية */}
                        <Route
                            path="/"
                            element={<Home />}
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

                        {/* تسجيل حساب */}
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


                    {/* =========================
                        صفحات لوحة التحكم
                    ========================= */}
                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >

                        {/* /admin */}
                        <Route
                            index
                            element={<Dashboard />}
                        />
                        <Route
    path="/admin/profile"
    element={<Profile />}
/>
<Route
    path="/admin/payment-methods"
    element={<PaymentMethods />}
/>
<Route
    path="/admin/profile/password"
    element={<Password />}
/>

                        {/* /admin/categories */}
                        <Route
                            path="categories"
                            element={<Categories />}
                        />

                        {/* /admin/products */}
                        <Route
                            path="products"
                            element={<Products />}
                        />
                        <Route
    path="roles"
    element={<Roles />}
    
/>
<Route
    path="users"
    element={<Users />}
/>

<Route
    path="users/:id"
    element={<UserDetails />}
/>
<Route
    path="users/:id/address"
    element={<Address />}
/>
<Route
    path="/admin/users/:id/edit"
    element={<UserEdit />}
/>
<Route
 path="customers/international" 
 element={<InternationalImport />}
  />
  <Route
    path="customers/local"
    element={<LocalCustomers />}
/>
<Route
    path="/admin/order-history"
    element={<OrderHistory />}
/>

                    </Route>

                </Routes>
            </Router>
        </CartProvider>
    );
}