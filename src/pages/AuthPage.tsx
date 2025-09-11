import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { UserProfile } from '../components/UserProfile';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Navigate } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to NaijaStay
          </h1>
          <p className="mt-2 text-gray-600">
            Your gateway to the best Nigerian hospitality
          </p>
        </div>

        <Card className="overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 border-0">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="login" className="mt-0">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="register" className="mt-0">
                <RegisterForm />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Demo credentials:</p>
          <p>Email: test@example.com | Password: password</p>
        </div>
      </div>
    </div>
  );
};