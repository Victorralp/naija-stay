import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { bookingService } from '@/services/bookingService';
import { Room } from '@/types/hotel';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface BookingFormProps {
  hotelId: string;
  rooms: Room[];
}

interface BookingData {
  hotelId: string;
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  totalPrice: number;
  specialRequests: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

const BookingForm = ({ hotelId, rooms }: BookingFormProps) => {
  const { user } = useAuth();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  const mutation = useMutation({
    mutationFn: (bookingData: BookingData) =>
      bookingService.createBooking(bookingData),
    onSuccess: () => {
      toast.success('Booking created successfully!');
      // Reset form
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setSelectedRoomId('');
      setGuests(1);
      setSpecialRequests('');
    },
    onError: (error) => {
      toast.error('Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    }
  });

  const selectedRoom = rooms.find(room => room.id === selectedRoomId);

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !selectedRoom) return 0;
    return selectedRoom.pricePerNight * guests;
  };

  const totalPrice = calculateTotalPrice();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to make a booking');
      return;
    }

    if (!selectedRoomId || !checkInDate || !checkOutDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (guests > selectedRoom!.capacity) {
      toast.error(`This room can accommodate maximum ${selectedRoom!.capacity} guests`);
      return;
    }

    mutation.mutate({
      hotelId,
      userId: user.id,
      roomId: selectedRoomId,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      specialRequests,
      email: user.email || '',
      phone: user.phoneNumber || '',
      status: 'pending' as const,
      paymentStatus: 'pending' as const
    });
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">Book Your Stay</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => date < (checkInDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Room Type</Label>
            <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} - ₦{room.pricePerNight}/night (Max {room.capacity} guests)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max={selectedRoom?.capacity || 10}
              value={guests}
              onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          {selectedRoom && (
            <div className="text-lg font-semibold text-primary">
              Total for your stay: ₦{totalPrice}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <textarea
              id="specialRequests"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Any special requests or requirements..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCheckInDate(undefined);
                setCheckOutDate(undefined);
                setSelectedRoomId('');
                setGuests(1);
                setSpecialRequests('');
              }}
            >
              Clear Form
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Processing...' : 'Book Now'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;