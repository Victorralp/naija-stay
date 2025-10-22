import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { HomeIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="mb-6">
          <div className="text-9xl font-bold text-indigo-600 mb-2">404</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          <p className="text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleGoHome} size="lg">
            <HomeIcon className="mr-2 h-5 w-5" />
            Return to Home
          </Button>
          <Button variant="outline" onClick={handleGoBack} size="lg">
            <SearchIcon className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Error code: 404</p>
          <p className="truncate">Path: {location.pathname}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;