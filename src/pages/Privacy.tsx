import bg from "@/assets/bg-bg.jpg";

export default function PrivacyPage() {
  const LuxuryDivider = ({ className = "" }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 200 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0"
        y1="2"
        x2="80"
        y2="2"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <circle cx="100" cy="2" r="2" fill="currentColor" opacity="0.6" />
      <line
        x1="120"
        y1="2"
        x2="200"
        y2="2"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-[140px] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.5
        }}
      />
      <div className="w-full max-w-4xl space-y-8 bg-mushroom/90 backdrop-blur-md p-8 md:p-12 rounded-sm shadow-xl border border-oak/10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-philosopher text-oak text-center">
          Privacy Policy
        </h1>

        <p className="text-kimber text-center font-light leading-relaxed text-lg">
          We value your privacy. This Privacy Policy outlines how we collect,
          use, and protect your personal information.
        </p>

        <div className="flex justify-center">
          {[...Array(1)].map((_, i) => (
            <LuxuryDivider key={i} className="h-4 text-autumnFern" />
          ))}
        </div>

        <section className="space-y-8 text-kimber">
          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Information We Collect
            </h2>
            <p className="leading-relaxed font-light mb-4">
              We collect the following types of information when you use our
              services or make a purchase:
            </p>
            <ul className="list-disc list-inside leading-relaxed space-y-2 font-light ml-4">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Billing and Shipping Address</li>
              <li>Payment Information (processed via Razorpay)</li>
              <li>IP Address and browser/device information</li>
              <li>Cookies and usage data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Use of Information
            </h2>
            <p className="leading-relaxed font-light mb-4">
              We use your personal information for the following purposes:
            </p>
            <ul className="list-disc list-inside leading-relaxed space-y-2 font-light ml-4">
              <li>To process and fulfill your orders</li>
              <li>To communicate with you about your orders or inquiries</li>
              <li>To provide customer support</li>
              <li>To improve our website and services</li>
              <li>To send promotional offers and updates (only with consent)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Cookies and Tracking Technologies
            </h2>
            <p className="leading-relaxed font-light">
              We use cookies and similar technologies to enhance your browsing
              experience and to analyze usage data. You can choose to disable
              cookies through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Payment
            </h2>
            <p className="leading-relaxed font-light">
              Payments are securely processed using{" "}
              <a
                href="https://razorpay.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-autumnFern hover:underline font-medium"
              >
                Razorpay
              </a>
              . Razorpay may collect your payment details such as card number,
              expiration date, UPI ID, or bank account details directly on their
              secure servers. We do not store or have access to your full payment
              details.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Data Retention
            </h2>
            <p className="leading-relaxed font-light">
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this policy unless a longer
              retention period is required by law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Sharing of Information
            </h2>
            <p className="leading-relaxed font-light mb-4">
              We do not sell or rent your personal data. However, we may share
              information with:
            </p>
            <ul className="list-disc list-inside leading-relaxed space-y-2 font-light ml-4">
              <li>Trusted third-party service providers (e.g., Razorpay)</li>
              <li>Logistics partners to fulfill delivery</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Data Security
            </h2>
            <p className="leading-relaxed font-light">
              We implement reasonable technical and organizational safeguards to
              protect your personal data. However, no online transmission or
              storage is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Your Rights
            </h2>
            <p className="leading-relaxed font-light mb-4">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc list-inside leading-relaxed space-y-2 font-light ml-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict our use of your data</li>
              <li>Withdraw consent for marketing at any time</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Children’s Privacy
            </h2>
            <p className="leading-relaxed font-light">
              Our services are not intended for individuals under the age of 13.
              We do not knowingly collect personal data from children.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Changes to This Policy
            </h2>
            <p className="leading-relaxed font-light">
              We may update this Privacy Policy from time to time. The latest
              version will always be posted on this page with the effective date.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-philosopher text-oak mb-4">
              Contact Us
            </h2>
            <p className="leading-relaxed font-light">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy, you can contact us at:{" "}
              <a
                href="mailto:enquire@yucalifestyle.com"
                className="text-autumnFern hover:underline font-medium"
              >
                enquire@yucalifestyle.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
