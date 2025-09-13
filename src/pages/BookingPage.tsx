import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { hotelService } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { CalendarIcon, MapPin, Star, Users, Bed } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const roomId = searchParams.get('roomId');
  const hotelId = searchParams.get('hotelId');

  useEffect(() => {
    // Redirect to enhanced booking page
    const params = new URLSearchParams();
    if (roomId) params.append('roomId', roomId);
    if (hotelId) params.append('hotelId', hotelId);
    
    navigate(`/enhanced-booking?${params.toString()}`, { replace: true });
  }, [roomId, hotelId, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Redirecting to enhanced booking page...</p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
