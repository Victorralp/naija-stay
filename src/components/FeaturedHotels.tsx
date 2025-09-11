import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Wifi, Car, Coffee, Waves } from "lucide-react";
import iiiImage from "../../iii.jpeg";

const FeaturedHotels = () => {
  // Sample hotel data - this would come from Supabase in the full implementation
  const hotels = [
    {
      id: 1,
      name: "The Lagos Grand Resort",
      location: "Victoria Island, Lagos",
      price: "₦45,000",
      rating: 4.8,
      reviews: 234,
      image: "/api/placeholder/400/300",
      features: ["Free WiFi", "Pool", "Parking", "Restaurant"],
      badge: "Most Popular"
    },
    {
      id: 2,
      name: "Abuja Presidential Suite",
      location: "Maitama, Abuja",
      price: "₦65,000",
      rating: 4.9,
      reviews: 189,
      image: "/api/placeholder/400/300",
      features: ["Free WiFi", "Spa", "Gym", "Conference"],
      badge: "Luxury"
    },
    {
      id: 3,
      name: "Port Harcourt Business Hotel",
      location: "GRA, Port Harcourt",
      price: "₦35,000",
      rating: 4.7,
      reviews: 156,
      image: "/api/placeholder/400/300",
      features: ["Free WiFi", "Business Center", "Airport Shuttle"],
      badge: "Business"
    }
  ];

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'free wifi':
        return <Wifi className="w-4 h-4" />;
      case 'pool':
        return <Waves className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'restaurant':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Coffee className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Featured Properties</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Discover Our
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
              Premium
            </span>
            Hotels
          </h2>
          <p className="text-lg text-muted-foreground">
            Hand-picked luxury accommodations across Nigeria's major cities, 
            offering world-class amenities and authentic Nigerian hospitality.
          </p>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, index) => (
            <Card 
              key={hotel.id} 
              className="group overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hotel Image */}
              <div className="relative overflow-hidden h-64">
                <div 
                  className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${hotel.image})` }}
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="shadow-soft">
                    {hotel.badge}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                  <span className="text-xs text-muted-foreground">({hotel.reviews})</span>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Hotel Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">{hotel.name}</h3>
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="flex items-center space-x-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      {getFeatureIcon(feature)}
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price and Booking */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-foreground">{hotel.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">/night</span>
                  </div>
                  <Button variant="default" size="sm" className="transition-smooth">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Hotels
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;