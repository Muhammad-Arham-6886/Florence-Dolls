import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useShop } from '../context/ShopContext';
import './auth.css';

export default function Register() {
  const { user, register } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/account" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Your password should be at least 6 characters.');
      return;
    }
    setBusy(true);
    setError(null);
    const result = await register(form);
    setBusy(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="page container">
      <SEO
        path="/register"
        title="Create an Account"
        description="Create a Florence Dolls account to keep your wishlist, basket and details together."
      />

      <div className="auth-wrap">
        <p className="page__eyebrow">Join the house</p>
        <h1 className="page__title">Create an account</h1>
        <p className="auth__lead">
          A simple account for keeping your saved pieces and basket in one gentle place.
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          {error && <p className="auth-form__error" role="alert">{error}</p>}
          <label className="auth-form__field">
            <span>Your name</span>
            <input
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="auth-form__field">
            <span>Email address</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="auth-form__field">
            <span>Password</span>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <button type="submit" className="btn btn-primary auth-form__submit" disabled={busy}>
            {busy ? 'Creating\u2026' : 'Create account'}
          </button>
        </form>

        <p className="auth__switch">
          Already with us? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}