import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Thermometer } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching weather data
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from a weather API
        // For now, we'll simulate with sample data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sampleWeather: WeatherData = {
          temperature: 32,
          condition: "sunny",
          location: "Lagos, Nigeria",
          humidity: 75,
          windSpeed: 12
        };
        
        setWeather(sampleWeather);
      } catch (err) {
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="w-6 h-6 text-gray-500" />;
      case "rainy":
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border">
      <h3 className="font-semibold text-foreground mb-3">Local Weather</h3>
      
      {loading ? (
        <div className="space-y-3">
          <SkeletonLoader width="60%" height="1.25rem" />
          <SkeletonLoader width="80%" height="1rem" />
          <div className="flex items-center space-x-2">
            <SkeletonLoader width="2rem" height="2rem" borderRadius="50%" />
            <SkeletonLoader width="40%" height="1.5rem" />
          </div>
        </div>
      ) : weather ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{weather.location}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getWeatherIcon(weather.condition)}
              <span className="text-2xl font-bold">{weather.temperature}°C</span>
            </div>
            <span className="text-sm capitalize">{weather.condition}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Thermometer className="w-4 h-4" />
              <span>Humidity: {weather.humidity}%</span>
            </div>
            <div>
              Wind: {weather.windSpeed} km/h
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherWidget;