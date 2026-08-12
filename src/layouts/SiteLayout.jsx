
import { Outlet } from 'react-router-dom';
import Navbar from '../components/site/Navbar';
import Footer from '../components/site/Footer';
import BottomNavBar from '../components/site/BottomNavBar';

export default function SiteLayout() {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-background text-on-surface">
            <Navbar />
            <main className="grow">
                <Outlet />
            </main>
            <Footer />
            <BottomNavBar />
        </div>
    );
}
