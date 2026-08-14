
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import Home from './pages/site/Home';
import Cart from './pages/site/Cart';
import OrderSuccess from './pages/site/OrderSuccess';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
        <CartProvider>
    <Router>
        <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/OrderSuccess" element={<OrderSuccess />} />
        </Route>
        </Routes>
    </Router>
    </CartProvider>
  );
}
