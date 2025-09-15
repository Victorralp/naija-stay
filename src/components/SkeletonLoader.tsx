import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animated?: boolean;
}

const SkeletonLoader = ({ 
  className, 
  width = "100%", 
  height = "1rem", 
  borderRadius = "0.25rem",
  animated = true 
}: SkeletonLoaderProps) => {
  return (
    <div 
      className={cn(
        "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800",
        animated && "animate-pulse",
        className
      )}
      style={{ width, height, borderRadius }}
    />
  );
};

export default SkeletonLoader;