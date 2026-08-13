import { useState } from 'react';
import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';
import './forms.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General enquiry', message: '' });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${form.subject} - ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="page container">
      <SEO {...SEO_META.contact} />
      <p className="page__eyebrow">Say hello</p>
      <h1 className="forms__title">Contact Florence Dolls</h1>
      <p className="page__lead contact__lead">
        A question about an order, a care thought, or simply lovely dolls &mdash; write to us and a family member will reply within one working day.
      </p>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Your name</span>
            <input type="text" name="name" value={form.name} onChange={update} required />
          </label>

          <label className="field">
            <span className="field__label">Email address</span>
            <input type="email" name="email" value={form.email} onChange={update} required />
          </label>

          <label className="field">
            <span className="field__label">Phone (optional)</span>
            <input type="tel" name="phone" value={form.phone} onChange={update} />
          </label>

          <label className="field">
            <span className="field__label">Subject</span>
            <select name="subject" value={form.subject} onChange={update}>
              <option>General enquiry</option>
              <option>An existing order</option>
              <option>Replacement or returns</option>
              <option>Wholesale &amp; trade</option>
            </select>
          </label>

          <label className="field">
            <span className="field__label">Your message</span>
            <textarea name="message" rows={6} value={form.message} onChange={update} required />
          </label>

          <button type="submit" className="btn btn-primary">Send enquiry</button>
        </form>

        <aside className="contact-details">
          <h2>Other ways to reach us</h2>
          <p>
            <strong>Email</strong>
            <br />
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <p>
            <strong>Telephone</strong>
            <br />
            <a href={`tel:${SITE.phoneIntl}`}>{SITE.phone}</a>
          </p>
          <p>
            <strong>Business</strong>
            <br />
            Florence Dolls
            <br />
            Registered Company No. {SITE.companyNo}
          </p>
          <div className="notice">
            <p>
              We aim to reply within one working day. If your question is about a gift, do tell us the date &mdash; we will do our best to make it timely.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}