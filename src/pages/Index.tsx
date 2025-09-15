import HeroSection from "@/components/HeroSection";
import FeaturedHotels from "@/components/FeaturedHotels";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LocationsSection from "@/components/LocationsSection";
import CTASection from "@/components/CTASection";
import SpecialOffersSection from "@/components/SpecialOffersSection";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";
import MobileAppSection from "@/components/MobileAppSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import { useEffect } from "react";
import { performanceMonitor } from "@/utils/performance";

const Index = () => {
  useEffect(() => {
    // Measure page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    performanceMonitor.measurePageLoad('HomePage', loadTime);
  }, []);

  return (
    <main>
        <HeroSection />
        <SpecialOffersSection />
        <FeaturedHotels />
        <ServicesSection />
        <AboutSection />
        <TestimonialsSection />
        <LocationsSection />
        <BlogSection />
        <FAQSection />
        <SocialMediaSection />
        <MobileAppSection />
        <CTASection />
      </main>
  );
};

export default Index;