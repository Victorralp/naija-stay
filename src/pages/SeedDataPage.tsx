import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Database, ShieldAlert, ExternalLink } from 'lucide-react';
import { seedDatabase } from '@/utils/seedData';
import { Link } from 'react-router-dom';

const SeedDataPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeedDatabase = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await seedDatabase();
      setSuccess(true);
    } catch (err: any) {
      console.error('Error seeding database:', err);
      setError(err.message || 'An unknown error occurred while seeding the database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Database Seeding</h1>
          <p className="text-muted-foreground">
            Populate your Firestore database with sample hotel and room data
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Seed Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Click the button below to populate your Firestore database with sample data for hotels and rooms.
              This will create sample Nigerian hotels with rooms, amenities, and pricing information.
            </p>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Firebase Permissions Error</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">{error}</p>
                  <p className="mb-3">
                    This error occurs when your Firestore security rules don't allow write operations.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/firebase-setup" className="flex items-center gap-1">
                      View Firebase Setup Guide
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Database seeded successfully with sample hotel and room data.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleSeedDatabase} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                'Seed Database'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Ensure you have created a Firebase project and configured your environment variables</li>
              <li>Update your Firestore security rules to allow write operations</li>
              <li>Click the "Seed Database" button above</li>
              <li>Check the console for any errors</li>
              <li>Visit the rooms page to verify the data was added</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeedDataPage;