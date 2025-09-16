import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, BarChart3, PieChart, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { hotelService } from '@/services/hotelService';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('bookings');
  const [dateRange, setDateRange] = useState('last30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Fetch bookings data
  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: bookingService.getAllBookings,
  });

  // Fetch hotels data
  const { data: hotels } = useQuery({
    queryKey: ['admin-hotels'],
    queryFn: hotelService.getHotels,
  });

  // Calculate date range
  const getDateRange = () => {
    const endDate = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'last7days':
        startDate = subDays(endDate, 7);
        break;
      case 'last30days':
        startDate = subDays(endDate, 30);
        break;
      case 'last3months':
        startDate = subMonths(endDate, 3);
        break;
      case 'lastYear':
        startDate = subYears(endDate, 1);
        break;
      case 'custom':
        startDate = customStartDate ? new Date(customStartDate) : subDays(endDate, 30);
        break;
      default:
        startDate = subDays(endDate, 30);
    }
    
    return { startDate, endDate };
  };

  // Filter bookings by date range
  const { startDate, endDate } = getDateRange();
  const filteredBookings = bookings?.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= startDate && bookingDate <= endDate;
  }) || [];

  // Calculate report data
  const totalBookings = filteredBookings.length;
  const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length;
  const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length;
  
  const totalRevenue = filteredBookings.reduce((sum, booking) => {
    return booking.status === 'confirmed' ? sum + booking.totalPrice : sum;
  }, 0);

  const averageBookingValue = totalBookings > 0 ? totalRevenue / confirmedBookings : 0;

  // Get bookings by hotel
  const bookingsByHotel: Record<string, { count: number, revenue: number }> = {};
  filteredBookings.forEach(booking => {
    if (booking.status === 'confirmed') {
      if (!bookingsByHotel[booking.hotelId]) {
        bookingsByHotel[booking.hotelId] = { count: 0, revenue: 0 };
      }
      bookingsByHotel[booking.hotelId].count += 1;
      bookingsByHotel[booking.hotelId].revenue += booking.totalPrice;
    }
  });

  const handleGenerateReport = () => {
    // In a real application, this would generate an actual report
    toast.success(`Report generated for ${reportType} from ${format(startDate, 'MMM d, yyyy')} to ${format(endDate, 'MMM d, yyyy')}`);
    console.log('Report data:', {
      reportType,
      dateRange,
      startDate,
      endDate,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      pendingBookings,
      totalRevenue,
      averageBookingValue,
      bookingsByHotel
    });
  };

  const handleExportReport = () => {
    // In a real application, this would export the report to a file
    toast.info('Exporting report... (This is a demo)');
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
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Business Reports</h1>
      </div>

      {/* Report Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bookings">Booking Report</SelectItem>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="occupancy">Occupancy Report</SelectItem>
                  <SelectItem value="customer">Customer Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last3months">Last 3 Months</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {dateRange === 'custom' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full border rounded-md p-2"
                  />
                </div>
              </>
            )}
            
            <div className="flex items-end space-x-2">
              <Button onClick={handleGenerateReport} className="flex-1">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-10 w-10 text-blue-500" />
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
              <BarChart3 className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold">{confirmedBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PieChart className="h-10 w-10 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-10 w-10 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Booking</p>
                <p className="text-2xl font-bold">₦{Math.round(averageBookingValue).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Confirmed</span>
                  <span className="text-sm text-gray-500">{confirmedBookings} ({totalBookings > 0 ? Math.round((confirmedBookings/totalBookings)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${totalBookings > 0 ? (confirmedBookings/totalBookings)*100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm text-gray-500">{pendingBookings} ({totalBookings > 0 ? Math.round((pendingBookings/totalBookings)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${totalBookings > 0 ? (pendingBookings/totalBookings)*100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Cancelled</span>
                  <span className="text-sm text-gray-500">{cancelledBookings} ({totalBookings > 0 ? Math.round((cancelledBookings/totalBookings)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${totalBookings > 0 ? (cancelledBookings/totalBookings)*100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Hotel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(bookingsByHotel).map(([hotelId, data]) => {
                const hotel = hotels?.find(h => h.id === hotelId);
                return (
                  <div key={hotelId} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{hotel?.name || 'Unknown Hotel'}</p>
                      <p className="text-sm text-gray-500">{data.count} bookings</p>
                    </div>
                    <p className="font-semibold">₦{data.revenue.toLocaleString()}</p>
                  </div>
                );
              })}
              
              {Object.keys(bookingsByHotel).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No revenue data available for the selected period</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;