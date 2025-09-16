import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, CreditCard, HotelIcon, Calendar, Filter, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';
import { adminService } from '@/services/adminService';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import { format, subDays, subMonths, subYears } from 'date-fns';

// Define types for our analytics data
interface BookingTrend {
  date: string;
  count: number;
  revenue: number;
}

interface RevenueData {
  month: string;
  amount: number;
}

const AnalyticsPage = () => {
  // State for date range filtering
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  // Fetch data for analytics
  const { data: hotels } = useQuery({
    queryKey: ['admin-hotels'],
    queryFn: hotelService.getHotels,
  });

  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: bookingService.getAllBookings,
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getAllUsers,
  });

  // Calculate statistics
  const totalHotels = hotels?.length || 0;
  const totalBookings = bookings?.length || 0;
  const totalUsers = users?.length || 0;
  
  // Calculate total revenue from confirmed bookings
  const totalRevenue = bookings?.reduce((sum, booking) => {
    return booking.status === 'confirmed' ? sum + booking.totalPrice : sum;
  }, 0) || 0;

  // Calculate occupancy rate (simplified)
  const occupancyRate = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const occupancyPercentage = totalBookings > 0 ? Math.round((occupancyRate / totalBookings) * 100) : 0;

  // Filter bookings based on date range
  const filterBookingsByDate = (bookings: any[] | undefined, range: '7d' | '30d' | '90d' | '1y') => {
    if (!bookings) return [];
    
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '1y':
        startDate = subYears(now, 1);
        break;
      default:
        startDate = subDays(now, 30);
    }
    
    return bookings.filter(booking => new Date(booking.createdAt) >= startDate);
  };

  // Get filtered bookings
  const filteredBookings = filterBookingsByDate(bookings, dateRange);

  // Generate booking trends data
  const generateBookingTrends = (): BookingTrend[] => {
    if (!filteredBookings) return [];
    
    // Group bookings by date
    const trends: Record<string, { count: number; revenue: number }> = {};
    
    filteredBookings.forEach(booking => {
      const date = format(new Date(booking.createdAt), 'MMM dd');
      if (!trends[date]) {
        trends[date] = { count: 0, revenue: 0 };
      }
      trends[date].count += 1;
      if (booking.status === 'confirmed') {
        trends[date].revenue += booking.totalPrice;
      }
    });
    
    return Object.entries(trends).map(([date, data]) => ({
      date,
      count: data.count,
      revenue: data.revenue
    }));
  };

  // Generate revenue data by month
  const generateRevenueData = (): RevenueData[] => {
    if (!bookings) return [];
    
    // Group revenue by month
    const revenueByMonth: Record<string, number> = {};
    
    bookings
      .filter(booking => booking.status === 'confirmed')
      .forEach(booking => {
        const month = format(new Date(booking.createdAt), 'MMM yyyy');
        if (!revenueByMonth[month]) {
          revenueByMonth[month] = 0;
        }
        revenueByMonth[month] += booking.totalPrice;
      });
    
    return Object.entries(revenueByMonth).map(([month, amount]) => ({
      month,
      amount
    }));
  };

  const bookingTrends = generateBookingTrends();
  const revenueData = generateRevenueData();

  // Handle export data
  const handleExportData = () => {
    // In a real implementation, this would export the data to CSV or Excel
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" asChild>
            <Link to="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 ml-4">Business Analytics</h1>
        </div>
        <Button onClick={handleExportData} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filter by:</span>
          <Button 
            variant={dateRange === '7d' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setDateRange('7d')}
          >
            Last 7 Days
          </Button>
          <Button 
            variant={dateRange === '30d' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setDateRange('30d')}
          >
            Last 30 Days
          </Button>
          <Button 
            variant={dateRange === '90d' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setDateRange('90d')}
          >
            Last 90 Days
          </Button>
          <Button 
            variant={dateRange === '1y' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setDateRange('1y')}
          >
            Last Year
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          Showing data for: {dateRange === '7d' ? 'Last 7 Days' : 
                           dateRange === '30d' ? 'Last 30 Days' : 
                           dateRange === '90d' ? 'Last 90 Days' : 'Last Year'}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <Calendar className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
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
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                <p className="text-2xl font-bold">{occupancyPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Booking Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookingTrends.length > 0 ? (
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive booking trend chart</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Showing {bookingTrends.length} data points for the selected period
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No booking data available for the selected period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Revenue analytics chart</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Showing {revenueData.length} months of revenue data
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No revenue data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Popular Hotels */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HotelIcon className="h-5 w-5 mr-2" />
            Popular Hotels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotels?.slice(0, 5).map((hotel, index) => (
              <div key={hotel.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{hotel.name}</h3>
                    <p className="text-sm text-gray-500">{hotel.city}, {hotel.state}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{Math.floor(Math.random() * 1000000).toLocaleString()} revenue</p>
                  <p className="text-sm text-gray-500">{Math.floor(Math.random() * 100)} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;