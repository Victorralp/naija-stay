import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Award, Globe, Users } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Nigerian Warmth",
      description: "Experience the legendary hospitality that Nigeria is famous for worldwide"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "Award-winning service standards that exceed international hospitality benchmarks"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cultural Heritage",
      description: "Authentic Nigerian experiences blended with modern luxury amenities"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Supporting local communities and showcasing the best of Nigerian culture"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">About Naija Hotels</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Celebrating
            <span className="gradient-hero bg-clip-text text-transparent"> Nigerian </span>
            Hospitality Since 2010
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Born from a passion to showcase Nigeria's incredible hospitality to the world, 
            Naija Hotels has become the premier destination for luxury accommodations across 
            the country. We blend traditional Nigerian warmth with world-class amenities to 
            create unforgettable experiences for our guests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Story Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Our Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                What started as a single boutique hotel in Lagos has grown into Nigeria's 
                most trusted hospitality brand. We've welcomed over 50,000 guests from 
                around the world, each leaving with memories of authentic Nigerian experiences 
                and exceptional service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we operate premium hotels across Lagos, Abuja, and Port Harcourt, 
                each carefully designed to reflect the unique character of its location 
                while maintaining our signature standards of luxury and service.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center shadow-soft">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">14+</div>
                  <div className="text-sm text-muted-foreground">Years of Excellence</div>
                </CardContent>
              </Card>
              <Card className="text-center shadow-soft">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-secondary mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Guests</div>
                </CardContent>
              </Card>
            </div>

            <Button variant="hero" size="lg" className="w-full sm:w-auto">
              Read Our Full Story
            </Button>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card 
                key={value.title}
                className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center text-primary-foreground mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-3">{value.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <Card className="max-w-4xl mx-auto shadow-elegant gradient-card">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-foreground mb-6">Our Mission</h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                "To be the bridge between Nigeria's rich cultural heritage and world-class 
                hospitality, creating authentic experiences that celebrate our nation's warmth, 
                diversity, and excellence while setting new standards for luxury accommodation in Africa."
              </p>
              <div className="mt-8 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;