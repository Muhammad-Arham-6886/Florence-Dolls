import { useState } from 'react';
import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';
import './forms.css';

export default function TradeAccount() {
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    message: '',
  });

  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'trade' }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('success');
        setForm({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          website: '',
          message: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || `Could not submit request. Please email us directly at ${SITE.email}.`);
      }
    } catch {
      setStatus('error');
      setErrorMessage(`Network error. Please try again or email us directly at ${SITE.email}.`);
    }
  };

  return (
    <div className="page container">
      <SEO {...SEO_META.trade} />
      <p className="page__eyebrow">Wholesale &amp; trade</p>
      <h1 className="forms__title">Open a Trade Account</h1>
      <p className="page__lead contact__lead">
        We welcome shops, collectors and businesses who would like genuine reborn dolls, Arias and Llorens pieces at wholesale terms. Tell us a little about you and we will be in touch with our current trade pricing.
      </p>

      <div className="trade-grid">
        {status === 'success' ? (
          <div className="form-success-banner">
            <h3>Trade application received!</h3>
            <p>
              Thank you for applying. Our wholesale team has received your details and will be in touch with trade pricing within one working day.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              onClick={() => setStatus('idle')}
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {status === 'error' && (
              <div className="form-error-banner" role="alert">
                {errorMessage}
              </div>
            )}

            <label className="field">
              <span className="field__label">Business name</span>
              <input type="text" name="businessName" value={form.businessName} onChange={update} required />
            </label>

            <label className="field">
              <span className="field__label">Contact name</span>
              <input type="text" name="contactName" value={form.contactName} onChange={update} required />
            </label>

            <label className="field">
              <span className="field__label">Email address</span>
              <input type="email" name="email" value={form.email} onChange={update} required />
            </label>

            <label className="field">
              <span className="field__label">Phone</span>
              <input type="tel" name="phone" value={form.phone} onChange={update} />
            </label>

            <label className="field">
              <span className="field__label">Website (optional)</span>
              <input type="url" name="website" value={form.website} onChange={update} />
            </label>

            <label className="field">
              <span className="field__label">A little about your business</span>
              <textarea name="message" rows={5} value={form.message} onChange={update} placeholder="For example: independent gift shop, collector, online boutique..." />
            </label>

            <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting request...' : 'Request trade terms'}
            </button>
          </form>
        )}

        <aside className="contact-details">
          <h2>What trade customers ask us</h2>
          <ul className="trade-list">
            <li>Wholesale pricing on genuine Arias and Llorens ranges</li>
            <li>All stock held in the UK, no waiting on distant shipments</li>
            <li>Fast dispatch with tracking on every trade order</li>
            <li>A small, personal team that answers directly</li>
          </ul>
          <div className="notice">
            <p>
              Prefer to talk it through? Call us on <a href={`tel:${SITE.phoneIntl}`}>{SITE.phone}</a> during business hours.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}