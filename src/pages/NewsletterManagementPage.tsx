import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NewsletterManagementPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Newsletter Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers & Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsletterManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagementPage;