import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useParams, useNavigate } from 'react-router-dom';

const EditRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    capacity: 1,
    pricePerNight: 0,
    amenities: '',
    available: true,
    hotelId: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch room data
  const { data: room, isLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => hotelService.getRoomById(roomId!),
    enabled: !!roomId
  });

  // Fetch hotels for the hotel selection dropdown
  const { data: hotels } = useQuery({
    queryKey: ['admin-hotels'],
    queryFn: hotelService.getHotels,
  });

  // Set form data when room data is loaded
  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        description: room.description,
        type: room.type,
        capacity: room.capacity,
        pricePerNight: room.pricePerNight,
        amenities: room.amenities.join(', '),
        available: room.available,
        hotelId: room.hotelId
      });
      setLoading(false);
    }
  }, [room]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) return;
    
    try {
      await hotelService.updateRoom(roomId, {
        ...formData,
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(item => item),
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight)
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
      toast.success('Room updated successfully');
      navigate('/admin/rooms');
    } catch (error) {
      toast.error('Failed to update room');
      console.error('Update room error:', error);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" asChild>
            <Link to="/admin/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rooms
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Room not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin/rooms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Edit Room</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit {room.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateRoom} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hotelId">Hotel</Label>
                <Select name="hotelId" value={formData.hotelId} onValueChange={(value) => handleSelectChange('hotelId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels?.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Room Type</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Deluxe, Standard, Suite, etc."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricePerNight">Price per Night (₦)</Label>
                <Input
                  id="pricePerNight"
                  name="pricePerNight"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma separated)</Label>
              <Input
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="WiFi, TV, AC, Mini Bar"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="available"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="mr-2 h-5 w-5"
              />
              <Label htmlFor="available" className="text-base">Available for Booking</Label>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-4">
              <Button type="submit">Update Room</Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/rooms">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Media Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Room Images</h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload images to showcase your room
            </p>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Select Images
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditRoomPage;