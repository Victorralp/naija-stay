import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted text-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">NH</span>
              </div>
              <span className="text-xl font-bold">Naija Hotels</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Experience the finest Nigerian hospitality with our premium hotel collection across Lagos, Abuja, and Port Harcourt.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Home</a></li>
              <li><a href="#hotels" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Hotels</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">About Us</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Contact</a></li>
              <li><a href="#booking" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Booking</a></li>
            </ul>
          </div>

          {/* Cities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Locations</h3>
            <ul className="space-y-2">
              <li><a href="#lagos" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Lagos Hotels</a></li>
              <li><a href="#abuja" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Abuja Hotels</a></li>
              <li><a href="#port-harcourt" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Port Harcourt Hotels</a></li>
              <li><a href="#ibadan" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Ibadan Hotels</a></li>
              <li><a href="#kano" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Kano Hotels</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">+234 809 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">info@naijahotels.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Plot 123, Victoria Island<br />
                  Lagos, Nigeria
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter for exclusive deals and travel tips
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="default" size="default">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 Naija Hotels. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="hover:text-foreground transition-smooth">Privacy Policy</a>
              <a href="#terms" className="hover:text-foreground transition-smooth">Terms of Service</a>
              <a href="#cookies" className="hover:text-foreground transition-smooth">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;