import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-hotel.jpg";
import iiiImage from "../../iii.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with subtle overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(${heroImage})` }}
      />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 gradient-hero rounded-full opacity-20"></div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: "1s" }}>
        <div className="w-12 h-12 bg-secondary/30 rounded-full"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full mb-6 animate-fade-in shadow-lg">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Premium Nigerian Hotels</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Experience 
            <span
              className="relative inline-block"
              style={{
                background: `linear-gradient(45deg, #228B22, #FFD700, #228B22, #FFD700)`,
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientShift 2s ease-in-out infinite",
                fontWeight: "900",
                color: "#228B22", // Fallback color for browsers that don't support bg-clip-text
              }}
            >
              {" "}
              Nigerian
            </span>
            <br />
            Hospitality
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Discover luxury accommodations across Lagos, Abuja, and Port Harcourt. 
            Book your perfect stay with authentic Nigerian warmth.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Explore Hotels
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white text-primary border-primary hover:bg-primary/10">
              Watch Video
            </Button>
          </div>
          
          {/* Quick Booking Card */}
          <Card className="max-w-4xl mx-auto bg-white shadow-xl border-0 p-6 animate-scale-in" style={{ animationDelay: "0.6s" }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Location</label>
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Lagos, Nigeria</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Check In</label>
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Select Date</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Guests</label>
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-foreground">2 Adults</span>
                </div>
              </div>
              
              <Button variant="hero" size="lg" className="h-12">
                Search Hotels
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Stats */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-8 text-foreground bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-sm">Premium Hotels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">10K+</div>
            <div className="text-sm">Happy Guests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-sm">Major Cities</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;