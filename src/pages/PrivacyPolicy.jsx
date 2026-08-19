import SEO from '../components/SEO';
import SEO_META from '../data/seo';
import { SITE } from '../config';

export default function PrivacyPolicy() {
  return (
    <div className="page container">
      <SEO {...SEO_META.privacy} />
      <p className="page__eyebrow">Legal &amp; trust</p>
      <h1>Privacy Policy</h1>

      <div className="reading reading--wide">
        <p className="page__lead">
          Effective Date: June 13, 2026
        </p>

        <p>
          This Privacy Policy describes how Florence Dolls (operating online via florencedolls.co.uk)
          collects, uses, and protects your personal information when you visit, interact with,
          register an account, or make a purchase from our platform.
        </p>
        <p>
          We are fully committed to safeguarding your privacy under the UK General Data Protection
          Regulation (UK GDPR) and ensuring that your personal and business data is handled securely,
          transparently, and responsibly.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          To effectively operate our UK wholesale and retail distribution network, we collect
          information across the following categories:
        </p>
        <ul>
          <li>
            <strong>Automatically Collected Data:</strong> When you visit our website, we may
            automatically log certain information via cookies and analytics software. This includes
            your IP address, browser type, device information, operating system, pages viewed, and
            detailed engagement patterns. This data is utilized solely to enhance our technical
            performance, layout optimization, and general security metrics.
          </li>
          <li>
            <strong>Personal &amp; Transactional Information:</strong> When you register a standard
            account, request an inquiry, or complete a checkout transaction, we collect precise
            operational fields. These include your full name, email address, physical billing address,
            fast UK shipping address, phone number, and encrypted payment details.
          </li>
          <li>
            <strong>Wholesale &amp; Trade Account Credentials:</strong> For business partners
            applying for a secure trade account, we collect corporate verification data. This
            includes your official trade name, business classification, company registration number
            (if applicable), VAT number, and operating company website links.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We process and apply the data we collect under strict legitimate interests, contractual
          obligations, and legal compliance workflows for the following specific purposes:
        </p>
        <ul>
          <li>To safely process, verify, and complete wholesale or retail orders.</li>
          <li>To review, authorize, and systematically manage verified trade profile applications.</li>
          <li>To coordinate rapid logistics pipelines and manage tracking details directly from our UK warehouse facility.</li>
          <li>To provide immediate and high-quality localized telephone customer support.</li>
          <li>To communicate essential transaction status logs, order amendments, or account verification confirmations.</li>
          <li>To prevent system fraud, enforce platform security protocols, and protect our business interests against malicious web traffic.</li>
          <li>To remain in complete compliance with corporate UK tax and statutory reporting metrics.</li>
        </ul>

        <h2>3. Sharing Your Information</h2>
        <p>
          We strictly enforce a policy against selling, renting, licensing, or trading your personal
          or corporate data to secondary third parties for standalone marketing use.
        </p>
        <p>
          To fulfill our fast-shipping model and handle business operations cleanly, we only share
          targeted information with verified domestic service partners under strict confidentiality
          agreements. This includes:
        </p>
        <ul>
          <li><strong>Logistics &amp; Delivery Operations:</strong> Senders such as tracked UK domestic parcel carriers to handle your 2&ndash;3 day deliveries.</li>
          <li><strong>Financial Clearing Handlers:</strong> Integrated, fully secure credit card payment processors and merchant gateways.</li>
          <li><strong>Infrastructure Tech Handlers:</strong> Authorized cloud hosting networks, web design databases, and specialized backend communication platforms.</li>
        </ul>
        <p>
          We reserve the right to disclose personal data explicitly if requested by UK law enforcement
          authorities or when required to firmly protect our legal rights, property safety, or
          corporate standing.
        </p>

        <h2>4. Cookies and Web Tracking Systems</h2>
        <p>
          Our online platform utilizes persistent and session-based cookies to dramatically improve
          your browsing experience and capture navigational analytics. Cookies are minor text strings
          safely saved on your browsing device that allow us to retain active items in shopping carts,
          remember specialized account settings, and refine layout performance.
        </p>
        <p>
          You preserve full autonomy to adjust or completely deactivate cookie collection pathways
          through your individual desktop or mobile browser settings. Please take note that deactivating
          necessary platform cookies may impact active technical functionalities during layout
          navigations or checkouts.
        </p>

        <h2>5. Data Security Standards</h2>
        <p>
          We implement strict technical and organizational safety measures designed to protect your
          data from accidental loss, structural alteration, unauthorized access, or illegal exposure.
        </p>
        <p>
          All sensitive transaction pathways utilize encrypted SSL/TLS layers. Physical inventory
          documents are managed securely inside our restricted Bradford center. However, please be
          advised that no modern system over the internet holds a guarantee of absolute defensive
          isolation against unexpected breaches; therefore, we cannot pledge complete, absolute risk
          insulation.
        </p>

        <h2>6. Your Statutory Legal Rights</h2>
        <p>
          Under the robust framework of the United Kingdom Data Protection Act and UK GDPR guidelines,
          our retail buyers and wholesale partners retain active individual consumer rights regarding
          data processing:
        </p>
        <ul>
          <li><strong>The Right of Access:</strong> You can formally request a written transcript detailing all private information fields we actively store on your profile.</li>
          <li><strong>The Right of Correction:</strong> You hold the authority to request immediate updates or formatting adjustments for broken or incomplete profile fields.</li>
          <li><strong>The Right of Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You can request the systemic deletion of your record data, provided it does not conflict with statutory financial record-keeping laws.</li>
          <li><strong>The Right to Object/Restrict Processing:</strong> You retain the authority to challenge specific automated analytical data tracks or file an entry tracking block.</li>
        </ul>
        <p>
          To quickly initiate any of these privacy workflows, please submit your request directly to
          our Bradford account support team via the contact indicators noted below.
        </p>

        <h2>7. Third-Party Web Anchors</h2>
        <p>
          Our store layout may feature external hypertext connections to supplementary global partner
          links or social platforms. We maintain zero technical management or legal liability over the
          active privacy frameworks or text structures utilized by independent external sites. We
          suggest reading the structural privacy statements of any linked platform before transmitting
          private profiles.
        </p>

        <h2>8. Amendments to This Policy</h2>
        <p>
          We reserve the functional right to refresh or completely update this document to properly
          address moving system upgrades, modern data legislation adjustments, or structural changes
          to our operational model. Any revised adjustments take prompt operational effect upon being
          published dynamically on this URL.
        </p>

        <h2>9. Legal Corporate Contact Details</h2>
        <p>
          If you have questions regarding this Privacy Policy, your consumer profile, or require
          immediate technical assistance with your trade profile, reach out directly to our UK
          headquarters:
        </p>
        <ul>
          <li><strong>Registered Business Name:</strong> Florence Dolls</li>
          <li><strong>UK Corporate Registry Number:</strong> Registered in England | Company No. {SITE.companyNo}</li>
          <li><strong>Direct Customer Telephone Line:</strong> {SITE.phone}</li>
          <li><strong>Direct Monitoring Support Inbox:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        </ul>
      </div>
    </div>
  );
}
