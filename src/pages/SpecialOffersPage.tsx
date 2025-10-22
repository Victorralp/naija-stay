import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Gift, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  location: string;
  duration: string;
  featured: boolean;
  terms: string;
}

const SpecialOffersPage = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch special offers from Firebase
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const offersSnapshot = await getDocs(collection(db, 'specialOffers'));
        const fetchedOffers = offersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            validUntil: data.validUntil ? 
              (typeof data.validUntil.toDate === 'function' ? 
                data.validUntil.toDate().toISOString().split('T')[0] : 
                data.validUntil) : 
              new Date().toISOString().split('T')[0],
            terms: data.terms || ''
          } as SpecialOffer;
        });
        setOffers(fetchedOffers);
      } catch (error) {
        console.error('Error fetching special offers:', error);
        // Fallback to hardcoded data if Firebase fetch fails
        setOffers([
          {
            id: '1',
            title: "Weekend Getaway Special",
            description: "Enjoy 25% off stays on weekends in Lagos hotels. Perfect for relaxing getaways with family. This exclusive offer includes complimentary breakfast for two and late checkout until 2 PM.",
            discount: "25% OFF",
            validUntil: "2025-12-31",
            location: "Lagos",
            duration: "Weekends Only",
            featured: true,
            terms: "Minimum 2-night stay required. Cannot be combined with other offers. Subject to availability."
          },
          {
            id: '2',
            title: "Business Travel Package",
            description: "Special rates for business travelers including free WiFi, breakfast, and late checkout. Perfect for corporate travelers who need comfort and convenience during their stay.",
            discount: "20% OFF",
            validUntil: "2025-11-30",
            location: "Abuja",
            duration: "Mon-Thu",
            featured: false,
            terms: "Valid for business travelers only. Must present business card at check-in. Advance booking required."
          },
          {
            id: '3',
            title: "Extended Stay Deal",
            description: "Stay 7 nights or more and get the 8th night free. Ideal for long-term visitors, digital nomads, or extended business trips. Includes weekly housekeeping and special amenities.",
            discount: "1 FREE NIGHT",
            validUntil: "2026-01-31",
            location: "Port Harcourt",
            duration: "7+ Nights",
            featured: false,
            terms: "Continuous stay required. Cannot be combined with other offers. Subject to availability."
          },
          {
            id: '4',
            title: "Honeymoon Special",
            description: "Celebrate your love with our romantic package. Includes champagne on arrival, couples spa treatment, candlelit dinner, and room decoration. Perfect for newlyweds.",
            discount: "30% OFF",
            validUntil: "2025-12-31",
            location: "Lagos, Abuja",
            duration: "All Year",
            featured: true,
            terms: "Proof of marriage required within 6 months. Advance booking required. Subject to availability."
          },
          {
            id: '5',
            title: "Student Discount",
            description: "Special accommodation rates for students. Enjoy comfortable stays at budget-friendly prices. Perfect for educational trips, internships, or academic conferences.",
            discount: "15% OFF",
            validUntil: "ongoing",
            location: "All Locations",
            duration: "All Year",
            featured: false,
            terms: "Valid student ID required. Limited rooms available. Advance booking recommended."
          },
          {
            id: '6',
            title: "Senior Citizen Package",
            description: "Special rates and amenities for our senior guests. Includes complimentary airport transfer, special dietary options, and priority check-in for a comfortable experience.",
            discount: "20% OFF",
            validUntil: "ongoing",
            location: "All Locations",
            duration: "All Year",
            featured: false,
            terms: "Valid ID required for age verification. Subject to availability. Cannot be combined with other offers."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 text-sm">
            Exclusive Deals
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Special Offers & Deals
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take advantage of our exclusive deals and save on your next Nigerian adventure. 
            Limited time offers that make your stay even more memorable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className={`h-full overflow-hidden relative ${offer.featured ? 'border-primary shadow-lg' : ''}`}>
                {offer.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      <Gift className="w-4 h-4 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{offer.title}</CardTitle>
                    <Badge variant="outline" className="text-lg font-bold">
                      {offer.discount}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2">
                    {offer.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{offer.location}</span>
                  </div>
                
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>
                
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{offer.duration}</span>
                  </div>
                
                  <div className="pt-4">
                    <Link to="/rooms" className="w-full">
                      <Button className="w-full" variant={offer.featured ? "default" : "outline"}>
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>All offers are subject to availability and cannot be combined with other promotions</li>
            <li>Advance booking is required for all special offers</li>
            <li>Management reserves the right to modify or withdraw offers without prior notice</li>
            <li>Specific terms and conditions apply to each offer (see individual offer details)</li>
            <li>Offers valid for direct bookings through our website or customer service</li>
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            These exclusive deals are available for a limited time only. Book your stay today and enjoy 
            significant savings on your Nigerian adventure.
          </p>
          <Link to="/rooms">
            <Button size="lg" className="text-lg px-8 py-6">
              Explore Our Hotels
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersPage;