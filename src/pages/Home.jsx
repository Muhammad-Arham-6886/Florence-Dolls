import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import ProductGrid from '../components/ProductGrid';
import { CATEGORY_SLUGS, SITE } from '../config';
import { IMAGERY } from '../data/imagery';
import { fetchNewArrivals, fetchProductsByCategory } from '../lib/woo';
import './home.css';

const categoryCards = [
  {
    slug: CATEGORY_SLUGS.rebornDolls,
    name: 'Reborn Dolls',
    note: 'The heart of the house',
    image: IMAGERY.categories['reborn-dolls'],
  },
  {
    slug: CATEGORY_SLUGS.prams,
    name: 'Prams & Pushchairs',
    note: 'For daily adventures',
    image: IMAGERY.categories['doll-prams-and-pushchairs'],
  },
  {
    slug: CATEGORY_SLUGS.furniture,
    name: 'Doll Furniture',
    note: 'A corner of their own',
    image: IMAGERY.categories['doll-furniture'],
  },
  {
    slug: CATEGORY_SLUGS.accessories,
    name: 'Accessories & Extras',
    note: 'The finishing touches',
    image: IMAGERY.categories['doll-accessories'],
  },
];

const values = [
  {
    title: 'Kept close to home',
    text: 'Every piece lives in Britain rather than a distant warehouse, so your order can be packed at a moment\u2019s notice and reach you within our usual 2\u20133 day window.',
  },
  {
    title: 'Genuine, verified pieces',
    text: 'We carry only authentic Arias and Llorens creations. Our own hands check each one before it leaves, so the doll that arrives is the one you fell for \u2014 not a near-something.',
  },
  {
    title: 'An honest shelf',
    text: 'Buying directly and keeping our costs fair lets us offer prices that are neither dolled up nor padded. A lovely way to welcome a new piece without the premium.',
  },
  {
    title: 'A family at the till',
    text: 'You are writing to the family, not a call centre. Questions get a real answer, parcels are packed with care, and we truly celebrate every doll that leaves us.',
  },
];

const steps = [
  { title: 'Choose', text: 'Browse our tended shelf of genuine pieces \u2014 all held in UK stock.' },
  { title: 'We pack', text: 'Each order is checked, wrapped and handed to our courier with care.' },
  { title: 'It arrives', text: 'Tracked to your door within our usual 2\u20133 day delivery window.' },
];

const TAB_DEFS = [
  {
    key: 'new-arrivals',
    label: 'New Arrivals',
    link: '/new-arrivals',
    fetch: (opts) => fetchNewArrivals(opts),
  },
  {
    key: CATEGORY_SLUGS.rebornDolls,
    label: 'Reborn Dolls',
    link: `/shop/${CATEGORY_SLUGS.rebornDolls}`,
    fetch: (opts) => fetchProductsByCategory(CATEGORY_SLUGS.rebornDolls, opts),
  },
  {
    key: CATEGORY_SLUGS.prams,
    label: 'Prams & Pushchairs',
    link: `/shop/${CATEGORY_SLUGS.prams}`,
    fetch: (opts) => fetchProductsByCategory(CATEGORY_SLUGS.prams, opts),
  },
  {
    key: CATEGORY_SLUGS.furniture,
    label: 'Doll Furniture',
    link: `/shop/${CATEGORY_SLUGS.furniture}`,
    fetch: (opts) => fetchProductsByCategory(CATEGORY_SLUGS.furniture, opts),
  },
  {
    key: CATEGORY_SLUGS.accessories,
    label: 'Accessories & Extras',
    link: `/shop/${CATEGORY_SLUGS.accessories}`,
    fetch: (opts) => fetchProductsByCategory(CATEGORY_SLUGS.accessories, opts),
  },
];

