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
import { PlusCircle, HotelIcon, Bed, Users, CreditCard, Edit, Trash2, Upload, Image as ImageIcon, Video, Calendar, CheckCircle, User, BarChart3, MessageCircle, Mail, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import ContactMessages from '@/components/admin/ContactMessages';

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
  const [activeTab, setActiveTab] = useState('hotels');
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  // Fetch hotels data
  const { data: hotels, isLoading: hotelsLoading } = useQuery({
    queryKey: ['admin-hotels'],
    queryFn: hotelService.getHotels,
  });

  // Fetch rooms data
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: hotelService.getAvailableRooms,
  });

  // Fetch bookings data
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: bookingService.getAllBookings,
  });

  // Fetch users data
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getAllUsers,
  });

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Hotel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <HotelIcon className="h-10 w-10 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Hotels</p>
                <p className="text-2xl font-bold">{totalHotels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bed className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Rooms</p>
                <p className="text-2xl font-bold">{totalRooms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Bookings</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-10 w-10 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-10 w-10 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Media Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="flex space-x-4 mb-4">
              <Button 
                onClick={triggerImageFileInput}
                disabled={uploading}
                className="flex items-center"
                variant={mediaType === 'image' ? 'default' : 'outline'}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {uploading && mediaType === 'image' ? 'Uploading...' : 'Upload Images'}
              </Button>
              <Button 
                onClick={triggerVideoFileInput}
                disabled={uploading}
                className="flex items-center"
                variant={mediaType === 'video' ? 'default' : 'outline'}
              >
                <Video className="mr-2 h-4 w-4" />
                {uploading && mediaType === 'video' ? 'Uploading...' : 'Upload Videos'}
              </Button>
            </div>
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
            <p className="text-sm text-gray-500 mt-2">
              {mediaType === 'image' 
                ? 'PNG, JPG, GIF up to 10MB' 
                : 'MP4, MOV, AVI up to 100MB'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
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
              ) : (
                <div className="space-y-4">
                  {hotels?.map((hotel: Hotel) => (
                    <div key={hotel.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{hotel.name}</h3>
                        <p className="text-sm text-gray-500">{hotel.city}, {hotel.state}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
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
                      <Button className="mt-4">Add Your First Hotel</Button>
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
              ) : (
                <div className="space-y-4">
                  {rooms?.map((room: Room) => (
                    <div key={room.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{room.name}</h3>
                        <p className="text-sm text-gray-500">{room.type} - ₦{room.pricePerNight.toLocaleString()}/night</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
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
                      <Button className="mt-4">Add Your First Room</Button>
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
                    <CardTitle className="text-lg">Booking Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Booking trend chart would appear here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Revenue chart would appear here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Hotels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hotels?.slice(0, 3).map((hotel: Hotel) => (
                        <div key={hotel.id} className="flex justify-between items-center">
                          <span className="font-medium">{hotel.name}</span>
                          <span className="text-sm text-gray-500">₦{Math.floor(Math.random() * 1000000).toLocaleString()} revenue</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>Positive Reviews</span>
                        </div>
                        <span className="font-semibold">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-blue-500 mr-2" />
                          <span>Newsletter Subscribers</span>
                        </div>
                        <span className="font-semibold">1,240</span>
                      </div>
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
                    variant={activeTab === 'newsletter' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('newsletter')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Newsletter
                  </Button>
                  <Button 
                    variant={activeTab === 'messages' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {activeTab === 'communications' || activeTab === 'newsletter' ? (
              <NewsletterManagement />
            ) : null}
            
            {activeTab === 'messages' ? (
              <ContactMessages />
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;