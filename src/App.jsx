import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import Brand from './pages/Brand';
import NewArrivals from './pages/NewArrivals';
import Sale from './pages/Sale';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import OurCommitments from './pages/OurCommitments';
import TradeAccount from './pages/TradeAccount';
import Privacy from './pages/PrivacyPolicy';
import Terms from './pages/TermsConditions';
import Returns from './pages/ReturnsPolicy';
import Shipping from './pages/ShippingDelivery';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CheckoutRedirect from './pages/CheckoutRedirect';
import NotFound from './pages/NotFound';
import Basket from './pages/Basket';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Search from './pages/Search';
import Layout from './components/Layout';

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/brand/:brand" element={<Brand />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/our-commitments" element={<OurCommitments />} />
        <Route path="/trade-account" element={<TradeAccount />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/returns-policy" element={<Returns />} />
        <Route path="/shipping-delivery" element={<Shipping />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Basket />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart-wp" element={<CheckoutRedirect mode="cart" />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}