import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { hotelService } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { 
  CalendarIcon, 
  MapPin, 
  Star, 
  Users, 
  Bed, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell, 
  Tv, 
  Utensils,
  ArrowLeft,
  Loader2,
  CheckCircle,
  CreditCard,
  User,
  Phone,
  Mail,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/formatters';

const EnhancedBookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  const roomId = searchParams.get('roomId');
  const hotelId = searchParams.get('hotelId');
  
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [selectedRoomId, setSelectedRoomId] = useState(roomId || '');
  const [selectedHotelId, setSelectedHotelId] = useState(hotelId || '');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Fetch hotel data
  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ['hotel', selectedHotelId],
    queryFn: () => selectedHotelId ? hotelService.getHotelById(selectedHotelId) : Promise.resolve(null),
    enabled: !!selectedHotelId,
  });

  // Fetch rooms for selected hotel
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms', selectedHotelId],
    queryFn: () => selectedHotelId ? hotelService.getRoomsByHotel(selectedHotelId) : Promise.resolve([]),
    enabled: !!selectedHotelId,
  });

  // Fetch all hotels for selection
  const { data: allHotels } = useQuery({
    queryKey: ['all-hotels'],
    queryFn: hotelService.getHotels,
  });

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

  // Set selected room when roomId is provided in URL
  useEffect(() => {
    if (roomId) {
      setSelectedRoomId(roomId);
    }
  }, [roomId]);

  // Set selected hotel when hotelId is provided in URL
  useEffect(() => {
    if (hotelId) {
      setSelectedHotelId(hotelId);
    }
  }, [hotelId]);

  const selectedRoom = rooms?.find(room => room.id === selectedRoomId);

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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to make a booking');
      navigate('/auth');
      return;
    }

    if (!selectedHotelId || !selectedRoomId || !checkInDate || !checkOutDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (guests > (selectedRoom?.capacity || 10)) {
      toast.error(`This room can accommodate maximum ${selectedRoom?.capacity} guests`);
      return;
    }

    try {
      const bookingData = {
        hotelId: selectedHotelId,
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
      };

      const newBookingId = await bookingService.createBooking(bookingData);
      setBookingId(newBookingId);
      setIsBookingConfirmed(true);
      toast.success('Booking created successfully!');
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    }
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

  if (hotelLoading || roomsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isBookingConfirmed && bookingId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="mb-6"
            >
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Booking Confirmed!
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Thank you for your booking. Your reservation has been confirmed.
            </motion.p>
            
            <motion.div 
              className="bg-muted p-6 rounded-lg mb-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Booking ID:</span> {bookingId}</p>
                <p><span className="font-medium">Hotel:</span> {hotel?.name}</p>
                <p><span className="font-medium">Room:</span> {selectedRoom?.name}</p>
                <p><span className="font-medium">Check-in:</span> {checkInDate ? format(checkInDate, "PPP") : ''}</p>
                <p><span className="font-medium">Check-out:</span> {checkOutDate ? format(checkOutDate, "PPP") : ''}</p>
                <p><span className="font-medium">Guests:</span> {guests}</p>
                <p><span className="font-medium">Total:</span> {formatCurrency(totalPrice)}</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button onClick={() => navigate(`/booking-confirmation/${bookingId}`)}>
                View Booking Details
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Review your details and confirm your reservation</p>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
            {[1, 2, 3].map((step) => (
              <motion.div 
                key={step}
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step * 0.1 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step ? 'bg-primary text-primary-foreground' : 
                  currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                <span className="mt-2 text-sm font-medium">
                  {step === 1 ? 'Details' : step === 2 ? 'Guest Info' : 'Confirm'}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Booking Details'}
                  {currentStep === 2 && 'Guest Information'}
                  {currentStep === 3 && 'Confirm Booking'}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Select your stay dates and room preferences'}
                  {currentStep === 2 && 'Provide your personal information'}
                  {currentStep === 3 && 'Review and confirm your booking details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  {/* Step 1: Booking Details */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Hotel Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="hotel">Hotel</Label>
                        <Select 
                          value={selectedHotelId} 
                          onValueChange={setSelectedHotelId}
                          disabled={!!hotelId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a hotel" />
                          </SelectTrigger>
                          <SelectContent>
                            {allHotels?.map((hotel) => (
                              <SelectItem key={hotel.id} value={hotel.id}>
                                {hotel.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Date Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="checkIn">Check-in Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="w-full justify-start text-left font-normal"
                                disabled={!selectedHotelId}
                              >
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
                              <Button 
                                variant="outline" 
                                className="w-full justify-start text-left font-normal"
                                disabled={!selectedHotelId}
                              >
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

                      {/* Room Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="room">Room Type</Label>
                        <Select 
                          value={selectedRoomId} 
                          onValueChange={setSelectedRoomId}
                          disabled={!selectedHotelId || !rooms || rooms.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms?.map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.name} - {formatCurrency(room.pricePerNight)}/night (Max {room.capacity} guests)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Guest Information */}
                      <div className="space-y-2">
                        <Label htmlFor="guests">Number of Guests</Label>
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          max={selectedRoom?.capacity || 10}
                          value={guests}
                          onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                          disabled={!selectedRoomId}
                        />
                      </div>
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
                      
                      {/* Special Requests */}
                      <div className="space-y-2">
                        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                        <Textarea
                          id="specialRequests"
                          rows={4}
                          placeholder="Any special requests or requirements..."
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Confirm Booking */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <Card className="border-2 border-primary">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                          
                          {/* Hotel Info */}
                          {hotel && (
                            <div className="mb-4 pb-4 border-b">
                              <h4 className="font-semibold text-lg">{hotel.name}</h4>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{hotel.city}, {hotel.state}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                                <span>{hotel.rating}/5</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Room Info */}
                          {selectedRoom && (
                            <div className="mb-4 pb-4 border-b">
                              <h4 className="font-semibold">{selectedRoom.name}</h4>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Bed className="h-4 w-4 mr-1" />
                                <span>{selectedRoom.type}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Users className="h-4 w-4 mr-1" />
                                <span>Max {selectedRoom.capacity} guests</span>
                              </div>
                              
                              {/* Room amenities */}
                              {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                                <div className="mt-2">
                                  <h5 className="text-sm font-medium mb-1">Amenities:</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedRoom.amenities.slice(0, 5).map((amenity, index) => (
                                      <span 
                                        key={index} 
                                        className="flex items-center text-xs bg-muted px-2 py-1 rounded"
                                      >
                                        <span className="mr-1">{getAmenityIcon(amenity)}</span>
                                        {amenity}
                                      </span>
                                    ))}
                                    {selectedRoom.amenities.length > 5 && (
                                      <span className="text-xs bg-muted px-2 py-1 rounded">
                                        +{selectedRoom.amenities.length - 5} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Dates and Guests */}
                          <div className="mb-4 pb-4 border-b">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-gray-600">Check-in:</span>
                                <p className="font-medium">{checkInDate ? format(checkInDate, "PPP") : ''}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Check-out:</span>
                                <p className="font-medium">{checkOutDate ? format(checkOutDate, "PPP") : ''}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Nights:</span>
                                <p className="font-medium">{nights}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Guests:</span>
                                <p className="font-medium">{guests}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price Summary */}
                          {selectedRoom && (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  {formatCurrency(selectedRoom.pricePerNight)} × {nights} night(s) × {guests} guest(s)
                                </span>
                                <span>{formatCurrency(selectedRoom.pricePerNight * nights * guests)}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                <span>Total:</span>
                                <span>{formatCurrency(totalPrice)}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
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

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4">
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
                          (currentStep === 1 && (!selectedHotelId || !selectedRoomId || !checkInDate || !checkOutDate)) ||
                          (currentStep === 2 && (!firstName || !lastName || !email))
                        }
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={!selectedHotelId || !selectedRoomId || !checkInDate || !checkOutDate}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Summary */}
          <div>
            {selectedHotelId && hotel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Hotel Info */}
                    <div>
                      <h3 className="font-semibold text-lg">{hotel.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{hotel.city}, {hotel.state}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{hotel.rating}/5</span>
                      </div>
                    </div>
                    
                    {/* Room Info */}
                    {selectedRoom && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold">{selectedRoom.name}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{selectedRoom.type}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Max {selectedRoom.capacity} guests</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Dates */}
                    {checkInDate && checkOutDate && (
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in:</span>
                          <span>{format(checkInDate, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-out:</span>
                          <span>{format(checkOutDate, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex justify-between font-semibold mt-2">
                          <span>Nights:</span>
                          <span>{nights}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Guests */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span>{guests}</span>
                      </div>
                    </div>
                    
                    {/* Price Summary */}
                    {selectedRoom && (
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {formatCurrency(selectedRoom.pricePerNight)} × {nights} night(s) × {guests} guest(s)
                          </span>
                          <span>{formatCurrency(selectedRoom.pricePerNight * nights * guests)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                          <span>Total:</span>
                          <span>{formatCurrency(totalPrice)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookingPage;