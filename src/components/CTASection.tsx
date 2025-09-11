import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift, Mail, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main CTA Content */}
          <div className="space-y-8">
            <div>
              <Badge variant="secondary" className="mb-4">Special Offer</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Experience
                <span className="gradient-hero bg-clip-text text-transparent"> Nigerian </span>
                Hospitality?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Book your stay today and discover why thousands choose Naija Hotels 
                for their Nigerian adventures. Get exclusive deals and insider tips 
                delivered directly to your inbox.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-foreground">Exclusive discounts up to 25% off</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-foreground">Free cancellation up to 48 hours</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-foreground">Personalized travel recommendations</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="flex-1 sm:flex-none px-8">
                Book Your Stay Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-none px-8">
                Call +234 809 123 4567
              </Button>
            </div>
          </div>

          {/* Newsletter Signup Card */}
          <Card className="shadow-elegant gradient-card border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Stay Connected
                </h3>
                <p className="text-muted-foreground">
                  Join our newsletter for exclusive deals, travel tips, and updates on new hotel openings across Nigeria.
                </p>
              </div>

              {/* Newsletter Form */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Input 
                    type="text" 
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                  <Input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="w-full"
                  />
                </div>
                
                <Button variant="hero" size="lg" className="w-full">
                  Subscribe to Newsletter
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By subscribing, you agree to our Privacy Policy and Terms of Service. 
                  Unsubscribe anytime with one click.
                </p>
              </div>

              {/* Social Proof */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <div className="text-center">
                    <div className="font-semibold text-foreground">5K+</div>
                    <div>Subscribers</div>
                  </div>
                  <div className="w-px h-8 bg-border"></div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">Weekly</div>
                    <div>Updates</div>
                  </div>
                  <div className="w-px h-8 bg-border"></div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">25%</div>
                    <div>Avg. Savings</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto gradient-hero text-primary-foreground shadow-elegant">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                🇳🇬 Experience Authentic Nigeria 🇳🇬
              </h3>
              <p className="text-primary-foreground/90 text-lg mb-6">
                From bustling Lagos to modern Abuja, create unforgettable memories 
                with Nigeria's premier hospitality brand.
              </p>
              <Button variant="secondary" size="lg" className="px-8">
                Start Your Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;