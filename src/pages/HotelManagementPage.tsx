import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { PlusCircle, Edit, Trash2, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const HotelManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Fetch hotels data
  const { data: hotels, isLoading } = useQuery({
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

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hotelService.addHotel({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        rating: Number(formData.rating),
        priceRange: formData.priceRange,
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(item => item),
        images: [],
        featured: formData.featured,
        available: formData.available
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
      toast.success('Hotel added successfully');
      setIsAddingHotel(false);
      setFormData({
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
    } catch (error) {
      toast.error('Failed to add hotel');
      console.error('Add hotel error:', error);
    }
  };

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

  // Export hotels to CSV
  const handleExportHotels = () => {
    if (!hotels || hotels.length === 0) {
      toast.error('No hotels to export');
      return;
    }

    // Create CSV content
    const headers = [
      'ID', 'Name', 'Description', 'Location', 'City', 'State', 'Country', 
      'Rating', 'Price Range', 'Amenities', 'Featured', 'Available', 
      'Created At', 'Updated At'
    ];
    
    const csvContent = [
      headers.join(','),
      ...hotels.map(hotel => [
        hotel.id,
        `"${hotel.name.replace(/"/g, '""')}"`,
        `"${hotel.description.replace(/"/g, '""')}"`,
        `"${hotel.location.replace(/"/g, '""')}"`,
        `"${hotel.city.replace(/"/g, '""')}"`,
        `"${hotel.state.replace(/"/g, '""')}"`,
        `"${hotel.country.replace(/"/g, '""')}"`,
        hotel.rating,
        `"${hotel.priceRange}"`,
        `"${hotel.amenities.join(';').replace(/"/g, '""')}"`,
        hotel.featured ? 'Yes' : 'No',
        hotel.available ? 'Yes' : 'No',
        hotel.createdAt.toISOString(),
        hotel.updatedAt.toISOString()
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hotels-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${hotels.length} hotels successfully`);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle CSV import
  const handleImportHotels = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        toast.error('CSV file is empty or invalid');
        return;
      }

      // Parse CSV (simple implementation)
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const importedHotels = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length !== headers.length) continue;
        
        const hotel: any = {};
        headers.forEach((header, index) => {
          const value = values[index];
          switch (header.toLowerCase()) {
            case 'name':
            case 'description':
            case 'location':
            case 'city':
            case 'state':
            case 'country':
            case 'price range':
              hotel[header.toLowerCase().replace(' ', '')] = value;
              break;
            case 'rating':
              hotel.rating = parseInt(value) || 5;
              break;
            case 'amenities':
              hotel.amenities = value.split(';').map(a => a.trim()).filter(a => a);
              break;
            case 'featured':
            case 'available':
              hotel[header.toLowerCase()] = value.toLowerCase() === 'yes';
              break;
          }
        });
        
        // Only add hotels with required fields
        if (hotel.name) {
          importedHotels.push(hotel);
        }
      }
      
      if (importedHotels.length === 0) {
        toast.error('No valid hotels found in CSV');
        return;
      }
      
      // Add hotels to database
      let successCount = 0;
      for (const hotel of importedHotels) {
        try {
          await hotelService.addHotel({
            ...hotel,
            images: [],
            createdAt: new Date(),
            updatedAt: new Date()
          });
          successCount++;
        } catch (error) {
          console.error('Error importing hotel:', error);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} hotels`);
      } else {
        toast.error('Failed to import hotels');
      }
    } catch (error) {
      toast.error('Failed to import hotels');
      console.error('Import error:', error);
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Hotel Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {hotels?.map((hotel) => (
                    <div key={hotel.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{hotel.name}</h3>
                        <p className="text-sm text-gray-500">{hotel.city}, {hotel.state}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/hotels/${hotel.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
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
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {isAddingHotel ? 'Add New Hotel' : 'Hotel Management'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAddingHotel ? (
                <form onSubmit={handleAddHotel} className="space-y-4">
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="amenities">Amenities (comma separated)</Label>
                    <Input
                      id="amenities"
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleInputChange}
                      placeholder="WiFi, Pool, Spa"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="available"
                        name="available"
                        checked={formData.available}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <Label htmlFor="available">Available</Label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit">Add Hotel</Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddingHotel(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <Button 
                    onClick={() => setIsAddingHotel(true)}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Hotel
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Bulk Actions</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleExportHotels}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Hotels (CSV)
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={triggerFileInput}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Import Hotels (CSV)
                      </Button>
                      <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv"
                        onChange={handleImportHotels}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HotelManagementPage;