import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { CartProvider } from "./context/CartContext";

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
import Reviews from "./pages/site/Reviews";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Pos from "./pages/admin/Pos";
import Categories from "./pages/admin/Categories";
import Banners from "./pages/admin/Banners";
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
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";

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
                    {/* ==================== Site ==================== */}
                    <Route element={<SiteLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/OrderSuccess" element={<OrderSuccess />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/reviews" element={<Reviews />} />
                    </Route>

                    {/* ==================== Admin ==================== */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="content" element={<Banners />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="pos" element={<Pos />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="roles" element={<Roles />} />
                        <Route path="users" element={<Users />} />
                        <Route path="users/:id" element={<UserDetails />} />
                        <Route path="users/:id/address" element={<Address />} />
                        <Route path="users/:id/edit" element={<UserEdit />} />
                        <Route path="customers/international" element={<InternationalImport />} />
                        <Route path="customers/local" element={<LocalCustomers />} />
                        <Route path="order-history" element={<OrderHistory />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="payment-methods" element={<PaymentMethods />} />
                        <Route path="profile/password" element={<Password />} />
                    </Route>
                </Routes>
            </Router>
        </CartProvider>
    );
}