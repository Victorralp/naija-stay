import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, Star, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileAppSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4 bg-white/20 text-primary-foreground">
                Mobile App
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Book on the Go with Our App
              </h2>
              <p className="text-primary-foreground/90 text-base sm:text-lg mb-6">
                Download our mobile app for exclusive deals, instant booking, 
                mobile check-in, and personalized recommendations wherever you are.
              </p>
            </motion.div>

            {/* App Features */}
            <div className="space-y-4">
              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">Exclusive Mobile-Only Deals</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Get special discounts available only through our app
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">Instant Booking & Check-in</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Book rooms and check in directly from your phone
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">Digital Room Key</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Skip the front desk with our digital room key feature
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Download Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button 
                variant="secondary" 
                size="lg" 
                className="flex-1 px-4 sm:px-6 bg-white text-primary hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <div className="bg-black text-white text-xs font-bold px-1.5 py-1 rounded mr-2">APP</div>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-base sm:text-lg font-semibold">App Store</div>
                  </div>
                </div>
              </Button>
            
              <Button 
                variant="secondary" 
                size="lg" 
                className="flex-1 px-4 sm:px-6 bg-white text-primary hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <div className="bg-black text-white text-xs font-bold px-1.5 py-1 rounded mr-2">PLAY</div>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-base sm:text-lg font-semibold">Google Play</div>
                  </div>
                </div>
              </Button>
            </motion.div>
          </div>

          {/* App Mockup */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-48 h-[360px] sm:w-56 sm:h-[420px] md:w-64 md:h-[500px] bg-black rounded-[30px] sm:rounded-[35px] md:rounded-[40px] border-[8px] sm:border-[10px] md:border-[12px] border-white shadow-2xl relative overflow-hidden">
                {/* Screen Content */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 p-3 sm:p-4 flex flex-col">
                  {/* Status Bar */}
                  <div className="flex justify-between text-white text-xs mb-4 sm:mb-6">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-1.5 sm:w-4 sm:h-2 bg-white rounded-sm"></div>
                      <div className="w-3 h-1.5 sm:w-4 sm:h-2 bg-white rounded-sm"></div>
                      <div className="w-5 h-1.5 sm:w-6 sm:h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>
                
                  {/* App Header */}
                  <div className="text-center mb-4 sm:mb-6">
                    <h3 className="text-white font-bold text-lg sm:text-xl">Naija Stay</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Premium Hotel Booking</p>
                  </div>
                
                  {/* App Content */}
                  <div className="flex-grow bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex space-x-2 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20"></div>
                      <div className="flex-1">
                        <div className="h-2 sm:h-3 bg-white/30 rounded mb-2"></div>
                        <div className="h-1.5 sm:h-2 bg-white/20 rounded w-3/4"></div>
                      </div>
                    </div>
                  
                    <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                      <div className="h-14 sm:h-20 bg-white/20 rounded-lg"></div>
                      <div className="h-14 sm:h-20 bg-white/20 rounded-lg"></div>
                    </div>
                  
                    <div className="h-6 sm:h-8 bg-white/30 rounded-lg mb-2"></div>
                    <div className="h-6 sm:h-8 bg-white/30 rounded-lg"></div>
                  </div>
                
                  {/* Navigation */}
                  <div className="flex justify-around">
                    <div className="text-center text-white">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 bg-white/30 rounded-full"></div>
                      <span className="text-xs">Home</span>
                    </div>
                    <div className="text-center text-white/60">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 bg-white/20 rounded-full"></div>
                      <span className="text-xs">Search</span>
                    </div>
                    <div className="text-center text-white/60">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 bg-white/20 rounded-full"></div>
                      <span className="text-xs">Bookings</span>
                    </div>
                    <div className="text-center text-white/60">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 bg-white/20 rounded-full"></div>
                      <span className="text-xs">Profile</span>
                    </div>
                  </div>
                </div>
              </div>
            
              {/* QR Code Placeholder */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center">
                <QrCode className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;