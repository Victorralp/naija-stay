import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import { hotelService } from '@/services/hotelService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Users, 
  Bed, 
  ArrowLeft, 
  Printer,
  Download,
  Mail,
  Phone,
  CreditCard,
  Clock,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/formatters';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [isVisible, setIsVisible] = useState(false);

  // Fetch booking data
  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingId ? bookingService.getBookingById(bookingId) : Promise.resolve(null),
    enabled: !!bookingId,
  });

  // Fetch hotel data
  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ['hotel', booking?.hotelId],
    queryFn: () => booking?.hotelId ? hotelService.getHotelById(booking.hotelId) : Promise.resolve(null),
    enabled: !!booking?.hotelId,
  });

  // Fetch room data
  const { data: room, isLoading: roomLoading } = useQuery({
    queryKey: ['room', booking?.roomId],
    queryFn: () => booking?.roomId ? hotelService.getRoomById(booking.roomId) : Promise.resolve(null),
    enabled: !!booking?.roomId,
  });

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('Downloading booking confirmation as PDF...');
  };

  if (bookingLoading || hotelLoading || roomLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!booking || !hotel || !room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the booking details you're looking for.</p>
          <Button onClick={() => navigate('/hotels')}>Browse Hotels</Button>
        </div>
      </div>
    );
  }

  // Calculate number of nights
  const diffTime = Math.abs(booking.checkOutDate.getTime() - booking.checkInDate.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/profile')} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        My Bookings
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`text-center mb-8 transition-all duration-500 ease-out ${
              isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your reservation has been successfully confirmed</p>
          </div>
          
          {/* Booking Summary Card */}
          <Card className="mb-8 border-2 border-green-100">
            <CardHeader className="bg-green-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl">Booking Summary</CardTitle>
                  <CardDescription>Booking ID: {booking.id.substring(0, 8)}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Hotel Information */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{hotel.location}, {hotel.city}, {hotel.state}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Bed className="h-4 w-4 mr-2" />
                    <span>{room.name} ({room.type})</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    <span className="font-medium">Confirmed</span>
                  </div>
                </div>
              </div>
              
              {/* Booking Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Information */}
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Booking Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-mono">{booking.id.substring(0, 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="capitalize font-medium">{booking.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span>{booking.createdAt ? format(booking.createdAt, "MMM d, yyyy") : 'N/A'}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Stay Details */}
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Stay Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span>{format(booking.checkInDate, "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span>{format(booking.checkOutDate, "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nights:</span>
                      <span>{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span>{booking.guests}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Room Details */}
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Bed className="h-5 w-5 mr-2" />
                      Room Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span>{room.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span>{room.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span>{room.capacity} guests</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Price Summary */}
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Price Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room charges:</span>
                      <span>{formatCurrency(room.pricePerNight)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nights:</span>
                      <span>{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span>{booking.guests}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total:</span>
                      <span>{formatCurrency(booking.totalPrice)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Guest Information */}
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p>{user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p>{booking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p>{booking.phone || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Special Requests */}
              {booking.specialRequests && (
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Special Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{booking.specialRequests}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
          
          {/* Important Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Check-in Instructions</h4>
                  <p className="text-sm text-gray-700">
                    Check-in time is from 2:00 PM. Please bring a valid ID and your booking confirmation.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-gray-700">
                    Free cancellation up to 48 hours before check-in. After that, one night's charge may apply.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex">
                  <Mail className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-green-700">
                    A confirmation email has been sent to <span className="font-semibold">{booking.email}</span>. 
                    Please check your inbox (and spam folder) for important details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Need assistance? Contact our support team at support@naijastay.com or call +234 123 456 7890
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => navigate('/profile')}>
                View All Bookings
              </Button>
              <Button variant="outline" onClick={() => navigate('/hotels')}>
                Book Another Stay
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;