// Vercel serverless function to handle Contact & Trade Account form submissions
// using the Resend email API.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Florence Dolls <contact@florencedolls.co.uk>';
const FALLBACK_FROM = 'Florence Dolls <onboarding@resend.dev>';
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info@florencedolls.co.uk';
const FALLBACK_TO = 'hello.newsdesk@gmail.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name, email, phone, subject, message, type, businessName, contactName, website } = data;

    const senderName = name || contactName || businessName || 'Website Visitor';
    const senderEmail = email || '';
    const senderPhone = phone || 'Not provided';
    const isTrade = type === 'trade' || Boolean(businessName);
    
    if (!senderEmail || (!message && !isTrade)) {
      return res.status(400).json({ ok: false, error: 'Please provide all required fields.' });
    }

    const emailSubject = isTrade
      ? `Trade Account Application: ${businessName || senderName}`
      : `Website Enquiry: ${subject || 'General Enquiry'} - ${senderName}`;

    const formattedContent = isTrade
      ? `
<div style="font-family:sans-serif;line-height:1.6;color:#333;max-width:600px;">
  <h2 style="color:#42644b;">New Trade Account Application</h2>
  <p><strong>Business Name:</strong> ${escapeHtml(businessName || '-')}</p>
  <p><strong>Contact Name:</strong> ${escapeHtml(contactName || senderName)}</p>
  <p><strong>Email:</strong> <a href="mailto:${escapeHtml(senderEmail)}">${escapeHtml(senderEmail)}</a></p>
  <p><strong>Phone:</strong> ${escapeHtml(senderPhone)}</p>
  <p><strong>Website:</strong> ${escapeHtml(website || 'None')}</p>
  <p><strong>Notes / Message:</strong></p>
  <blockquote style="background:#faf6f1;padding:12px;border-left:4px solid #d4a24c;margin:0;">
    ${escapeHtml(message || '-').replace(/\n/g, '<br/>')}
  </blockquote>
</div>
`
      : `
<div style="font-family:sans-serif;line-height:1.6;color:#333;max-width:600px;">
  <h2 style="color:#42644b;">New Contact Form Enquiry</h2>
  <p><strong>Name:</strong> ${escapeHtml(senderName)}</p>
  <p><strong>Email:</strong> <a href="mailto:${escapeHtml(senderEmail)}">${escapeHtml(senderEmail)}</a></p>
  <p><strong>Phone:</strong> ${escapeHtml(senderPhone)}</p>
  <p><strong>Subject:</strong> ${escapeHtml(subject || 'General enquiry')}</p>
  <p><strong>Message:</strong></p>
  <blockquote style="background:#faf6f1;padding:12px;border-left:4px solid #42644b;margin:0;">
    ${escapeHtml(message || '').replace(/\n/g, '<br/>')}
  </blockquote>
</div>
`;

    // Attempt 1: Try sending to primary recipient with custom domain
    let response = await sendWithResend({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: senderEmail,
      subject: emailSubject,
      html: formattedContent,
    });

    // If custom domain is not yet verified in Resend, automatically fallback to test sender & account email
    if (!response.ok && response.error && response.error.includes('verify a domain')) {
      response = await sendWithResend({
        from: FALLBACK_FROM,
        to: [FALLBACK_TO],
        reply_to: senderEmail,
        subject: `[Florence Dolls] ${emailSubject}`,
        html: formattedContent,
      });
    }

    if (!response.ok) {
      return res.status(500).json({ ok: false, error: response.error || 'Failed to send email.' });
    }

    return res.status(200).json({ ok: true, id: response.id });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
}

async function sendWithResend({ from, to, reply_to, subject, html }) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to,
        subject,
        html,
      }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: (json && json.message) || `Resend error ${res.status}` };
    }
    return { ok: true, id: json && json.id };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
