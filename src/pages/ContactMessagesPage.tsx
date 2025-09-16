import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContactMessages from '@/components/admin/ContactMessages';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ContactMessagesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Contact Messages</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Messages & Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactMessages />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactMessagesPage;