import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { fetchPosts } from '../lib/woo';
import './blog.css';

function cleanText(html) {
  const el = document.createElement('div');
  el.innerHTML = html || '';
  return el.textContent || '';
}

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPosts(1, 50)
      .then((res) => {
        if (!cancelled) {
          setPosts(res.items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const termName = (post, tax) =>
    (post[tax] || []).length ? post[tax].map((t) => t.name).join(', ') : null;

  return (
    <div className="page container">
      <SEO {...SEO_META.blog} />
      <p className="page__eyebrow">From the house</p>
      <h1 className="blog__title">The Florence Dolls Journal</h1>
      <p className="page__lead blog__lead">
        A little corner for doll lovers &mdash; news, care guides and gentle notes from our family, added whenever there is something worth sharing.
      </p>

      {loading && <p className="status-note">Quietly turning a few pages&hellip;</p>}
      {error && <p className="status-note status-note--error">The journal could not be opened just now. Please try again shortly.</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="status-note">No notes have been posted yet. The first one is often just around the corner.</p>
      )}

      <div className="blog-grid">
        {posts.map((post) => {
          const image = post.image ? { source_url: post.image } : null;
          const category = termName(post, 'categories');
          const tags = termName(post, 'tags');
          return (
            <article className="blog-card" key={post.id}>
              <Link to={`/blog/${post.slug}`} className="blog-card__link">
                {image && image.source_url ? (
                  <div className="blog-card__media">
                    <img src={image.source_url} alt={post.title} loading="lazy" />
                  </div>
                ) : null}
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    {category ? <span className="blog-card__category">{category}</span> : null}
                    <time className="blog-card__date">{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  </div>
                  <h3 className="blog-card__title">{post.title}</h3>
                  <p className="blog-card__excerpt">{cleanText(post.excerpt).slice(0, 140)}&hellip;</p>
                  {tags ? <p className="blog-card__tags">{tags}</p> : null}
                  <span className="blog-card__more">Continue reading &rarr;</span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}