import { useState, useEffect } from "react";
import { Circle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface AvailabilityIndicatorProps {
  hotelId?: string;
  roomId?: string;
  checkIn?: string;
  checkOut?: string;
}

const AvailabilityIndicator = ({ 
  hotelId, 
  roomId, 
  checkIn, 
  checkOut 
}: AvailabilityIndicatorProps) => {
  const [availability, setAvailability] = useState<"loading" | "available" | "limited" | "unavailable">("loading");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Simulate fetching real-time availability
    const fetchAvailability = async () => {
      try {
        // In a real app, this would call an API to check availability
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate different availability states
        const random = Math.random();
        if (random < 0.7) {
          setAvailability("available");
        } else if (random < 0.9) {
          setAvailability("limited");
        } else {
          setAvailability("unavailable");
        }
        
        setLastUpdated(new Date());
      } catch (error) {
        setAvailability("unavailable");
        setLastUpdated(new Date());
      }
    };

    fetchAvailability();
    
    // Refresh availability every 30 seconds
    const interval = setInterval(fetchAvailability, 30000);
    
    return () => clearInterval(interval);
  }, [hotelId, roomId, checkIn, checkOut]);

  const getAvailabilityInfo = () => {
    switch (availability) {
      case "available":
        return {
          text: "Available",
          color: "text-green-500",
          bgColor: "bg-green-100",
          iconColor: "text-green-500"
        };
      case "limited":
        return {
          text: "Limited Availability",
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
          iconColor: "text-yellow-500"
        };
      case "unavailable":
        return {
          text: "Not Available",
          color: "text-red-500",
          bgColor: "bg-red-100",
          iconColor: "text-red-500"
        };
      default:
        return {
          text: "Checking...",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          iconColor: "text-gray-500"
        };
    }
  };

  const availabilityInfo = getAvailabilityInfo();

  return (
    <motion.div 
      className={`flex items-center space-x-2 px-3 py-1 rounded-full ${availabilityInfo.bgColor}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Circle className={`w-3 h-3 ${availabilityInfo.iconColor} ${availability === "loading" ? "animate-pulse" : ""}`} />
      <span className={`text-sm font-medium ${availabilityInfo.color}`}>
        {availabilityInfo.text}
      </span>
      {lastUpdated && (
        <div className="flex items-center text-gray-500 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          <span>{lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </motion.div>
  );
};

export default AvailabilityIndicator;