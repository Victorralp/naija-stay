import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { toast } from 'sonner';
import { performanceMonitor } from './utils/performance';
import { heatmapTracker } from './utils/heatmap';

const queryClient = new QueryClient();

// Create a component that handles keyboard shortcuts
const KeyboardShortcutsHandler: React.FC = () => {
  const navigate = useNavigate();

  // Navigate to admin dashboard with Ctrl+Shift+A
  useKeyboardShortcut('A', () => {
    toast.info('Navigating to Admin Dashboard...');
    navigate('/admin');
  }, { ctrlKey: true, shiftKey: true });

  // Show available shortcuts with Ctrl+Shift+?
  useKeyboardShortcut('?', () => {
    toast.info('Keyboard Shortcuts:\nCtrl+Shift+A: Go to Admin Dashboard\nCtrl+Shift+?: Show this help', {
      duration: 5000,
    });
  }, { ctrlKey: true, shiftKey: true });

  return null;
};

function App() {
  useEffect(() => {
    // Measure initial page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    performanceMonitor.measurePageLoad('App', loadTime);
    
    // Initialize heatmap tracking
    heatmapTracker.init();
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex flex-col min-h-screen">
            {/* Skip links for accessibility */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary focus:text-primary-foreground z-50"
            >
              Skip to main content
            </a>
            <a 
              href="#footer" 
              className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary focus:text-primary-foreground z-50 mt-12"
            >
              Skip to footer
            </a>
            
            <KeyboardShortcutsHandler />
            <Header />
            <main id="main-content" className="flex-grow">
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