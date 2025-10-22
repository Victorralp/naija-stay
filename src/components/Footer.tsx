import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { useState } from "react";
import { newsletterService } from "@/services/newsletterService";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await newsletterService.subscribe(email);
      
      if (result.success) {
        toast.success(result.message);
        setEmail("");
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    } catch (err) {
      const errorMessage = "Failed to subscribe. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
      console.error("Newsletter subscription error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (platform: string) => {
    toast.info(`Follow us on ${platform} for updates!`);
    // In a real app, this would redirect to the social media page
  };

  return (
    <footer id="footer" className="bg-muted text-foreground pt-12 pb-8 w-full">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">NH</span>
              </div>
              <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">Naija Hotels</Link>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Experience the finest Nigerian hospitality with our premium hotel collection across Lagos, Abuja, and Port Harcourt.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={() => handleSocialClick("Facebook")}
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={() => handleSocialClick("Twitter")}
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={() => handleSocialClick("Instagram")}
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Home</Link></li>
              <li><Link to="/rooms" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Rooms</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Contact</Link></li>
              <li><Link to="/enhanced-booking" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Booking</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Locations</h3>
            <ul className="space-y-2">
              <li><a href="/#lagos" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Lagos Hotels</a></li>
              <li><a href="/#abuja" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Abuja Hotels</a></li>
              <li><a href="/#port-harcourt" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Port Harcourt Hotels</a></li>
              <li><a href="/#ibadan" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Ibadan Hotels</a></li>
              <li><a href="/#kano" className="text-muted-foreground hover:text-foreground transition-smooth text-sm">Kano Hotels</a></li>
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
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-grow">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 bg-background border ${error ? 'border-red-500' : 'border-input'} rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                  required
                />
                {error && <p className="text-red-500 text-xs mt-1 text-left">{error}</p>}
              </div>
              <Button 
                variant="default" 
                size="default"
                type="submit"
                disabled={loading}
                className="whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Subscribing...
                  </span>
                ) : "Subscribe"}
              </Button>
            </form>
            <p className="text-muted-foreground text-xs mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 Naija Hotels. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
              <Link to="/#privacy" className="hover:text-foreground transition-smooth">Privacy Policy</Link>
              <Link to="/#terms" className="hover:text-foreground transition-smooth">Terms of Service</Link>
              <Link to="/#cookies" className="hover:text-foreground transition-smooth">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;