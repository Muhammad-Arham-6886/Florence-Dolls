import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="page container">
      <SEO title="Page not found" description="That page could not be found on Florence Dolls." />
      <p className="page__eyebrow">Wandering</p>
      <h1>We could not find that page</h1>
      <p className="page__lead">
        The page you are looking for may have moved or found a new home. From here, our shelves are the best place to begin again.
      </p>
      <div className="home-hero__actions">
        <Link to="/" className="btn btn-primary">Back to the Homepage</Link>
        <Link to="/new-arrivals" className="btn btn-ghost">See What Is New</Link>
      </div>
    </div>
  );
}