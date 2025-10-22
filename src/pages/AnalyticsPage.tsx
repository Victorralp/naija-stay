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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

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
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const occupancyPercentage = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;

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

  // Booking Trends Chart Component
  const BookingTrendsChart = () => {
    if (bookingTrends.length === 0) {
      return (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No booking data available for the selected period</p>
          </div>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bookingTrends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'revenue') {
                return [`₦${Number(value).toLocaleString()}`, 'Revenue'];
              }
              return [value, 'Bookings'];
            }}
          />
          <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Bookings" />
          <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Revenue Overview Chart Component
  const RevenueOverviewChart = () => {
    if (revenueData.length === 0) {
      return (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No revenue data available</p>
          </div>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData.slice(-12)}> {/* Last 12 months */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#10b981" 
            fill="#10b981" 
            fillOpacity={0.2}
            name="Revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // Popular Hotels Chart Component
  const PopularHotelsChart = () => {
    if (!hotels || !bookings) {
      return (
        <div className="flex items-center justify-center h-80">
          <p className="text-gray-500">Loading...</p>
        </div>
      );
    }

    // Calculate revenue by hotel
    const hotelData = hotels.map(hotel => {
      const hotelBookings = bookings.filter(booking => 
        booking.hotelId === hotel.id && booking.status === 'confirmed'
      );
      
      const revenue = hotelBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      const bookingCount = hotelBookings.length;
      
      return {
        id: hotel.id,
        name: hotel.name,
        revenue,
        bookings: bookingCount
      };
    })
    .filter(hotel => hotel.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(hotel => ({
      ...hotel,
      name: hotel.name.length > 20 ? `${hotel.name.substring(0, 20)}...` : hotel.name
    }));

    if (hotelData.length === 0) {
      return (
        <div className="flex items-center justify-center h-80">
          <p className="text-gray-500">No hotel data available</p>
        </div>
      );
    }

    const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={hotelData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="revenue"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {hotelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
        </PieChart>
      </ResponsiveContainer>
    );
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
          <CardContent className="h-80">
            <BookingTrendsChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <RevenueOverviewChart />
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
        <CardContent className="h-80">
          <PopularHotelsChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;