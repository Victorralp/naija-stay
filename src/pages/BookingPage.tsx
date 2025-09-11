import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BookingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Book Your Stay</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label htmlFor="hotel" className="block text-sm font-medium text-gray-700">Hotel</label>
                <Select>
                  <SelectTrigger id="hotel">
                    <SelectValue placeholder="Select a hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grand-hyatt">Grand Hyatt Lagos</SelectItem>
                    <SelectItem value="eko-hotel">Eko Hotel & Suites</SelectItem>
                    <SelectItem value="sheraton-abuja">Sheraton Abuja Hotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="check-in" className="block text-sm font-medium text-gray-700">Check-in Date</label>
                  <Input id="check-in" type="date" />
                </div>
                <div>
                  <label htmlFor="check-out" className="block text-sm font-medium text-gray-700">Check-out Date</label>
                  <Input id="check-out" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adults" className="block text-sm font-medium text-gray-700">Adults</label>
                  <Input id="adults" type="number" min="1" placeholder="1" />
                </div>
                <div>
                  <label htmlFor="children" className="block text-sm font-medium text-gray-700">Children</label>
                  <Input id="children" type="number" min="0" placeholder="0" />
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <Input id="name" placeholder="Enter your full name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <Button type="submit" className="w-full">Confirm Booking</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;