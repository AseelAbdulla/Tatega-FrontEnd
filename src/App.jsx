import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/site/Home";
import Cart from "./pages/site/Cart";
import OrderSuccess from "./pages/site/OrderSuccess";

import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
export default function App() {
    return (
        <Router>
            <LanguageProvider>

                <Routes>

                    {/* ==================== Site ==================== */}

                    <Route element={<SiteLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route
                            path="/OrderSuccess"
                            element={<OrderSuccess />}
                        />
                    </Route>


                    {/* ==================== Admin ==================== */}

                    <Route path="/admin" element={<AdminLayout />}>

                        <Route index element={<Dashboard />} />

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

            </LanguageProvider>
        </Router>
    );
}