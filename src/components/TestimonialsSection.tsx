import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import testimonialImage from "@/assets/testimonial-family.jpg";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Adebayo Oladunni",
      role: "Business Executive, Lagos",
      rating: 5,
      text: "Exceptional service and authentic Nigerian hospitality. The staff went above and beyond to make our business conference successful. The facilities are world-class!",
      image: testimonialImage
    },
    {
      id: 2,
      name: "Kemi Adebisi",
      role: "Tourism Blogger, Abuja",
      rating: 5,
      text: "As someone who travels extensively across Nigeria, I can confidently say this is one of the finest hotel experiences in the country. The blend of modern luxury with Nigerian culture is perfect.",
      image: testimonialImage
    },
    {
      id: 3,
      name: "Emmanuel Okoro",
      role: "Family Vacation, Port Harcourt",
      rating: 5,
      text: "Our family vacation was absolutely magical! The kids loved the pool, and we enjoyed the amazing Nigerian cuisine. The staff treated us like royalty from check-in to check-out.",
      image: testimonialImage
    }
  ];

  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 border-background/30 text-background">Guest Stories</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-background mb-6">
            What Our
            <span className="text-secondary"> Guests </span>
            Say About Us
          </h2>
          <p className="text-lg text-background/80">
            Real experiences from travelers who chose to stay with us across Nigeria's premier destinations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="bg-background/10 backdrop-blur-sm border-background/20 hover:bg-background/15 transition-all duration-300 hover:-translate-y-2 shadow-warm animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-secondary opacity-60" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>
                
                {/* Testimonial Text */}
                <p className="text-background/90 leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
                
                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-background font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-background">{testimonial.name}</h4>
                    <p className="text-sm text-background/70">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">10K+</div>
            <div className="text-background/80">Happy Guests</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">50+</div>
            <div className="text-background/80">Premium Hotels</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">98%</div>
            <div className="text-background/80">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">24/7</div>
            <div className="text-background/80">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;