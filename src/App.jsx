import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { CartProvider } from "./context/CartContext";

import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/site/Home";
import Cart from "./pages/site/Cart";
import OrderSuccess from "./pages/site/OrderSuccess";

import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Pos from "./pages/admin/Pos";

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
            <Route path="/cart" element={<Cart />} />
            <Route path="/OrderSuccess" element={<OrderSuccess />} />
          </Route>

          {/* ==================== Admin ==================== */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="pos" element={<Pos />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}