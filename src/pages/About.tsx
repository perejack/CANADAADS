import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-16 pt-32">
        <h1 className="text-4xl font-bold mb-8 text-foreground">About CanadaVisa</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p>
              CanadaVisa is dedicated to helping Kenyan professionals, students, and families achieve their dreams of living and working in Canada. We provide comprehensive information and support throughout the immigration and job application process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Expertise:</strong> Deep understanding of the Canada-Kenya partnership and immigration pathways.</li>
              <li><strong>Transparency:</strong> Clear communication about the process and requirements.</li>
              <li><strong>Success Rate:</strong> Proudly supported over 13,000 successful applications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
            <p>
              We are committed to providing accurate, up-to-date information and personalized assistance. While we are a private consultancy and not affiliated with the Government of Canada, we strive to maintain the highest standards of professional service.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
