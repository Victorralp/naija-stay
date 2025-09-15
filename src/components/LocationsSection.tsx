import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Users, Star } from "lucide-react";
import lagosImage from "@/assets/lagos-skyline.jpg";
import iiiImage from "../../iii.jpeg";

const LocationsSection = () => {
  const locations = [
    {
      city: "Lagos",
      state: "Lagos State",
      hotels: 25,
      description: "Nigeria's commercial capital with stunning beaches, vibrant nightlife, and world-class business districts.",
      highlights: ["Victoria Island", "Lekki Peninsula", "Ikoyi", "Marina"],
      rating: 4.8,
      image: lagosImage,
      priceRange: "₦35,000 - ₦85,000"
    },
    {
      city: "Abuja",
      state: "Federal Capital Territory",
      hotels: 18,
      description: "The modern capital city featuring impressive architecture, government districts, and cultural landmarks.",
      highlights: ["Maitama", "Asokoro", "Wuse", "Central Business District"],
      rating: 4.9,
      image: lagosImage,
      priceRange: "₦40,000 - ₦95,000"
    },
    {
      city: "Port Harcourt",
      state: "Rivers State",
      hotels: 12,
      description: "The oil capital with rich cultural heritage, beautiful gardens, and thriving business community.",
      highlights: ["GRA", "Old Township", "Trans Amadi", "Rumuola"],
      rating: 4.7,
      image: lagosImage,
      priceRange: "₦30,000 - ₦70,000"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Our Locations</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Discover
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
                color: "#228B22",
              }}
            >
              {" "}
              Nigeria's
            </span>
            Premier Cities
          </h2>
          <p className="text-lg text-muted-foreground">
            From the bustling streets of Lagos to the modern architecture of Abuja, 
            experience the best of Nigerian hospitality in our carefully selected locations.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <Card 
              key={location.city}
              className="group overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* City Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={location.image} 
                  alt={`${location.city} cityscape`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
                
                {/* City Info Overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex justify-between items-start">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg">
                      <h3 className="text-2xl font-bold text-foreground">{location.city}</h3>
                      <p className="text-foreground text-sm">{location.state}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="text-foreground text-sm font-medium">{location.rating}</span>
                    </div>
                  </div>
                </div>
                
                {/* Hotels Count */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full">
                    <Building2 className="w-4 h-4 text-secondary" />
                    <span className="text-foreground text-sm font-medium">{location.hotels} Hotels</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {location.description}
                </p>
                
                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Popular Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {location.highlights.slice(0, 3).map((highlight) => (
                      <Badge key={highlight} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Price range per night</div>
                    <div className="font-semibold text-foreground">{location.priceRange}</div>
                  </div>
                </div>
                
                {/* Action Button */}
                <Button variant="default" className="w-full transition-smooth">
                  <MapPin className="w-4 h-4 mr-2" />
                  Explore {location.city} Hotels
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Experience Nigerian Hospitality?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of satisfied guests who have made unforgettable memories with us across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="px-8">
                Browse All Hotels
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;