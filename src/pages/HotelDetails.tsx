import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { useNavigate as useReactNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Star, Users, Bed, Wifi, Car, Coffee } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import HotelGallery from '@/components/HotelGallery';
import RoomDetails from '@/components/RoomDetails';
import WeatherWidget from '@/components/WeatherWidget';
import AvailabilityIndicator from '@/components/AvailabilityIndicator';

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reactNavigate = useReactNavigate();

  const { data: hotel, isLoading: hotelLoading, error: hotelError } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => id ? hotelService.getHotelById(id) : Promise.resolve(null),
    enabled: !!id,
  });

  const { data: rooms, isLoading: roomsLoading, error: roomsError } = useQuery({
    queryKey: ['rooms', id],
    queryFn: () => id ? hotelService.getRoomsByHotel(id) : Promise.resolve([]),
    enabled: !!id,
  });

  const handleBookNow = (roomId: string) => {
    reactNavigate(`/enhanced-booking?roomId=${roomId}&hotelId=${id}`);
  };

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

  if (hotelLoading || roomsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (hotelError || roomsError || !hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Hotel not found</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Create a Google Maps URL for the hotel location
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.state}, ${hotel.country}`)}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-muted transition-colors duration-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hotels
          </Button>
        </div>

        <div className="mb-8">
          {/* Hotel Gallery */}
          <div className="mb-6">
            <HotelGallery images={hotel.images || []} hotelName={hotel.name} />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{hotel.location}, {hotel.city}, {hotel.state}</span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <motion.div 
                className="flex items-center bg-secondary px-4 py-2 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-lg font-semibold">{hotel.rating}</span>
                <span className="ml-1 text-gray-600">/ 5</span>
              </motion.div>
              <AvailabilityIndicator hotelId={hotel.id} />
            </div>
          </div>

          {/* Weather Widget and Hotel Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader>
                  <CardTitle className="text-2xl">About this hotel</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p 
                    className="text-gray-700 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {hotel.description}
                  </motion.p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <WeatherWidget />
            </div>
          </div>

          {hotel.amenities && hotel.amenities.length > 0 && (
            <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center p-3 bg-muted rounded-lg hover:bg-primary/10 transition-colors duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="mr-3 text-primary">
                        {getFeatureIcon(amenity)}
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Google Maps Section */}
          <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">Location</CardTitle>
              <CardDescription>Find us on the map</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${hotel.city},${hotel.state}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${hotel.name} Location`}
                ></iframe>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 mb-2">
                  <MapPin className="inline h-5 w-5 mr-2 text-primary" />
                  {hotel.location}, {hotel.city}, {hotel.state}, {hotel.country}
                </p>
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Rooms</h2>
        
        {rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.2 }}
              >
                <RoomDetails 
                  room={room} 
                  onBookNow={handleBookNow}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No rooms available for this hotel.</p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <BookingForm hotelId={id!} rooms={rooms || []} />
      </motion.div>
    </div>
  );
};

export default HotelDetails;