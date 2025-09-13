import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Filter, Search, MapPin, Star, AlertCircle } from 'lucide-react';
import HotelCard from '@/components/HotelCard';
import { Hotel } from '@/types/hotel';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HotelsList = () => {
  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelService.getHotels,
  });

  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters when hotels data changes or filters/search term change
  useEffect(() => {
    if (!hotels) return;
    
    const filtered = hotels.filter(hotel => {
      // Search term filter
      if (searchTerm && 
          !hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !hotel.state.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Location filter
      if (filters.location && 
          !hotel.city.toLowerCase().includes(filters.location.toLowerCase()) && 
          !hotel.state.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Price range filter
      if (filters.minPrice || filters.maxPrice) {
        const minPrice = parseInt(filters.minPrice) || 0;
        const maxPrice = parseInt(filters.maxPrice) || Infinity;
        
        // Extract numeric values from priceRange string (e.g., "₦25,000 - ₦50,000")
        const priceMatch = hotel.priceRange?.match(/₦([\d,]+)/g);
        if (priceMatch) {
          const prices = priceMatch.map(price => parseInt(price.replace(/[₦,]/g, '')));
          const lowestPrice = Math.min(...prices);
          
          if (lowestPrice < minPrice || lowestPrice > maxPrice) {
            return false;
          }
        }
      }
      
      // Rating filter
      if (filters.minRating && hotel.rating < parseFloat(filters.minRating)) {
        return false;
      }
      
      return true;
    });
    
    setFilteredHotels(filtered);
  }, [hotels, filters, searchTerm]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
    });
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading hotels</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Show empty state with guidance
  if (!hotels || hotels.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No hotels available</h2>
            <p className="text-gray-600 mb-6">
              Check back later for available hotels or be the first to add hotels to the platform.
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h3 className="font-semibold text-blue-800 mb-2">For Administrators:</h3>
                <p className="text-blue-700 text-sm mb-3">
                  If you're an administrator, you can add hotels through the admin dashboard.
                </p>
                <Button asChild>
                  <Link to="/admin">Go to Admin Dashboard</Link>
                </Button>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-left">
                <h3 className="font-semibold text-green-800 mb-2">Quick Setup:</h3>
                <p className="text-green-700 text-sm mb-3">
                  Seed the database with sample data to see the hotels functionality in action.
                </p>
                <Button asChild variant="outline">
                  <Link to="/seed-data">Seed Database</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Stay</h1>
          <p className="text-gray-600">Discover amazing hotels across Nigeria</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search hotels, cities, or amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                      <option value="">All Locations</option>
                      <option value="lagos">Lagos</option>
                      <option value="abuja">Abuja</option>
                      <option value="port harcourt">Port Harcourt</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                    <select
                      value={filters.minRating}
                      onChange={(e) => handleFilterChange('minRating', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                      <option value="">Any Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₦)</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₦)</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="100000"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredHotels.length} of {hotels.length} hotels
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
      </motion.div>

      {/* Hotels grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        {filteredHotels.map((hotel, index) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            layout
          >
            <HotelCard hotel={hotel} />
          </motion.div>
        ))}
      </motion.div>
      
      {filteredHotels.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? `No hotels found for "${searchTerm}"` : 'No hotels match your filters'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try different search terms' : 'Try adjusting your search criteria'}
          </p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </motion.div>
      )}
    </div>
  );
};

export default HotelsList;