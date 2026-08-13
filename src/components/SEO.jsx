import { Helmet } from 'react-helmet-async';
import { SITE } from '../config';

export default function SEO({ title, description, path }) {
  const url = `${SITE.canonical}${path || ''}`;
  const fullTitle = title ? `${title} | ${SITE.brand}` : `${SITE.brand} | Reborn Baby Dolls, Arias & Llorens, UK`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.brand} />
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );
}