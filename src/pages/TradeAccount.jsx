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

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Trade account request - ${form.businessName || form.contactName}`);
    const body = encodeURIComponent(
      `Business name: ${form.businessName}\nContact: ${form.contactName}\nEmail: ${form.email}\nPhone: ${form.phone}\nWebsite: ${form.website}\n\nNotes:\n${form.message}`
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
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
        <form className="contact-form" onSubmit={handleSubmit}>
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

          <button type="submit" className="btn btn-primary">Request trade terms</button>
        </form>

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