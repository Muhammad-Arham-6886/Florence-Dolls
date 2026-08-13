import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';
import { IMAGERY } from '../data/imagery';
import './about.css';

export default function About() {
  return (
    <div className="page container">
      <SEO {...SEO_META.about} />

      <div className="about-hero">
        <div className="about-hero__media">
          <img src={IMAGERY.about} alt="A softly finished reborn doll from the Florence Dolls range" loading="lazy" />
        </div>
        <div className="about-hero__copy">
          <p className="eyebrow">Our little story</p>
          <h1 className="about-hero__title">
            From a family wanting a fine doll, <em>to one that shares them.</em>
          </h1>
          <p className="about-hero__lead">
            Florence Dolls began the way many of the loveliest things do &mdash; quietly, at home, and over a spell of looking for something we could not easily find. We had fallen for a genuinely crafted reborn doll, and the more we searched, the harder it proved to find one in Britain without fuss or a padded price. The thought followed naturally: if the pieces we loved were so hard to come by, perhaps we could be the ones to keep them.
          </p>
        </div>
      </div>

      <div className="reading about-body">
        <h2>Who we are</h2>
        <p>
          We are a small UK family business &mdash; registered under Company No. {SITE.companyNo} &mdash; and we run the shop the way we would wish a family business to treat us. Florence stays a deliberately small, carefully tended range rather than a crowded one: genuine reborn babies, Arias and Llorens collectables, prams, furniture and boutique accessories, each chosen for its honest quality and for the little one it will one day be entrusted to.
        </p>

        <h2>Why genuine, and why nothing else</h2>
        <p>
          A fine reborn doll is meant to last a childhood and beyond, so the standard has to be a high one. The makers we trust &mdash; Arias and Llorens in particular &mdash; have spent decades getting the weight, the softness and the face precisely right. You will not find imitation or loosely matched lines here; we would rather keep a smaller shelf of true pieces than fill a wide one with near-lovely ones.
        </p>

        <h2>Kept close to home</h2>
        <p>
          Everything we hold sits here in the UK, and that matters more than you might think. It means each doll is seen before it is let go, an order does not hang on a delivery from a far factory, and we can say honestly that your piece will reach you within our usual 2&ndash;3 day window. It is the straightforward way to run a shop we mean to answer for.
        </p>

        <h2>More than a basket</h2>
        <p>
          When you write or call &mdash; <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or {SITE.phone} &mdash; it will be a family member on the other end, happy to help with arrangements, size or the right gift for someone special. We also welcome trade and wholesale enquiries, which you can read about on our{' '}
          <a href="/trade-account">open a trade account</a> page. Thank you for spending a little of your time with us &mdash; we try to match every parcel to the care we would want for our own.
        </p>
      </div>
    </div>
  );
}