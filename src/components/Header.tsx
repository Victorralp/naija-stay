import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Phone } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">NH</span>
            </div>
            <span className="text-xl font-bold text-foreground">Naija Hotels</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-smooth">Home</Link>
            <Link to="/rooms" className="text-foreground hover:text-primary transition-smooth">Rooms</Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-smooth">About</Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-smooth">Contact</Link>
            <Link to="/profile" className="text-foreground hover:text-primary transition-smooth">Profile</Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+234 809 123 4567</span>
            </div>
            <Link to="/booking">
              <Button variant="hero" size="sm">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="flex flex-col space-y-4 py-4">
              <Link to="/" className="text-foreground hover:text-primary transition-smooth">Home</Link>
              <Link to="/rooms" className="text-foreground hover:text-primary transition-smooth">Rooms</Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-smooth">About</Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-smooth">Contact</Link>
              <Link to="/profile" className="text-foreground hover:text-primary transition-smooth">Profile</Link>
              <Link to="/booking">
                <Button variant="hero" size="sm" className="w-full">
                  Book Now
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;