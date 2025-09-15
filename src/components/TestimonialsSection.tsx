import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Adunni O.",
      role: "Business Traveler",
      content: "The service at Grand Hotel Lagos was exceptional. The staff went above and beyond to make my stay comfortable. Will definitely be returning!",
      avatar: "",
      rating: 5
    },
    {
      id: 2,
      name: "Chinedu M.",
      role: "Tourist",
      content: "Beautiful property with stunning views. The location is perfect for exploring the city. The rooftop restaurant has the best jollof rice in town!",
      avatar: "",
      rating: 5
    },
    {
      id: 3,
      name: "Amina K.",
      role: "Family Vacation",
      content: "Our family vacation was made perfect by the kid-friendly amenities and spacious rooms. The pool area is fantastic for children and adults alike.",
      avatar: "",
      rating: 4
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Guests Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>
      
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-base">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base sm:text-lg">{testimonial.name}</CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-primary/20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base line-clamp-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;