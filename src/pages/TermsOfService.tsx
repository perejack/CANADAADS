import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-16 pt-32">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p>Last Updated: February 20, 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the CanadaVisa website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Services</h2>
            <p>
              CanadaVisa provides information and assistance regarding Canadian immigration pathways and job opportunities. We are a private consulting firm and are not affiliated with the Government of Canada.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
            <p>
              You agree to provide accurate, current, and complete information during the application process. You are responsible for maintaining the confidentiality of your account information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and software, is the property of CanadaVisa and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
            <p>
              CanadaVisa shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the website after changes are posted constitutes your acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Province of Ontario and the federal laws of Canada.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
