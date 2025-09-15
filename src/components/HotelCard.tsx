import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Wifi, Car, Coffee, Bed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hotel } from '@/types/hotel';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import SkeletonLoader from '@/components/SkeletonLoader';
import { analytics } from '@/utils/analytics';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms', hotel.id],
    queryFn: () => hotelService.getRoomsByHotel(hotel.id),
    enabled: !!hotel.id,
  });

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'free wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'restaurant':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Coffee className="w-4 h-4" />;
    }
  };

  // Get room count for this hotel
  const roomCount = rooms?.length || 0;

  const handleViewDetails = () => {
    analytics.trackEvent({
      category: 'Navigation',
      action: 'View Hotel Details',
      label: hotel.name
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
        {hotel.images?.[0] ? (
          <div className="h-48 bg-gray-200 relative overflow-hidden">
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {hotel.featured && (
              <motion.div 
                className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded animate-pulse"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                Featured
              </motion.div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="h-48 relative overflow-hidden">
            <SkeletonLoader width="100%" height="100%" />
          </div>
        )}
        
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
              {hotel.name || <SkeletonLoader width="80%" height="1.25rem" />}
            </CardTitle>
            <motion.div 
              className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 fill-current mr-1" />
              {hotel.rating || <SkeletonLoader width="1rem" height="1rem" />}
            </motion.div>
          </div>
          <div className="flex items-center text-gray-600 text-sm mt-2">
            <MapPin className="h-4 w-4 mr-2" />
            <span>
              {hotel.city && hotel.state 
                ? `${hotel.city}, ${hotel.state}` 
                : <SkeletonLoader width="60%" height="1rem" />}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow flex flex-col">
          <CardDescription className="mb-4 line-clamp-2">
            {hotel.description || <SkeletonLoader width="100%" height="2.5rem" />}
          </CardDescription>
          
          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities?.slice(0, 3).map((amenity, index) => (
              <motion.div 
                key={amenity} 
                className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {getFeatureIcon(amenity)}
                <span>{amenity}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Room count */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Bed className="h-4 w-4 mr-2" />
            <span>
              {roomsLoading ? (
                <SkeletonLoader width="80px" height="1rem" />
              ) : (
                `${roomCount} ${roomCount === 1 ? 'Room' : 'Rooms'} Available`
              )}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-auto">
            <div>
              <span className="text-2xl font-bold text-primary">
                {hotel.priceRange || <SkeletonLoader width="60px" height="1.5rem" />}
              </span>
              <span className="text-gray-500 text-sm block">per night</span>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="transition-transform duration-300" onClick={handleViewDetails}>
                <Link to={`/hotel/${hotel.id}`}>View Details</Link>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HotelCard;