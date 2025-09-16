import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import { hotelService } from '@/services/hotelService';
import { userService } from '@/services/userService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Bed, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard,
  User,
  Mail,
  Phone,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

const UserProfilePage = () => {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: ''
  });

  // Fetch user bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: () => user?.id ? bookingService.getBookingsByUser(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  // Fetch hotels for bookings
  const { data: hotels } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelService.getHotels,
  });

  // Initialize edit form when user data is available
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.displayName || user.name || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const getHotelName = (hotelId: string) => {
    const hotel = hotels?.find(h => h.id === hotelId);
    return hotel ? hotel.name : 'Hotel not found';
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to current user data
    if (user) {
      setEditForm({
        name: user.displayName || user.name || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const result = await userService.updateUserProfile(user.id, {
        name: editForm.name,
        displayName: editForm.name,
        phoneNumber: editForm.phoneNumber
      });

      if (result.success) {
        // Update the user in context
        setUser({
          ...user,
          name: editForm.name,
          displayName: editForm.name,
          phoneNumber: editForm.phoneNumber
        });

        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ['user'] });

        toast.success(result.message);
        setIsEditing(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <Button asChild>
            <Link to="/auth">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
                    <AvatarFallback className="text-2xl">
                      {user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <CardTitle className="mt-4 text-center">
                  {user.displayName || 'User'}
                </CardTitle>
                <p className="text-sm text-gray-500 text-center">{user.email}</p>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button 
                    variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === 'bookings' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Bed className="w-4 h-4 mr-2" />
                    My Bookings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                      </div>
                      {!isEditing && (
                        <Button onClick={handleEditClick} variant="outline" size="sm">
                          Edit Profile
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      // Edit Form
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={editForm.name}
                              onChange={(e) => handleFormChange('name', e.target.value)}
                              placeholder="Enter your full name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              value={user.email || ''}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                              id="phoneNumber"
                              value={editForm.phoneNumber}
                              onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                              placeholder="Enter your phone number"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Member Since</Label>
                            <div className="flex items-center p-3 bg-muted rounded-lg">
                              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{user.metadata?.creationTime ? format(new Date(user.metadata.creationTime), 'MMM d, yyyy') : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfile}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <div className="flex items-center p-3 bg-muted rounded-lg">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{user.displayName || user.name || 'Not provided'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Email Address</label>
                          <div className="flex items-center p-3 bg-muted rounded-lg">
                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Phone Number</label>
                          <div className="flex items-center p-3 bg-muted rounded-lg">
                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{user.phoneNumber || 'Not provided'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Member Since</label>
                          <div className="flex items-center p-3 bg-muted rounded-lg">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{user.metadata?.creationTime ? format(new Date(user.metadata.creationTime), 'MMM d, yyyy') : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bed className="w-5 h-5 mr-2" />
                      My Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookingsLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : bookings && bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking, index) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{getHotelName(booking.hotelId)}</h3>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>{format(booking.checkInDate, 'MMM d, yyyy')}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>{booking.guests} guests</span>
                                  </div>
                                  <div className="flex items-center">
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    <span>{formatCurrency(booking.totalPrice)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="flex items-center">
                                  {getBookingStatusBadge(booking.status)}
                                </div>
                                <Button asChild size="sm">
                                  <Link to={`/booking-confirmation/${booking.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                        <p className="text-gray-500 mb-4">You haven't made any bookings. Start planning your next trip!</p>
                        <Button asChild>
                          <Link to="/hotels">Browse Hotels</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;