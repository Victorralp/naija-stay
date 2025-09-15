import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const currencies = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];

const CurrencySelector = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Get saved currency from localStorage or default to NGN
    const savedCurrency = localStorage.getItem("preferredCurrency") || "NGN";
    setSelectedCurrency(savedCurrency);
    setIsClient(true);
  }, []);

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    localStorage.setItem("preferredCurrency", value);
    // In a real app, you would trigger a refresh of prices here
  };

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="flex items-center space-x-2">
      <Wallet className="w-4 h-4 text-muted-foreground" />
      <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-[120px] text-sm">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              {currency.symbol} {currency.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;