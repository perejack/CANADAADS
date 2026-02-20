import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-16 pt-32">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p>Last Updated: February 20, 2025</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p>
              CanadaVisa ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fill out an application form for job or immigration services.</li>
              <li>Contact us via email or WhatsApp.</li>
              <li>Subscribe to our newsletter.</li>
              <li>Create an account on our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your immigration or job applications.</li>
              <li>Communicate with you about your application status.</li>
              <li>Send you relevant updates and marketing materials (if opted in).</li>
              <li>Improve our website and services.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Google Ads and Advertising</h2>
            <p>
              We use Google Ads to promote our services. Google uses cookies to serve ads based on your past visits to our website. You can opt out of Google's use of cookies by visiting the Google Advertising Policies page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Email: abigailpsomukenchesang@gmail.com
              <br />
              Address: P.O. Box 688-00100, Nairobi
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