export default function Home() {
  const [activeKey, setActiveKey] = useState(TAB_DEFS[0].key);
  const [tabData, setTabData] = useState({});
  const [loadingKey, setLoadingKey] = useState(null);

  const activeTab = TAB_DEFS.find((t) => t.key === activeKey);

  useEffect(() => {
    if (tabData[activeKey]) return undefined;
    let cancelled = false;
    setLoadingKey(activeKey);
    activeTab.fetch({ page: 1, perPage: 8 })
      .then((res) => {
        if (!cancelled) {
          setTabData((prev) => ({ ...prev, [activeKey]: { items: res.items, error: false } }));
          setLoadingKey((k) => (k === activeKey ? null : k));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTabData((prev) => ({ ...prev, [activeKey]: { items: null, error: true } }));
          setLoadingKey((k) => (k === activeKey ? null : k));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeKey]);

  const current = tabData[activeKey] || null;
  const tabProducts = current ? current.items : null;
  const tabError = current ? current.error : false;
  const tabLoading = !current && loadingKey === activeKey;

  return (
    <div className="home">
      <SEO {...SEO_META.home} />

      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">A small UK family business</p>
            <h1 className="hero__title">
              Reborn dolls, chosen to be <em>loved</em> for a very long time.
            </h1>
            <p className="hero__lead">
              From genuine reborn babies to cherished Arias and Llorens collectables, we gather a shelf of pieces we would be proud to give ourselves \u2014 domestic stock, honest prices, and a personal hand behind every order.
            </p>
            <div className="hero__actions">
              <Link to={`/shop/${CATEGORY_SLUGS.rebornDolls}`} className="btn btn-primary">
                Browse Reborn Dolls
              </Link>
              <Link to="/new-arrivals" className="btn btn-ghost">
                See New Arrivals
              </Link>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__frame">
              <img src={IMAGERY.hero} alt="A carefully crafted reborn doll from the Florence Dolls range" />
            </div>
            <div className="hero__medallion" aria-hidden="true">
              <span className="hero__medallion-word">Genuine</span>
              <span className="hero__medallion-word">Arias &amp; Llorens</span>
              <span className="hero__medallion-ring" />
            </div>
            <div className="hero__tile hero__tile--top">
              <span className="hero__tile-label">Held in the UK</span>
              <span className="hero__tile-value">{SITE.deliveryWindow}</span>
            </div>
          </div>
        </div>

        <div className="hero__stats">
          <div className="container hero__stats-inner">
            <div className="hero__stat">
              <span className="hero__stat-value">100%</span>
              <span className="hero__stat-label">Genuine stock</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">{SITE.deliveryWindow}</span>
              <span className="hero__stat-label">UK delivery</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">14 days</span>
              <span className="hero__stat-label">Returns window</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">1</span>
              <span className="hero__stat-label">Family at the till</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Category cards ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--centered">
            <p className="eyebrow eyebrow--center">Browse the shelves</p>
            <div className="section-head__ornament" aria-hidden="true">
              <span className="section-head__ornament-line" />
              <span className="section-head__ornament-dot" />
              <span className="section-head__ornament-line" />
            </div>
            <h2 className="section-head__title">Begin with a corner of our house</h2>
            <p className="section-head__text">
              Four softly tended collections, each held close at home in the UK and waiting to be admired.
            </p>
          </div>

          <div className="category-grid">
            {categoryCards.map((c, i) => (
              <Link key={c.slug} to={`/shop/${c.slug}`} className="category-card">
                <div className="category-card__media">
                  <span className="category-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <img src={c.image} alt={c.name} loading="lazy" />
                  <div className="category-card__shade" aria-hidden="true" />
                </div>
                <div className="category-card__body">
                  <span className="category-card__note">{c.note}</span>
                  <span className="category-card__name">{c.name}</span>
                  <span className="category-card__more">Explore the collection <span className="category-card__arrow">{'\u2192'}</span></span>
                </div>
              </Link>
            ))}
          </div>

          <div className="category-cta">
            <Link to="/shop" className="btn btn-ghost">Wander the whole house</Link>
          </div>
        </div>
      </section>

      {/* ---------- Why choose us ---------- */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">Why Florence</p>
            <h2 className="section-head__title">Small news, big care, and a doll in the house</h2>
            <p className="section-head__text">
              We are a family first and a shop second, which is why buying from us feels a little like being welcomed in.
            </p>
          </div>

          <div className="value-grid">
            {values.map((v, i) => (
              <div className="value-card" key={v.title}>
                <span className="value-card__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Featured products ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow">Fresh from the shelves</p>
              <h2 className="section-head__title">Newly arrived pieces</h2>
            </div>
          </div>

          <div className="home-tabs-row">
            <div className="home-tabs" role="tablist" aria-label="Shop by collection">
              {TAB_DEFS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeKey === tab.key}
                  className={`home-tabs__tab${activeKey === tab.key ? ' is-active' : ''}`}
                  onClick={() => setActiveKey(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Link to={activeTab.link} className="btn btn-ghost btn--sm home-tabs__all">
              Show all {activeTab.label}
            </Link>
          </div>

          <ProductGrid products={tabProducts} loading={tabLoading} error={tabError} />
        </div>
      </section>

      {/* ---------- Brands ---------- */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">Two trusted makers</p>
            <h2 className="section-head__title">Crafted by hands we trust</h2>
            <p className="section-head__text">
              We keep to the makers whose dolls we would choose ourselves \u2014 nothing imitation ever crosses our threshold.
            </p>
          </div>

          <div className="brand-grid">
            <Link to="/brand/arias" className="brand-card">
              <div className="brand-card__media">
                <img src={IMAGERY.brand.arias} alt="Arias dolls" loading="lazy" />
                <div className="brand-card__shade" aria-hidden="true" />
              </div>
              <div className="brand-card__body">
                <span className="brand-card__name">Arias</span>
                <span className="brand-card__tag">Heirloom-quality reborn pieces</span>
                <span className="brand-card__more">Explore the collection {'\u2192'}</span>
              </div>
            </Link>
            <Link to="/brand/llorens" className="brand-card">
              <div className="brand-card__media">
                <img src={IMAGERY.brand.llorens} alt="Llorens dolls" loading="lazy" />
                <div className="brand-card__shade" aria-hidden="true" />
              </div>
              <div className="brand-card__body">
                <span className="brand-card__name">Llorens</span>
                <span className="brand-card__tag">Beloved companions, made for play</span>
                <span className="brand-card__more">Explore the collection {'\u2192'}</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">Ordering is easy</p>
            <h2 className="section-head__title">From our house to yours</h2>
          </div>
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__text">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Contact strip ---------- */}
      <section className="section">
        <div className="container">
          <div className="contact-strip">
            <div>
              <h2 className="contact-strip__title">Prefer to ask a person?</h2>
              <p className="contact-strip__text">
                Sizing, a special request, or a question before you decide \u2014 the family would love to hear from you.
              </p>
            </div>
            <div className="contact-strip__actions">
              <a href={`mailto:${SITE.email}`} className="btn btn-light">Email us</a>
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-accent">{SITE.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}