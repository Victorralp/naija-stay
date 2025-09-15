import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Building2, 
  User, 
  LogIn, 
  LogOut, 
  Shield, 
  Database,
  Keyboard
} from 'lucide-react';
import { toast } from 'sonner';
import CurrencySelector from '@/components/CurrencySelector';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  // Show keyboard shortcuts help
  const showShortcutsHelp = () => {
    toast.info(
      <div>
        <h3 className="font-bold mb-2">Keyboard Shortcuts</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <kbd className="px-2 py-1 bg-gray-100 border rounded">Ctrl</kbd> +{' '}
            <kbd className="px-2 py-1 bg-gray-100 border rounded">Shift</kbd> +{' '}
            <kbd className="px-2 py-1 bg-gray-100 border rounded">A</kbd> - Go to Admin Dashboard
          </li>
          <li>
            <kbd className="px-2 py-1 bg-gray-100 border rounded">Ctrl</kbd> +{' '}
            <kbd className="px-2 py-1 bg-gray-100 border rounded">Shift</kbd> +{' '}
            <kbd className="px-2 py-1 bg-gray-100 border rounded">?</kbd> - Show this help
          </li>
        </ul>
      </div>,
      {
        duration: 10000,
      }
    );
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">NaijaStay</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-blue-600 transition-colors">
              Rooms
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <CurrencySelector />
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={showShortcutsHelp}
                  className="hidden md:flex items-center"
                >
                  <Keyboard className="h-4 w-4 mr-1" />
                  <span className="text-xs">Shortcuts</span>
                </Button>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                {user.email === 'victorralph407@gmail.com' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button onClick={logout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;