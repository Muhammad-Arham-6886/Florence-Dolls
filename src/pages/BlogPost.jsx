import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchPostBySlug } from '../lib/woo';
import './blog.css';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchPostBySlug(slug)
      .then((p) => {
        if (!cancelled) {
          setPost(p);
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
  }, [slug]);

  if (loading)
    return (
      <div className="page container">
        <p className="status-note">Opening the page&hellip;</p>
      </div>
    );

  if (error || !post)
    return (
      <div className="page container">
        <p className="status-note">That page could not be found.</p>
        <p>
          <Link to="/blog" className="btn btn-ghost">Back to the Journal</Link>
        </p>
      </div>
    );

  const description = post.seo?.description
    || (post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '').slice(0, 155) : 'A note from Florence Dolls.');

  return (
    <div className="page container">
      <SEO
        path={`/blog/${post.slug}`}
        title={post.seo?.title || post.title}
        description={description}
      />
      <article className="blog-post reading">
        <p className="page__eyebrow">Journal</p>
        <h1 className="blog-post__title">{post.title}</h1>
        <div className="blog-post__meta">
          <time className="blog-card__date">
            {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
          {post.categories?.length ? (
            <span className="blog-post__categories">
              {post.categories.map((c) => c.name).join(', ')}
            </span>
          ) : null}
        </div>
        {post.image ? (
          <div className="blog-post__media">
            <img src={post.image} alt={post.title} />
          </div>
        ) : null}
        <div className="blog-post__content" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        {post.tags?.length ? (
          <div className="blog-post__tags">
            {post.tags.map((t) => (
              <span className="blog-post__tag" key={t.id}>{t.name}</span>
            ))}
          </div>
        ) : null}
        <p className="blog-post__back">
          <Link to="/blog" className="btn btn-ghost">&larr; Back to the Journal</Link>
        </p>
      </article>
    </div>
  );
}