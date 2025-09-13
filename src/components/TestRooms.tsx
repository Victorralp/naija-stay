import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Room } from '@/types/hotel';

const TestRooms = () => {
  // Mock room data for testing
  const mockRooms: Room[] = [
    {
      id: '1',
      hotelId: 'hotel1',
      name: 'Deluxe Ocean View',
      description: 'Spacious room with breathtaking ocean views and premium amenities',
      type: 'Deluxe',
      capacity: 4,
      pricePerNight: 25000,
      amenities: ['Free WiFi', 'Ocean View', 'Balcony', 'Mini Bar', 'TV'],
      images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      available: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      hotelId: 'hotel1',
      name: 'Standard City View',
      description: 'Comfortable room with city views and essential amenities',
      type: 'Standard',
      capacity: 2,
      pricePerNight: 15000,
      amenities: ['Free WiFi', 'City View', 'TV', 'Air Conditioning'],
      images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      available: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      hotelId: 'hotel2',
      name: 'Family Suite',
      description: 'Large suite perfect for families with separate living area',
      type: 'Suite',
      capacity: 6,
      pricePerNight: 35000,
      amenities: ['Free WiFi', 'Kitchenette', 'Living Area', 'Multiple Bedrooms', 'Balcony'],
      images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      available: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [capacity, setCapacity] = useState('');

  const filteredRooms = mockRooms.filter(room => {
    // Search filter
    if (searchTerm && 
        !room.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !room.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !room.type.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Price filter
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || Infinity;
    if (room.pricePerNight < min || room.pricePerNight > max) {
      return false;
    }
    
    // Capacity filter
    if (capacity && room.capacity < parseInt(capacity)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Rooms Page</h1>
      
      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Rooms</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input 
              id="search"
              placeholder="Room name, type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="minPrice">Min Price (₦)</Label>
            <Input 
              id="minPrice"
              type="number" 
              placeholder="0" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="maxPrice">Max Price (₦)</Label>
            <Input 
              id="maxPrice"
              type="number" 
              placeholder="100000" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="capacity">Min Capacity</Label>
            <Input 
              id="capacity"
              type="number" 
              placeholder="1" 
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredRooms.length} of {mockRooms.length} rooms
        </p>
      </div>
      
      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <Card key={room.id} className="overflow-hidden">
            {room.images?.[0] && (
              <div className="h-48">
                <img 
                  src={room.images[0]} 
                  alt={room.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{room.name}</h3>
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
                  {room.capacity} guests
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-1">{room.type}</p>
              <p className="text-gray-700 mb-4">{room.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{room.amenities.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    ₦{room.pricePerNight.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm block">per night</span>
                </div>
                <Button>Book Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No rooms match your filters</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setMinPrice('');
              setMaxPrice('');
              setCapacity('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestRooms;