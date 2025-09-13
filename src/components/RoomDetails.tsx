import { Bed, Users, Wifi, Car, Coffee, Tv, Utensils, Dumbbell, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Room } from '@/types/hotel';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface RoomDetailsProps {
  room: Room;
  onBookNow: (roomId: string) => void;
}

const RoomDetails = ({ room, onBookNow }: RoomDetailsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'restaurant':
        return <Utensils className="w-4 h-4" />;
      case 'gym':
        return <Dumbbell className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      default:
        return <Coffee className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        {room.images?.[0] && (
          <motion.div 
            className="h-64 bg-gray-200 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={room.images[0]}
              alt={room.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </motion.div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-2xl">{room.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  {room.type}
                </CardDescription>
              </motion.div>
            </div>
            <motion.div 
              className="flex items-center bg-secondary px-2 py-1 rounded"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Users className="h-4 w-4 text-secondary-foreground mr-1" />
              <span className="text-sm text-secondary-foreground">{room.capacity} Guests</span>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.p 
            className="text-gray-700 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {room.description}
          </motion.p>
          
          {/* Room amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-3">Room Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {room.amenities.map((amenity, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center p-2 bg-muted rounded-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="mr-2 text-primary">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Availability calendar */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-semibold mb-3">Check Availability</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div className="flex-1">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Date</h4>
                  {selectedDate ? (
                    <p className="text-lg">{format(selectedDate, 'PPP')}</p>
                  ) : (
                    <p className="text-muted-foreground">Please select a date</p>
                  )}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Room Status</h4>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 500 }}
                    >
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Available
                      </Badge>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Pricing and booking */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div>
              <span className="text-3xl font-bold text-primary">{formatCurrency(room.pricePerNight)}</span>
              <span className="text-gray-500">/night</span>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => onBookNow(room.id)}
              >
                <Bed className="w-4 h-4 mr-2" />
                Book This Room
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoomDetails;