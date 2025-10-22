import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { uploadImages } from '@/services/storageService';
import { Upload, ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const NewRoomPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    hotelId: '',
    name: '',
    description: '',
    type: 'Standard',
    capacity: 2,
    pricePerNight: 0,
    amenities: '',
    available: true
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch hotels for the hotel selection dropdown
  const { data: hotels, isLoading: hotelsLoading } = useQuery({
    queryKey: ['admin-hotels'],
    queryFn: hotelService.getHotels,
  });

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(fileArray);
      
      // Generate previews
      const previews = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrls: string[] = [];
      
      // Upload images if any
      if (images.length > 0) {
        try {
          imageUrls = await uploadImages(images, 'room-images');
          toast.success(`${images.length} image(s) uploaded successfully`);
        } catch (error) {
          toast.error('Failed to upload images');
          console.error('Image upload error:', error);
          setUploading(false);
          return;
        }
      }
      
      await hotelService.addRoom({
        hotelId: formData.hotelId,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(item => item),
        images: imageUrls,
        available: formData.available
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      toast.success('Room added successfully');
      
      // Clean up object URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      navigate('/admin/rooms');
    } catch (error) {
      toast.error('Failed to add room');
      console.error('Add room error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin/rooms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Add New Room</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddRoom} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hotelId">Hotel</Label>
              {hotelsLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              ) : (
                <Select 
                  value={formData.hotelId} 
                  onValueChange={(value) => handleSelectChange('hotelId', value)}
                  required
                >
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
              )}
            </div>
            
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
                <Label htmlFor="type">Room Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Deluxe">Deluxe</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                    <SelectItem value="Presidential Suite">Presidential Suite</SelectItem>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Adding Room...' : 'Add Room'}
              </Button>
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
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Room Images</h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload images to showcase your room
              </p>
              <Button 
                type="button" 
                variant="outline" 
                onClick={triggerFileInput}
                disabled={uploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Images
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-xs text-gray-500 mt-3">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            
            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">Selected Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRoomPage;