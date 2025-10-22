import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-hotel.jpg";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";

const HeroSection = () => {
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.trackEvent({
      category: 'Search',
      action: 'Hotel Search',
      label: location
    });
    // Navigate to rooms page with search parameters
    navigate("/rooms");
  };

  const handleWatchVideo = () => {
    analytics.trackEvent({
      category: 'Engagement',
      action: 'Watch Video',
      label: 'Hero Section'
    });
  };

  const handleExploreHotels = () => {
    analytics.trackEvent({
      category: 'Navigation',
      action: 'Click CTA',
      label: 'Explore Hotels'
    });
    navigate("/rooms");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with subtle overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(${heroImage})` }}
      />
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10 hidden md:block"
        animate={{ 
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-16 h-16 gradient-hero rounded-full opacity-20"></div>
      </motion.div>
      
      <motion.div 
        className="absolute top-40 right-20 hidden md:block"
        animate={{ 
          y: [0, -15, 0],
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <div className="w-12 h-12 bg-secondary/30 rounded-full"></div>
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div 
          className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg p-6 md:p-8 lg:p-12 rounded-2xl md:rounded-3xl shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center space-x-2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 md:px-4 md:py-2 rounded-full mb-4 md:mb-6 shadow-lg text-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MapPin className="w-3 h-3 md:w-4 md:h-4" />
            <span className="font-medium">Premium Nigerian Hotels</span>
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
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
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground mb-6 md:mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Discover luxury accommodations across Lagos, Abuja, and Port Harcourt. 
            Book your perfect stay with authentic Nigerian warmth.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button 
              variant="hero" 
              size="lg" 
              className="text-base md:text-lg px-6 py-3 md:px-8 md:py-4"
              onClick={handleExploreHotels}
            >
              Explore Hotels
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base md:text-lg px-6 py-3 md:px-8 md:py-4 bg-white text-primary border-primary hover:bg-primary/10"
                  onClick={handleWatchVideo}
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Watch Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] p-0">
                <DialogHeader className="p-4">
                  <DialogTitle>Experience Nigerian Hospitality</DialogTitle>
                  <DialogDescription>
                    Take a virtual tour of our premium hotels across Nigeria
                  </DialogDescription>
                </DialogHeader>
                <div className="aspect-video bg-black flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-70" />
                    <p className="text-base md:text-lg">Hotel Tour Video</p>
                    <p className="text-xs md:text-sm opacity-75 mt-2">Coming soon</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
          
          {/* Quick Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Card className="max-w-4xl mx-auto bg-white shadow-xl border-0 p-4 md:p-6">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-foreground">Location</label>
                    <div className="flex items-center space-x-2 p-2 md:p-3 bg-muted/50 rounded-lg">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      <select 
                        className="bg-transparent text-foreground w-full focus:outline-none text-sm md:text-base"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                        <option value="Abuja, Nigeria">Abuja, Nigeria</option>
                        <option value="Port Harcourt, Nigeria">Port Harcourt, Nigeria</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-foreground">Check In</label>
                    <div className="flex items-center space-x-2 p-2 md:p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      <input 
                        type="date" 
                        className="bg-transparent text-foreground w-full focus:outline-none text-sm md:text-base"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-foreground">Guests</label>
                    <div className="flex items-center space-x-2 p-2 md:p-3 bg-muted/50 rounded-lg">
                      <Users className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      <select 
                        className="bg-transparent text-foreground w-full focus:outline-none text-sm md:text-base"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                      >
                        <option value="1 Adult">1 Adult</option>
                        <option value="2 Adults">2 Adults</option>
                        <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                        <option value="2 Adults, 2 Children">2 Adults, 2 Children</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button variant="hero" size="lg" className="h-10 md:h-12 text-sm md:text-base" type="submit">
                    Search Hotels
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Stats */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-foreground bg-white/90 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg">
          <div className="text-center cursor-pointer hover:text-primary transition-colors duration-300" 
               onClick={() => {
                 analytics.trackEvent({
                   category: 'Navigation',
                   action: 'Click Stat',
                   label: 'Premium Hotels'
                 });
                 navigate("/rooms");
               }}>
            <div className="text-xl md:text-2xl font-bold text-primary">50+</div>
            <div className="text-xs md:text-sm">Premium Hotels</div>
          </div>
          <div className="text-center cursor-pointer hover:text-primary transition-colors duration-300"
               onClick={() => {
                 analytics.trackEvent({
                   category: 'Navigation',
                   action: 'Click Stat',
                   label: 'Happy Guests'
                 });
               }}>
            <div className="text-xl md:text-2xl font-bold text-primary">10K+</div>
            <div className="text-xs md:text-sm">Happy Guests</div>
          </div>
          <div className="text-center cursor-pointer hover:text-primary transition-colors duration-300"
               onClick={() => {
                 analytics.trackEvent({
                   category: 'Navigation',
                   action: 'Click Stat',
                   label: 'Major Cities'
                 });
                 navigate("/rooms");
               }}>
            <div className="text-xl md:text-2xl font-bold text-primary">3</div>
            <div className="text-xs md:text-sm">Major Cities</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;