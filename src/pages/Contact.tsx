import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-16 pt-32">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground">
              Have questions about your Canadian journey? Our team is here to help you every step of the way.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <p className="text-muted-foreground">abigailpsomukenchesang@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Address</p>
                  <p className="text-muted-foreground">P.O. Box 688-00100, Nairobi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Send us a message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input type="text" className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                <textarea className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none h-32" placeholder="How can we help?"></textarea>
              </div>
              <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
