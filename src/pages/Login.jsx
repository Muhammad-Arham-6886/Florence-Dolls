import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useShop } from '../context/ShopContext';
import './auth.css';

export default function Login() {
  const { user, login } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/account" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    setBusy(true);
    const result = login(form);
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
        path="/login"
        title="Sign In"
        description="Sign in to your Florence Dolls account to view saved pieces and manage your details."
      />

      <div className="auth-wrap">
        <p className="page__eyebrow">Welcome back</p>
        <h1 className="page__title">Sign in</h1>
        <p className="auth__lead">
          Sign in to keep your wishlist and basket close at hand.
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          {error && <p className="auth-form__error" role="alert">{error}</p>}
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
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <button type="submit" className="btn btn-primary auth-form__submit" disabled={busy}>
            {busy ? 'Signing in\u2026' : 'Sign in'}
          </button>
        </form>

        <p className="auth__switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}