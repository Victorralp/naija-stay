import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CalendarIcon, 
  Users, 
  Bed, 
  Mail, 
  Phone, 
  User,
  CreditCard,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';
import { bookingService } from '@/services/bookingService';
import { Room } from '@/types/hotel';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

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
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setCurrentStep(1);
    },
    onError: (error) => {
      toast.error('Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    }
  });

  const selectedRoom = rooms.find(room => room.id === selectedRoomId);

  // Set user info if available
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
      if (user.displayName) {
        const names = user.displayName.split(' ');
        setFirstName(names[0] || '');
        setLastName(names.slice(1).join(' ') || '');
      }
    }
  }, [user]);

  // Set default dates
  useEffect(() => {
    if (!checkInDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCheckInDate(tomorrow);
      
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      setCheckOutDate(dayAfterTomorrow);
    }
  }, [checkInDate]);

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !selectedRoom) return 0;
    
    // Calculate number of nights
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return selectedRoom.pricePerNight * guests * diffDays;
  };

  const totalPrice = calculateTotalPrice();
  const nights = checkInDate && checkOutDate ? 
    Math.ceil(Math.abs(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

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

    if (checkOutDate <= checkInDate) {
      toast.error('Check-out date must be after check-in date');
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
      email: email || user.email || '',
      phone: phone || user.phoneNumber || '',
      status: 'pending' as const,
      paymentStatus: 'pending' as const
    });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Bed className="mr-2 h-6 w-6" />
            Book Your Stay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === step ? 'bg-primary text-primary-foreground' : 
                      currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}>
                      {currentStep > step ? '✓' : step}
                    </div>
                    <span className="mt-2 text-xs font-medium">
                      {step === 1 ? 'Dates' : step === 2 ? 'Info' : 'Confirm'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Date Selection */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="checkIn" className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Check-in Date
                    </Label>
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
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="checkOut" className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Check-out Date
                    </Label>
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
                  </motion.div>
                </div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="room" className="flex items-center">
                    <Bed className="mr-2 h-4 w-4" />
                    Room Type
                  </Label>
                  <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} - {formatCurrency(room.pricePerNight)}/night (Max {room.capacity} guests)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="guests" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Number of Guests
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={selectedRoom?.capacity || 10}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full"
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Guest Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    rows={3}
                    placeholder="Any special requests or requirements..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {selectedRoom && checkInDate && checkOutDate && (
                  <motion.div 
                    className="text-lg font-semibold text-primary p-4 bg-primary/10 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <span>Total for your stay:</span>
                      <span className="text-2xl font-bold">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {format(checkInDate, "MMM d, yyyy")} - {format(checkOutDate, "MMM d, yyyy")} 
                      ({nights} nights)
                    </div>
                  </motion.div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      By confirming this booking, you agree to our terms and conditions. 
                      You will receive a confirmation email shortly.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <motion.div 
              className="flex justify-between pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 3 ? (
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && (!selectedRoomId || !checkInDate || !checkOutDate)) ||
                    (currentStep === 2 && (!firstName || !lastName || !email))
                  }
                >
                  Next
                </Button>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="transition-all duration-300"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {mutation.isPending ? 'Processing...' : 'Confirm Booking'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookingForm;