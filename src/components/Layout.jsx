import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import Toast from './Toast';
import { ShopProvider } from '../context/ShopContext';
import './site.css';

export default function Layout({ children }) {
  return (
    <ShopProvider>
      <div className="site">
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
        <BackToTop />
        <Toast />
      </div>
    </ShopProvider>
  );
}