import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Shield, FileText, CheckCircle } from 'lucide-react';

const FirebaseSetupGuide: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Firebase Setup Guide</h1>
          <p className="text-muted-foreground">
            Resolve Firebase permissions errors and configure your Firestore database
          </p>
        </div>

        <Alert className="mb-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>FirebaseError: Missing or insufficient permissions</AlertTitle>
          <AlertDescription>
            This error occurs when your Firestore security rules don't allow the operations your app is trying to perform.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Understanding the Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The "Missing or insufficient permissions" error occurs when Firestore security rules prevent read or write operations. This is a security feature that protects your database from unauthorized access.
              </p>
              <p className="mb-4">
                Common causes include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Default security rules that deny all access</li>
                <li>Rules that only allow access to authenticated users</li>
                <li>Rules that restrict access based on user roles</li>
                <li>Attempting to write to collections that don't exist yet</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Solution: Update Firestore Security Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">For Development (Permissive Rules)</h3>
              <p className="mb-4">
                For development purposes, you can use these permissive rules that allow read/write access to all users:
              </p>
              <pre className="bg-muted p-4 rounded-md text-sm mb-4 overflow-x-auto">
                {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users in development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
              </pre>

              <h3 className="font-semibold mb-2">For Production (Secure Rules)</h3>
              <p className="mb-4">
                For production, use these more secure rules that require authentication:
              </p>
              <pre className="bg-muted p-4 rounded-md text-sm mb-4 overflow-x-auto">
                {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read hotels and rooms
    match /hotels/{hotelId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /rooms/{roomId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Users can create their own bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.admin == true);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.admin == true);
    }
    
    // Authenticated users can read testimonials
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.admin == true);
    }
    
    // Only admins can manage users
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         request.auth.token.admin == true);
    }
  }
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Update Your Security Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Firebase Console</a></li>
                <li>Select your project</li>
                <li>Click on "Firestore Database" in the left sidebar</li>
                <li>Click on the "Rules" tab</li>
                <li>Replace the existing rules with one of the rule sets above</li>
                <li>Click "Publish" to save your changes</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Verification Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                After updating your security rules, try seeding your database again:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Restart your development server</li>
                <li>Navigate to the seed data page</li>
                <li>Click the "Seed Database" button</li>
                <li>Check the console for any errors</li>
              </ol>
              <div className="mt-6">
                <Button asChild>
                  <a href="/seed-data">Go to Seed Data Page</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupGuide;