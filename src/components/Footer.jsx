import { Link } from 'react-router-dom';
import { SITE, CATEGORY_SLUGS } from '../config';
import './site.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__col site-footer__col--brand">
          <span className="site-footer__name">
            Florence<em>Dolls</em>
          </span>
          <p className="site-footer__tagline">
            Genuine reborn dolls, Arias &amp; Llorens collectables and boutique accessories, from a small UK family business.
          </p>
          <div className="site-footer__contact">
            <a className="site-footer__contact-link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a className="site-footer__contact-link" href={`tel:${SITE.phoneIntl}`}>{SITE.phone}</a>
          </div>
        </div>

        <div className="site-footer__col">
          <h4 className="site-footer__heading">Shop</h4>
          <ul className="site-footer__list">
            <li><Link to={`/shop/${CATEGORY_SLUGS.rebornDolls}`}>Reborn Dolls</Link></li>
            <li><Link to={`/shop/${CATEGORY_SLUGS.prams}`}>Prams &amp; Pushchairs</Link></li>
            <li><Link to={`/shop/${CATEGORY_SLUGS.furniture}`}>Doll Furniture</Link></li>
            <li><Link to={`/shop/${CATEGORY_SLUGS.accessories}`}>Doll Accessories</Link></li>
            <li><Link to="/new-arrivals">New Arrivals</Link></li>
            <li><Link to="/sale">Sale</Link></li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4 className="site-footer__heading">Discover</h4>
          <ul className="site-footer__list">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/brand/arias">Arias</Link></li>
            <li><Link to="/brand/llorens">Llorens</Link></li>
            <li><Link to="/our-commitments">Our Commitments</Link></li>
            <li><Link to="/blog">Journal</Link></li>
            <li><Link to="/trade-account">Trade Accounts</Link></li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4 className="site-footer__heading">Help &amp; Policies</h4>
          <ul className="site-footer__list">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/shipping-delivery">Shipping &amp; Delivery</Link></li>
            <li><Link to="/returns-policy">Returns Policy</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <p className="site-footer__copyright">
            &copy; {year} {SITE.brand}. All rights reserved. Registered Company No. {SITE.companyNo}. All stock held in the UK.
          </p>
          <p className="site-footer__credit">
            Designed with <span aria-hidden="true" className="site-footer__credit-heart">&hearts;</span> by <a href="https://websitelift.co.uk/" target="_blank" rel="noopener noreferrer">WebsiteLift</a>
          </p>
        </div>
      </div>
    </footer>
  );
}