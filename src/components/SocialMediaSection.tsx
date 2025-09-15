import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const SocialMediaSection = () => {
  const socialPosts = [
    {
      id: 1,
      platform: "Instagram",
      username: "@naijahotels",
      content: "Sunset views from our rooftop bar in Lagos! 🌅 #NaijaHotels #LagosLife #NigerianHospitality",
      likes: 245,
      comments: 32,
      image: "" // Placeholder
    },
    {
      id: 2,
      platform: "Instagram",
      username: "@naijahotels",
      content: "Traditional Nigerian breakfast spread at our Abuja location. Jollof rice, plantains, and more! 🍚 #NigerianCuisine #Breakfast",
      likes: 189,
      comments: 24,
      image: "" // Placeholder
    },
    {
      id: 3,
      platform: "Twitter",
      username: "@naijahotels",
      content: "Excited to announce our new partnership with local tour guides in Port Harcourt! More authentic experiences for our guests. 🇳🇬 #Tourism #Nigeria",
      likes: 98,
      comments: 15,
      image: "" // Placeholder
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            Social Buzz
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Join Our Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            See what our guests are saying and share your own experiences with #NaijaHotels
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {socialPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full overflow-hidden">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {post.platform === "Instagram" && (
                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                      )}
                      {post.platform === "Twitter" && (
                        <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      )}
                      <div>
                        <CardTitle className="text-base sm:text-lg">{post.username}</CardTitle>
                        <p className="text-xs text-muted-foreground">{post.platform}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {post.platform}
                    </Badge>
                  </div>
                </CardHeader>
              
                <CardContent>
                  <p className="text-muted-foreground mb-3 sm:mb-4 line-clamp-3 text-sm sm:text-base">
                    {post.content}
                  </p>
                
                  {/* Image placeholder */}
                  <div className="h-32 sm:h-40 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                
                  <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
            <Button variant="outline" className="px-4 sm:px-6 text-sm sm:text-base">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-pink-500" />
              Follow on Instagram
            </Button>
            <Button variant="outline" className="px-4 sm:px-6 text-sm sm:text-base">
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-600" />
              Like on Facebook
            </Button>
            <Button variant="outline" className="px-4 sm:px-6 text-sm sm:text-base">
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-400" />
              Follow on Twitter
            </Button>
          </div>
        
          <p className="text-muted-foreground text-sm sm:text-base">
            Share your experiences with <span className="font-semibold text-primary">#NaijaHotels</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;