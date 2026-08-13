
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import SiteLayout from './layouts/SiteLayout';
import Home from './pages/site/Home';
import Cart from './pages/site/Cart';
import OrderSuccess from './pages/site/OrderSuccess';

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/OrderSuccess" element={<OrderSuccess />} />
        </Route>
        </Routes>
      </LanguageProvider>
    </Router>
  );
}
