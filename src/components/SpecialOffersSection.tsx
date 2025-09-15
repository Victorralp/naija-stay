import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Gift, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const SpecialOffersSection = () => {
  const offers = [
    {
      id: 1,
      title: "Weekend Getaway Special",
      description: "Enjoy 25% off stays on weekends in Lagos hotels. Perfect for relaxing getaways with family.",
      discount: "25% OFF",
      validUntil: "Dec 31, 2025",
      location: "Lagos",
      duration: "Weekends Only",
      featured: true
    },
    {
      id: 2,
      title: "Business Travel Package",
      description: "Special rates for business travelers including free WiFi, breakfast, and late checkout.",
      discount: "20% OFF",
      validUntil: "Nov 30, 2025",
      location: "Abuja",
      duration: "Mon-Thu",
      featured: false
    },
    {
      id: 3,
      title: "Extended Stay Deal",
      description: "Stay 7 nights or more and get the 8th night free. Ideal for long-term visitors.",
      discount: "1 FREE NIGHT",
      validUntil: "Jan 31, 2026",
      location: "Port Harcourt",
      duration: "7+ Nights",
      featured: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            Limited Time Offers
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Special Offers & Deals
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Take advantage of our exclusive deals and save on your next Nigerian adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className={`h-full overflow-hidden relative ${offer.featured ? 'border-primary shadow-lg' : ''}`}>
                {offer.featured && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                    <Badge variant="default" className="bg-primary text-primary-foreground text-xs sm:text-sm">
                      <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg sm:text-xl">{offer.title}</CardTitle>
                    <Badge variant="outline" className="text-base sm:text-lg font-bold">
                      {offer.discount}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2 text-sm sm:text-base">
                    {offer.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{offer.location}</span>
                  </div>
                
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>Valid until {offer.validUntil}</span>
                  </div>
                
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{offer.duration}</span>
                  </div>
                
                  <Button className="w-full mt-3 sm:mt-4 text-sm sm:text-base" variant={offer.featured ? "default" : "outline"}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
            Don't miss out on these limited-time offers
          </p>
          <Button variant="hero" size="lg" className="text-sm sm:text-base">
            View All Special Offers
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;