import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hotel, Room, Booking } from '@/types/hotel';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';
import { adminService } from '@/services/adminService';
import { uploadImages, uploadVideos } from '@/services/storageService';
import { PlusCircle, HotelIcon, Bed, Users, CreditCard, Edit, Trash2, Upload, Image as ImageIcon, Video, Calendar, CheckCircle, User, BarChart3, MessageCircle, Mail, Settings, Eye, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { format, subDays, subMonths } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import ContactMessages from '@/components/admin/ContactMessages';
import SpecialOffersManagement from '@/components/admin/SpecialOffersManagement';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Add this interface for user data
interface User {
  id: string;
  email?: string;
  name?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hotels');
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [communicationsSubTab, setCommunicationsSubTab] = useState<'newsletter' | 'messages'>('newsletter');
  const [showStats, setShowStats] = useState(false);

  // Fetch hotels data
  const { data: hotels, isLoading: hotelsLoading, isError: hotelsError } = useQuery({
    queryKey: ['admin-hotels'],
    queryFn: hotelService.getHotels,
  });

  // Fetch rooms data
  const { data: rooms, isLoading: roomsLoading, isError: roomsError } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: hotelService.getAvailableRooms,
  });

  // Fetch bookings data
  const { data: bookings, isLoading: bookingsLoading, isError: bookingsError } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: bookingService.getAllBookings,
  });

  // Fetch users data
  const { data: users, isLoading: usersLoading, isError: usersError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getAllUsers,
  });

  // Set default sub-tab when entering communications tab
  useEffect(() => {
    if (activeTab === 'communications') {
      // Set default to newsletter if no sub-tab is selected
      setCommunicationsSubTab('newsletter');
    }
  }, [activeTab]);

  // Calculate statistics
  const totalHotels = hotels?.length || 0;
  const totalRooms = rooms?.length || 0;
  const totalBookings = bookings?.length || 0;
  const totalUsers = users?.length || 0;
  // Calculate total revenue from confirmed bookings
  const totalRevenue = bookings?.reduce((sum, booking) => {
    return booking.status === 'confirmed' ? sum + booking.totalPrice : sum;
  }, 0) || 0;

  // Handle hotel deletion
  const handleDeleteHotel = async (hotelId: string, hotelName: string) => {
    if (window.confirm(`Are you sure you want to delete ${hotelName}? This action cannot be undone.`)) {
      try {
        await hotelService.deleteHotel(hotelId);
        queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
        toast.success('Hotel deleted successfully');
      } catch (error) {
        toast.error('Failed to delete hotel');
        console.error('Delete hotel error:', error);
      }
    }
  };

  // Handle room deletion
  const handleDeleteRoom = async (roomId: string, roomName: string) => {
    if (window.confirm(`Are you sure you want to delete ${roomName}? This action cannot be undone.`)) {
      try {
        await hotelService.deleteRoom(roomId);
        queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
        toast.success('Room deleted successfully');
      } catch (error) {
        toast.error('Failed to delete room');
        console.error('Delete room error:', error);
      }
    }
  };

  // Handle booking status update
  const handleUpdateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await bookingService.updateBooking(bookingId, { status });
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking status updated successfully');
    } catch (error) {
      toast.error('Failed to update booking status');
      console.error('Update booking error:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Upload images to Cloudinary
      const imageUrls = await uploadImages(
        Array.from(files), 
        'hotel-images'
      );
      
      // In a real implementation, you would:
      // 1. Create or update a hotel/room with these image URLs
      // 2. Save the image URLs to Firestore
      
      toast.success(`${imageUrls.length} image(s) uploaded successfully`);
      console.log('Uploaded images:', imageUrls);
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
    }
  };

  // Handle video upload
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Upload videos to Cloudinary
      const videoUrls = await uploadVideos(
        Array.from(files), 
        'hotel-videos'
      );
      
      // In a real implementation, you would:
      // 1. Create or update a hotel/room with these video URLs
      // 2. Save the video URLs to Firestore
      
      toast.success(`${videoUrls.length} video(s) uploaded successfully`);
      console.log('Uploaded videos:', videoUrls);
    } catch (error) {
      toast.error('Failed to upload videos');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = '';
      }
    }
  };

  // Handle user role change
  const handleUserRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await adminService.updateUserRole(userId, newRole);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Update user role error:', error);
    }
  };

  // Trigger image file input click
  const triggerImageFileInput = () => {
    setMediaType('image');
    if (imageFileInputRef.current) {
      imageFileInputRef.current.click();
    }
  };

  // Trigger video file input click
  const triggerVideoFileInput = () => {
    setMediaType('video');
    if (videoFileInputRef.current) {
      videoFileInputRef.current.click();
    }
  };

  // Handle navigation to edit pages
  const handleEditHotel = (hotelId: string) => {
    navigate(`/admin/hotels/${hotelId}/edit`);
  };

  const handleEditRoom = (roomId: string) => {
    navigate(`/admin/rooms/${roomId}/edit`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link to="/admin/hotels/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Hotel
          </Link>
        </Button>
      </div>

      {/* Stats Summary Card with Dropdown */}
      <Card className="mb-6">
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Dashboard Overview</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowStats(!showStats)}
              className="p-1"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showStats ? 'rotate-180' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          {/* Summary Stats - Always Visible */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <HotelIcon className="h-6 w-6 text-blue-500 mx-auto" />
              <p className="text-xs text-gray-600 mt-1">Hotels</p>
              <p className="font-bold">{totalHotels}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <Bed className="h-6 w-6 text-green-500 mx-auto" />
              <p className="text-xs text-gray-600 mt-1">Rooms</p>
              <p className="font-bold">{totalRooms}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <Users className="h-6 w-6 text-purple-500 mx-auto" />
              <p className="text-xs text-gray-600 mt-1">Bookings</p>
              <p className="font-bold">{totalBookings}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <User className="h-6 w-6 text-orange-500 mx-auto" />
              <p className="text-xs text-gray-600 mt-1">Users</p>
              <p className="font-bold">{totalUsers}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <CreditCard className="h-6 w-6 text-yellow-500 mx-auto" />
              <p className="text-xs text-gray-600 mt-1">Revenue</p>
              <p className="font-bold">₦{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Detailed Stats - Collapsible */}
          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">Booking Conversion Rate</h4>
                <p className="text-2xl font-bold text-blue-600">72%</p>
                <p className="text-xs text-gray-500">+5% from last month</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">Avg. Booking Value</h4>
                <p className="text-2xl font-bold text-green-600">₦{totalBookings > 0 ? Math.round(totalRevenue/totalBookings).toLocaleString() : 0}</p>
                <p className="text-xs text-gray-500">Per booking</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">Occupancy Rate</h4>
                <p className="text-2xl font-bold text-purple-600">68%</p>
                <p className="text-xs text-gray-500">Current month</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Upload Section - Collapsible */}
      <Card className="mb-6">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Media Management</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button 
              onClick={triggerImageFileInput}
              disabled={uploading}
              className="w-full sm:w-auto"
              size="sm"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {uploading && mediaType === 'image' ? 'Uploading...' : 'Upload Images'}
            </Button>
            <Button 
              onClick={triggerVideoFileInput}
              disabled={uploading}
              className="w-full sm:w-auto"
              size="sm"
              variant="outline"
            >
              <Video className="mr-2 h-4 w-4" />
              {uploading && mediaType === 'video' ? 'Uploading...' : 'Upload Videos'}
            </Button>
            <Input
              type="file"
              ref={imageFileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Input
              type="file"
              ref={videoFileInputRef}
              className="hidden"
              multiple
              accept="video/*"
              onChange={handleVideoUpload}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {mediaType === 'image' 
              ? 'PNG, JPG, GIF up to 10MB' 
              : 'MP4, MOV, AVI up to 100MB'}
          </p>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1">
          <TabsTrigger value="hotels" className="text-xs sm:text-sm">Hotels</TabsTrigger>
          <TabsTrigger value="rooms" className="text-xs sm:text-sm">Rooms</TabsTrigger>
          <TabsTrigger value="bookings" className="text-xs sm:text-sm">Bookings</TabsTrigger>
          <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="communications" className="text-xs sm:text-sm">Communications</TabsTrigger>
          <TabsTrigger value="offers" className="text-xs sm:text-sm">Special Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Management</CardTitle>
            </CardHeader>
            <CardContent>
              {hotelsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : hotelsError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading hotels. Please try again later.
                </div>
              ) : (
                <div className="space-y-4">
                  {hotels?.map((hotel: Hotel) => (
                    <div key={hotel.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{hotel.name}</h3>
                        <p className="text-sm text-gray-500">{hotel.city}, {hotel.state}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditHotel(hotel.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteHotel(hotel.id, hotel.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {hotels && hotels.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No hotels found</p>
                      <Button className="mt-4" asChild>
                        <Link to="/admin/hotels/new">Add Your First Hotel</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle>Room Management</CardTitle>
            </CardHeader>
            <CardContent>
              {roomsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : roomsError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading rooms. Please try again later.
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms?.map((room: Room) => (
                    <div key={room.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{room.name}</h3>
                        <p className="text-sm text-gray-500">{room.type} - ₦{room.pricePerNight.toLocaleString()}/night</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRoom(room.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id, room.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {rooms && rooms.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No rooms found</p>
                      <Button className="mt-4" asChild>
                        <Link to="/admin/rooms/new">Add Your First Room</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Booking Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : bookingsError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading bookings. Please try again later.
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings?.map((booking: Booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-4">
                            <h3 className="font-semibold">Booking #{booking.id.substring(0, 8)}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {booking.status}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(booking.checkInDate, "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{booking.guests} guests</span>
                            </div>
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-1" />
                              <span>₦{booking.totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            asChild
                          >
                            <Link to={`/booking-confirmation/${booking.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {bookings && bookings.length === 0 && (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No bookings found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : usersError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading users. Please try again later.
                </div>
              ) : (
                <div className="space-y-4">
                  {users?.map((user: User) => (
                    <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{user.name || 'Unnamed User'}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined: {user.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                        <select
                          value={user.role}
                          onChange={(e) => handleUserRoleChange(user.id, e.target.value as 'user' | 'admin')}
                          className="border rounded p-1 text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {users && users.length === 0 && (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Trends (Last 30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <BookingTrendsChart bookings={bookings || []} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <RevenueChart bookings={bookings || []} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Hotels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <PopularHotelsChart hotels={hotels || []} bookings={bookings || []} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <CustomerFeedbackChart bookings={bookings || []} users={users || []} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Communication Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage all communications with your customers including newsletters and contact messages.
                </p>
                <div className="flex space-x-4">
                  <Button 
                    variant={communicationsSubTab === 'newsletter' ? 'default' : 'outline'}
                    onClick={() => setCommunicationsSubTab('newsletter')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Newsletter
                  </Button>
                  <Button 
                    variant={communicationsSubTab === 'messages' ? 'default' : 'outline'}
                    onClick={() => setCommunicationsSubTab('messages')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {communicationsSubTab === 'newsletter' ? (
              <NewsletterManagement />
            ) : (
              <ContactMessages />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="offers">
          <SpecialOffersManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

// Booking Trends Chart Component
const BookingTrendsChart = ({ bookings }: { bookings: Booking[] }) => {
  // Generate data for the last 30 days
  const generateBookingTrendsData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, 'MMM dd');
      
      const count = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return (
          bookingDate.getDate() === date.getDate() &&
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getFullYear() === date.getFullYear()
        );
      }).length;
      
      data.push({ date: dateString, bookings: count });
    }
    
    return data;
  };
  
  const data = generateBookingTrendsData();
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Revenue Chart Component
const RevenueChart = ({ bookings }: { bookings: Booking[] }) => {
  // Group revenue by month
  const generateRevenueData = () => {
    const revenueByMonth: Record<string, number> = {};
    
    bookings
      .filter(booking => booking.status === 'confirmed')
      .forEach(booking => {
        const month = format(new Date(booking.createdAt), 'MMM yyyy');
        if (!revenueByMonth[month]) {
          revenueByMonth[month] = 0;
        }
        revenueByMonth[month] += booking.totalPrice;
      });
    
    return Object.entries(revenueByMonth)
      .map(([month, amount]) => ({ month, revenue: amount }))
      .slice(-6); // Last 6 months
  };
  
  const data = generateRevenueData();
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          name="Revenue" 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Popular Hotels Chart Component
const PopularHotelsChart = ({ hotels, bookings }: { hotels: Hotel[], bookings: Booking[] }) => {
  // Calculate revenue by hotel
  const generateHotelData = () => {
    const hotelRevenue: Record<string, { name: string; revenue: number; bookings: number }> = {};
    
    bookings
      .filter(booking => booking.status === 'confirmed')
      .forEach(booking => {
        const hotel = hotels.find(h => h.id === booking.hotelId);
        if (hotel) {
          if (!hotelRevenue[hotel.id]) {
            hotelRevenue[hotel.id] = {
              name: hotel.name,
              revenue: 0,
              bookings: 0
            };
          }
          hotelRevenue[hotel.id].revenue += booking.totalPrice;
          hotelRevenue[hotel.id].bookings += 1;
        }
      });
    
    return Object.values(hotelRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(hotel => ({
        name: hotel.name.length > 15 ? `${hotel.name.substring(0, 15)}...` : hotel.name,
        value: hotel.revenue,
        bookings: hotel.bookings
      }));
  };
  
  const data = generateHotelData();
  const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No hotel data available</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Customer Feedback Chart Component
const CustomerFeedbackChart = ({ bookings, users }: { bookings: Booking[], users: any[] }) => {
  // Calculate booking status distribution
  const bookingStatusData = [
    { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
  ];
  
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
  
  // Calculate user growth
  const userGrowthData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(today, i);
      const monthString = format(month, 'MMM yyyy');
      
      const count = users.filter(user => {
        const userDate = new Date(user.createdAt);
        return (
          userDate.getMonth() <= month.getMonth() &&
          userDate.getFullYear() <= month.getFullYear()
        );
      }).length;
      
      data.push({ month: monthString, users: count });
    }
    
    return data;
  };
  
  const userData = userGrowthData();
  
  return (
    <div className="grid grid-cols-1 gap-4 h-full">
      <div className="h-1/2">
        <h4 className="text-sm font-medium mb-2">Booking Status Distribution</h4>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={bookingStatusData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {bookingStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="h-1/2">
        <h4 className="text-sm font-medium mb-2">User Growth</h4>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#8b5cf6" name="Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
