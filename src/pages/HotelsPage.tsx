import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, AlertCircle, Database, ExternalLink } from 'lucide-react';
import { hotelService } from '@/services/hotelService';
import { Hotel } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import HotelCard from '@/components/HotelCard';

const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    filterHotels();
  }, [hotels, searchTerm, locationFilter]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const allHotels = await hotelService.getHotels();
      setHotels(allHotels);
      setFilteredHotels(allHotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHotels = () => {
    let result = hotels;

    if (searchTerm) {
      result = result.filter(hotel => 
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      result = result.filter(hotel => 
        hotel.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
        hotel.state.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredHotels(result);
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
        <h1 className="text-3xl font-bold text-center mb-8">All Hotels</h1>
        
        {/* Search and Filters */}
        <Card className="mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search hotels..."
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
          </div>
        </Card>

        {/* Empty State */ }
        {filteredHotels.length === 0 && (
          <Card className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Hotels Available</h2>
            <p className="text-gray-600 mb-6">
              There are currently no hotels available in the database.
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
              If you're a regular user, please check back later as new hotels may be added soon.
            </p>
          </Card>
        )}

        {/* Hotels Grid */ }
        {filteredHotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <HotelCard hotel={hotel} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HotelsPage;