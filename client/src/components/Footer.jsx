import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-trust-blue" />
              <span className="text-lg font-bold text-foreground">DonationHub</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting generous donors with those in need through a transparent and efficient 
              donation matching platform. Building stronger communities one donation at a time.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@donationhub.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Charity St, Helper City</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div><a href="#" className="hover:text-trust-blue transition-colors">About Us</a></div>
              <div><a href="#" className="hover:text-trust-blue transition-colors">How It Works</a></div>
              <div><a href="#" className="hover:text-trust-blue transition-colors">Privacy Policy</a></div>
              <div><a href="#" className="hover:text-trust-blue transition-colors">Terms of Service</a></div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 MastercardHacathon. All rights reserved. Made with{' DIPAK AHUJA '}
            <Heart className="inline h-4 w-4 text-red-500" /> for community.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;