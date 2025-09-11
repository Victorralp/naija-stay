import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedHotels from "@/components/FeaturedHotels";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedHotels />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
