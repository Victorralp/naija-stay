import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Star, Users, Bed } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import BookingForm from '@/components/BookingForm';

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hotels
        </Button>
      </div>

      <div className="mb-8">
        {hotel.images?.[0] && (
          <div className="h-96 rounded-lg overflow-hidden mb-6">
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{hotel.location}, {hotel.city}, {hotel.state}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-lg font-semibold">{hotel.rating}</span>
            <span className="ml-1 text-gray-600">/ 5</span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About this hotel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
          </CardContent>
        </Card>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
        
        {rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
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
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{room.name}</CardTitle>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-600 mr-1" />
                      <span className="text-sm text-gray-600">{room.capacity}</span>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {room.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{room.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">₦{room.pricePerNight}</span>
                      <span className="text-gray-500">/night</span>
                    </div>
                    {room.amenities && (
                      <div className="text-sm text-gray-600">
                        <Bed className="h-4 w-4 inline mr-1" />
                        {room.amenities.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No rooms available for this hotel.</p>
          </div>
        )}
      </div>

      <BookingForm hotelId={id!} rooms={rooms || []} />
    </div>
  );
};

export default HotelDetails;