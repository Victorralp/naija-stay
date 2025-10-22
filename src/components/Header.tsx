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
  Keyboard,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import CurrencySelector from '@/components/CurrencySelector';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

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

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Special Offers', path: '/special-offers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && !(event.target as Element).closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">NaijaStay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            <CurrencySelector />
            {user ? (
              <div className="relative user-menu">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline mr-1">{user.email?.split('@')[0]}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={showShortcutsHelp}
                      className="w-full justify-start"
                    >
                      <Keyboard className="h-4 w-4 mr-2" />
                      Shortcuts
                    </Button>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    {user.email === 'victorralph407@gmail.com' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button 
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }} 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-1" />
                  <span className="hidden lg:inline">Login</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <CurrencySelector />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3 mb-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      showShortcutsHelp();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    <Keyboard className="h-4 w-4 mr-2" />
                    Shortcuts
                  </Button>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="justify-start w-full">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  {user.email === 'victorralph407@gmail.com' && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="justify-start w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="justify-start w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;