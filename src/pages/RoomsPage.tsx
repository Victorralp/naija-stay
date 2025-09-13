import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, Star, AlertCircle, Database, ExternalLink } from 'lucide-react';
import { hotelService } from '@/services/hotelService';
import { Room } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm, locationFilter, priceRange]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const availableRooms = await hotelService.getAvailableRooms();
      setRooms(availableRooms);
      setFilteredRooms(availableRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let result = rooms;

    if (searchTerm) {
      result = result.filter(room => 
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      result = result.filter(room => 
        room.hotelId.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    result = result.filter(room => 
      room.pricePerNight >= priceRange[0] && room.pricePerNight <= priceRange[1]
    );

    setFilteredRooms(result);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <h1 className="text-3xl font-bold text-center mb-8">Available Rooms</h1>
        
        {/* Search and Filters */}
        <Card className="mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Price Range:</span>
              <span className="text-sm">
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </span>
            </div>
          </div>
        </Card>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <Card className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Rooms Available</h2>
            <p className="text-gray-600 mb-6">
              There are currently no rooms available in the database.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                For Administrators:
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                If you're an administrator setting up the application, you need to seed the database with sample data.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild>
                  <Link to="/seed-data" className="flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Seed Database
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/firebase-setup" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Firebase Setup Guide
                  </Link>
                </Button>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm">
              If you're a regular user, please check back later as new rooms may be added soon.
            </p>
          </Card>
        )}

        {/* Room Grid */}
        {filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col">
                  <CardContent className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{room.name}</h3>
                        <p className="text-sm text-gray-500">{room.type}</p>
                      </div>
                      <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        <span className="text-sm font-medium">{4.5}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Up to {room.capacity} guests</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(room.pricePerNight)}
                        </span>
                        <span className="text-sm text-gray-500">/night</span>
                      </div>
                      <Button asChild>
                        <Link to={`/enhanced-booking?roomId=${room.id}`}>Book Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RoomsPage;