import { SITE } from '../config';

const BASE = SITE.canonical;

const meta = (path, title, description) => ({
  path,
  title,
  description,
  url: `${BASE}${path}`,
});

export default {
  home: meta(
    '/',
    'Florence Dolls | Reborn Baby Dolls, Arias & Llorens | UK',
    'Genuine reborn baby dolls, Arias & Llorens collectables and boutique doll accessories, with love from a small UK family business. Fast 2\u20133 day delivery.'
  ),
  about: meta(
    '/about',
    'About Us | Florence Dolls',
    'Meet the family behind Florence Dolls \u2014 a small UK business bringing genuine reborn dolls, Arias and Llorens pieces, and thoughtful accessories to loving homes.'
  ),
  rebornDolls: meta(
    '/shop/reborn-dolls',
    'Reborn Baby Dolls | Genuine Arias & Llorens | Florence Dolls',
    'Browse our range of genuine reborn baby dolls, lovingly sourced from Arias and Llorens. Real UK stock, careful packaging and fast delivery across Britain.'
  ),
  prams: meta(
    '/shop/doll-prams-and-pushchairs',
    'Doll Prams & Pushchairs | Florence Dolls UK',
    'Quality doll prams and pushchairs to keep your reborn doll comfortable on every outing. Sturdy, well-built and delivered quickly across the UK.'
  ),
  furniture: meta(
    '/shop/doll-furniture',
    'Doll Furniture | Cots, Seating & More | Florence Dolls',
    'Furnish your doll a little corner of the world with our doll furniture range \u2014 cots, seats and more, chosen for quality and dispatched across the UK.',
  ),
  accessories: meta(
    '/shop/doll-accessories',
    'Doll Accessories & Boutique Extras | Florence Dolls',
    'Little extras and boutique accessories to complete your doll collection \u2014 carrycots, coats and finishing touches, UK stock with fast delivery.'
  ),
  brandArias: meta(
    '/brand/arias',
    'Arias Dolls Collection | Florence Dolls',
    'The genuinely crafted Arias collection at Florence Dolls \u2014 heirloom-quality pieces you can pass on, held in UK stock and delivered with care.'
  ),
  brandLlorens: meta(
    '/brand/llorens',
    'Llorens Dolls & Accessories | Florence Dolls',
    'Explore the Llorens collection at Florence Dolls \u2014 beloved dolls, carrycots and accessories crafted for play and delight, UK stock with fast delivery.'
  ),
  newArrivals: meta(
    '/new-arrivals',
    'New Arrivals | Fresh Pieces at Florence Dolls',
    'Freshest pieces at Florence Dolls \u2014 the newest reborn dolls, Arias and Llorens finds, prams and accessories as they arrive in the shop.'
  ),
  sale: meta(
    '/sale',
    'Sale | Reduced Pieces | Florence Dolls',
    'A gentle space to save on genuine reborn dolls, Arias and Llorens pieces. UK-held, fairly reduced and delivered quickly across the country.'
  ),
  blog: meta(
    '/blog',
    'Journal & Little Notes | Florence Dolls',
    'Notes, care guides and gentle stories from Florence Dolls \u2014 a place for doll lovers to read, learn and settle their new pieces into home.'
  ),
  contact: meta(
    '/contact',
    'Contact Us | Florence Dolls',
    'Write to Florence Dolls with an order question, a care enquiry, or simply to say hello. A warm UK family line ready to help.'
  ),
  commitments: meta(
    '/our-commitments',
    'Our Commitments | Florence Dolls',
    'The promises Florence Dolls keeps \u2014 authentic stock, fair pricing, fast UK delivery and a warm family service on every order. Read the way we serve.'
  ),
  trade: meta(
    '/trade-account',
    'Open a Trade Account | Florence Dolls Wholesale',
    'Wholesale and trade terms on genuine reborn dolls and Arias / Llorens pieces with Florence Dolls. A trusted UK partner for shops and collectors.'
  ),
  privacy: meta(
    '/privacy-policy',
    'Privacy Policy | Florence Dolls',
    'How Florence Dolls (Company No. 17166512) collects, uses and keeps your personal information safe, set out in clear why it matters detail.',
  ),
  terms: meta(
    '/terms-and-conditions',
    'Terms & Conditions | Florence Dolls',
    'The fair terms on which Florence Dolls trades \u2014 ordering, delivery, rights and company details written in clear words.'
  ),
  returns: meta(
    '/returns-policy',
    'Returns & Refund Policy | Florence Dolls',
    'Your 14-day right to cancel and return with Florence Dolls \u2014 how to send a piece back, and how refunds work, in plain, fair terms.'
  ),
  shipping: meta(
    '/shipping-delivery',
    'Shipping & Delivery | Florence Dolls UK',
    'How quickly your Florence Dolls piece arrives \u2014 all UK stock, a fast 2\u20133 day delivery and secure order tracking from the door to yours.'
  ),
  success: meta(
    '/checkout/success',
    'Thank You | Order Confirmed | Florence Dolls',
    'Your Florence Dolls order is confirmed. We are preparing your piece \u2014 expect a friendly note and your lovely delivery in the coming days.'
  ),
};