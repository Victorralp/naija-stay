import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Car, Coffee, Waves, Utensils, Shield, Headphones, Dumbbell } from "lucide-react";
import spaImage from "@/assets/spa-wellness.jpg";
import iiiImage from "../../iii.jpeg";

const ServicesSection = () => {
  const services = [
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Free High-Speed WiFi",
      description: "Stay connected with complimentary internet access throughout the property"
    },
    {
      icon: <Waves className="w-6 h-6" />,
      title: "Swimming Pool & Spa",
      description: "Relax in our temperature-controlled pools and rejuvenating spa facilities"
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Fine Dining",
      description: "Experience authentic Nigerian cuisine and international dishes in our restaurants"
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Valet Parking",
      description: "Secure parking with professional valet service for your convenience"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "24/7 Security",
      description: "Round-the-clock security ensuring your safety and peace of mind"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Concierge Service",
      description: "Personalized assistance to help you explore the best of Nigeria"
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Fitness Center",
      description: "State-of-the-art gym equipment available 24 hours a day"
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Business Center",
      description: "Modern facilities for meetings, conferences, and business needs"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Premium Services</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            World-Class
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
              Amenities
            </span>
            & Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience exceptional hospitality with our comprehensive range of services 
            designed to make your stay unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card 
                key={service.title}
                className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 gradient-hero rounded-lg flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-elegant">
              <img 
                src={spaImage} 
                alt="Luxury spa and wellness facilities"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-center">
                <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl inline-block">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Wellness & Relaxation
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed">
                    Indulge in our world-class spa treatments inspired by traditional Nigerian wellness practices
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating Stats */}
            <Card className="absolute -top-6 -right-6 bg-background shadow-elegant animate-float">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-xs text-muted-foreground">Guest Satisfaction</div>
              </CardContent>
            </Card>
            
            <Card className="absolute -bottom-6 -left-6 bg-background shadow-elegant animate-float" style={{ animationDelay: "1.5s" }}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">24/7</div>
                <div className="text-xs text-muted-foreground">Premium Service</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;