import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useParams, useNavigate } from 'react-router-dom';

const EditHotelPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    city: '',
    state: '',
    country: 'Nigeria',
    rating: 5,
    priceRange: '₦₦₦',
    amenities: '',
    featured: false,
    available: true
  });
  const [loading, setLoading] = useState(true);

  // Fetch hotel data
  const { data: hotel, isLoading } = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => hotelService.getHotelById(hotelId!),
    enabled: !!hotelId
  });

  // Set form data when hotel data is loaded
  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name,
        description: hotel.description,
        location: hotel.location,
        city: hotel.city,
        state: hotel.state,
        country: hotel.country,
        rating: hotel.rating,
        priceRange: hotel.priceRange,
        amenities: hotel.amenities.join(', '),
        featured: hotel.featured,
        available: hotel.available
      });
      setLoading(false);
    }
  }, [hotel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelId) return;
    
    try {
      await hotelService.updateHotel(hotelId, {
        ...formData,
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(item => item),
        rating: Number(formData.rating)
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', hotelId] });
      toast.success('Hotel updated successfully');
      navigate('/admin/hotels');
    } catch (error) {
      toast.error('Failed to update hotel');
      console.error('Update hotel error:', error);
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

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" asChild>
            <Link to="/admin/hotels">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hotels
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Hotel not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin/hotels">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Edit Hotel</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit {hotel.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateHotel} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Hotel Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleInputChange}
                  required
                />
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
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priceRange">Price Range</Label>
              <Input
                id="priceRange"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
                placeholder="₦₦₦"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma separated)</Label>
              <Input
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="WiFi, Pool, Spa"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2 h-5 w-5"
                />
                <Label htmlFor="featured" className="text-base">Featured Hotel</Label>
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
            </div>
            
            <div className="flex flex-wrap gap-3 pt-4">
              <Button type="submit">Update Hotel</Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/hotels">Cancel</Link>
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
            <h3 className="text-lg font-medium mb-2">Upload Hotel Images</h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload images to showcase your hotel
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

export default EditHotelPage;