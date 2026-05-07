import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-16 pt-32">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p>Last Updated: February 20, 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. What are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Cookies</h2>
            <p>
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
              <li><strong>Analytics Cookies:</strong> To understand how visitors interact with our website.</li>
              <li><strong>Advertising Cookies:</strong> To serve relevant ads and track their performance (e.g., Google Ads).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Your Choices Regarding Cookies</h2>
            <p>
              If you prefer to avoid the use of cookies, you can disable them in your browser settings. However, please note that some features of our website may not function correctly without cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. More Information</h2>
            <p>
              For more information about how we use cookies, please contact us at abigailpsomukenchesang@gmail.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
