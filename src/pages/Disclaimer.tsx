import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-16 pt-32">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Disclaimer</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p>Last Updated: February 20, 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. No Legal Advice</h2>
            <p>
              The information provided on CanadaVisa is for general informational purposes only and does not constitute legal or professional advice. You should consult with a regulated Canadian immigration consultant or lawyer for specific advice regarding your situation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. No Government Affiliation</h2>
            <p>
              CanadaVisa is a private consultancy and is not affiliated with Immigration, Refugees and Citizenship Canada (IRCC) or any other department of the Government of Canada.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Accuracy of Information</h2>
            <p>
              While we strive to keep the information on our website accurate and up-to-date, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-Party Links</h2>
            <p>
              Our website may contain links to external websites. We have no control over the content or practices of these sites and assume no responsibility for them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Results Not Guaranteed</h2>
            <p>
              The outcome of any immigration application depends on various factors and the final decision of IRCC. We cannot guarantee the success of any application.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;
