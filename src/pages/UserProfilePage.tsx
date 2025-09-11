import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfilePage = () => {
  const user = {
    name: 'Raphael',
    email: 'raphael@example.com',
    avatar: 'https://github.com/shadcn.png',
  };

  const bookings = [
    {
      id: 1,
      hotel: 'Grand Hyatt Lagos',
      date: '2023-10-15',
      status: 'Confirmed',
    },
    {
      id: 2,
      hotel: 'Eko Hotel & Suites',
      date: '2023-09-20',
      status: 'Completed',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">{user.email}</p>
                <Button className="mt-4">Edit Profile</Button>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {bookings.map((booking) => (
                    <li key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{booking.hotel}</h3>
                        <p className="text-sm text-gray-500">Date: {booking.date}</p>
                      </div>
                      <span className={`text-sm font-semibold ${booking.status === 'Confirmed' ? 'text-green-600' : 'text-gray-600'}`}>
                        {booking.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;