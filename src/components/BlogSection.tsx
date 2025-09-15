import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Cultural Experiences in Lagos",
      excerpt: "Discover the vibrant cultural scene of Lagos with our guide to museums, art galleries, and traditional markets.",
      author: "Adunni Okafor",
      date: "May 15, 2025",
      category: "Travel Guide",
      readTime: "5 min read",
      image: "" // We'll use a placeholder
    },
    {
      id: 2,
      title: "Luxury Accommodations in Abuja",
      excerpt: "Explore the finest luxury hotels in Nigeria's capital city, perfect for business and leisure travelers.",
      author: "Chinedu Eze",
      date: "Apr 28, 2025",
      category: "Hotel Review",
      readTime: "7 min read",
      image: "" // We'll use a placeholder
    },
    {
      id: 3,
      title: "Port Harcourt's Hidden Gems",
      excerpt: "Uncover the lesser-known attractions and local favorites in Port Harcourt that tourists often miss.",
      author: "Amina Yusuf",
      date: "Apr 12, 2025",
      category: "Local Experience",
      readTime: "6 min read",
      image: "" // We'll use a placeholder
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            Travel Insights
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Latest Travel News & Tips
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Stay updated with travel tips, destination guides, and industry news from our experts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden flex flex-col">
                {/* Image placeholder */}
                <div className="h-40 sm:h-48 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 sm:w-16 sm:h-16" />
                </div>
                
                <CardHeader className="flex-grow pb-3 sm:pb-4">
                  <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                    <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    <Badge variant="secondary" className="text-xs">{post.readTime}</Badge>
                  </div>
                
                  <CardTitle className="text-lg sm:text-xl mb-2 line-clamp-2">
                    {post.title}
                  </CardTitle>
                
                  <CardDescription className="line-clamp-3 text-sm sm:text-base">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
              
                <CardContent className="mt-auto pt-0">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    <div className="flex items-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium hover:bg-transparent text-sm sm:text-base">
                    Read Full Article
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Button variant="hero" size="lg" className="px-6 sm:px-8 text-sm sm:text-base">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;