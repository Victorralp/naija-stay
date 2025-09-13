import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import RoomsPage from './pages/RoomsPage';
import HotelDetails from './pages/HotelDetails';
import BookingPage from './pages/BookingPage';
import EnhancedBookingPage from './pages/EnhancedBookingPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ContactPage from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import FirebaseSetupGuide from './pages/FirebaseSetupGuide';
import SeedDataPage from './pages/SeedDataPage';
import AboutUsPage from './pages/AboutUsPage';
import NotFound from './pages/NotFound';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/hotel/:id" element={<HotelDetails />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/enhanced-booking" element={<EnhancedBookingPage />} />
                <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
                <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/seed-data" element={<SeedDataPage />} />
                <Route path="/firebase-setup" element={<FirebaseSetupGuide />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;