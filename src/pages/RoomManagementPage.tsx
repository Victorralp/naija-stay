import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { PlusCircle, Edit, Trash2, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RoomManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddingRoom, setIsAddingRoom] = useState(false);
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

  // Fetch rooms data
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: hotelService.getAvailableRooms,
  });

  // Fetch hotels data for the dropdown
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

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hotelService.addRoom({
        hotelId: formData.hotelId,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(item => item),
        images: [], // Add empty images array
        available: formData.available
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      toast.success('Room added successfully');
      setIsAddingRoom(false);
      setFormData({
        hotelId: '',
        name: '',
        description: '',
        type: 'Standard',
        capacity: 2,
        pricePerNight: 0,
        amenities: '',
        available: true
      });
    } catch (error) {
      toast.error('Failed to add room');
      console.error('Add room error:', error);
    }
  };

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

  // Export rooms to CSV
  const handleExportRooms = () => {
    if (!rooms || rooms.length === 0) {
      toast.error('No rooms to export');
      return;
    }

    // Create CSV content
    const headers = [
      'ID', 'Hotel ID', 'Hotel Name', 'Name', 'Description', 'Type', 
      'Capacity', 'Price Per Night', 'Amenities', 'Available', 
      'Created At', 'Updated At'
    ];
    
    const csvContent = [
      headers.join(','),
      ...rooms.map(room => {
        // Find hotel name for this room
        const hotel = hotels?.find(h => h.id === room.hotelId);
        return [
          room.id,
          room.hotelId,
          `"${(hotel?.name || '').replace(/"/g, '""')}"`,
          `"${room.name.replace(/"/g, '""')}"`,
          `"${room.description.replace(/"/g, '""')}"`,
          `"${room.type.replace(/"/g, '""')}"`,
          room.capacity,
          room.pricePerNight,
          `"${room.amenities.join(';').replace(/"/g, '""')}"`,
          room.available ? 'Yes' : 'No',
          room.createdAt.toISOString(),
          room.updatedAt.toISOString()
        ].join(',');
      })
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rooms-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${rooms.length} rooms successfully`);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle CSV import
  const handleImportRooms = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const importedRooms = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length !== headers.length) continue;
        
        const room: any = {};
        headers.forEach((header, index) => {
          const value = values[index];
          switch (header.toLowerCase()) {
            case 'hotel id':
              room.hotelId = value;
              break;
            case 'name':
            case 'description':
            case 'type':
              room[header.toLowerCase()] = value;
              break;
            case 'capacity':
              room.capacity = parseInt(value) || 2;
              break;
            case 'price per night':
              room.pricePerNight = parseFloat(value) || 0;
              break;
            case 'amenities':
              room.amenities = value.split(';').map(a => a.trim()).filter(a => a);
              break;
            case 'available':
              room.available = value.toLowerCase() === 'yes';
              break;
          }
        });
        
        // Only add rooms with required fields
        if (room.hotelId && room.name) {
          importedRooms.push(room);
        }
      }
      
      if (importedRooms.length === 0) {
        toast.error('No valid rooms found in CSV');
        return;
      }
      
      // Add rooms to database
      let successCount = 0;
      for (const room of importedRooms) {
        try {
          await hotelService.addRoom({
            ...room,
            images: [],
            createdAt: new Date(),
            updatedAt: new Date()
          });
          successCount++;
        } catch (error) {
          console.error('Error importing room:', error);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} rooms`);
      } else {
        toast.error('Failed to import rooms');
      }
    } catch (error) {
      toast.error('Failed to import rooms');
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
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Room Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Room Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {roomsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms?.map((room) => (
                    <div key={room.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{room.name}</h3>
                        <p className="text-sm text-gray-500">{room.type} - ₦{room.pricePerNight.toLocaleString()}/night</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/rooms/${room.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
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
                {isAddingRoom ? 'Add New Room' : 'Room Management'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAddingRoom ? (
                <form onSubmit={handleAddRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotelId">Hotel</Label>
                    {hotelsLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    ) : (
                      <Select 
                        value={formData.hotelId} 
                        onValueChange={(value) => handleSelectChange('hotelId', value)}
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricePerNight">Price per Night (₦)</Label>
                    <Input
                      id="pricePerNight"
                      name="pricePerNight"
                      type="number"
                      min="0"
                      value={formData.pricePerNight}
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
                      className="mr-2"
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit">Add Room</Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddingRoom(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <Button 
                    onClick={() => setIsAddingRoom(true)}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Room
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Bulk Actions</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleExportRooms}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Rooms (CSV)
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={triggerFileInput}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Import Rooms (CSV)
                      </Button>
                      <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv"
                        onChange={handleImportRooms}
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

export default RoomManagementPage;