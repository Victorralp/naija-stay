
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bed, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoomsList = () => {
  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: hotelService.getAvailableRooms,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading rooms</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No rooms found</h2>
          <p className="text-gray-600">Check back later for available rooms.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Rooms</h1>
        <p className="text-gray-600">Find the perfect room for your stay</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {room.images?.[0] && (
              <div className="h-48 bg-gray-200">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{room.name}</CardTitle>
              <div className="flex items-center text-gray-600 text-sm mt-2">
                <Bed className="h-4 w-4 mr-2" />
                <span>{room.type}</span>
                <Users className="h-4 w-4 mr-2 ml-4" />
                <span>{room.capacity} Guests</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-2">
                {room.description}
              </CardDescription>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-primary flex items-center">
                    N{room.pricePerNight}
                  </span>
                  <span className="text-gray-500">/night</span>
                </div>
                <Button asChild>
                  <Link to={`/booking?roomId=${room.id}`}>Book Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomsList;
