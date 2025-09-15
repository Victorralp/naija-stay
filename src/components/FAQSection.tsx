import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I book a room?",
      answer: "You can book a room directly through our website by selecting your desired dates and hotel, or call our customer service team at +234 809 123 4567 for assistance."
    },
    {
      question: "What are your check-in and check-out times?",
      answer: "Standard check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in and late check-out may be available upon request and subject to availability."
    },
    {
      question: "Do you offer airport transfers?",
      answer: "Yes, we offer airport transfer services for an additional fee. Please book this service at least 24 hours in advance through our website or by contacting our concierge team."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard), bank transfers, and mobile money payments. Cash payments are also accepted at the hotel."
    },
    {
      question: "Can I cancel or modify my reservation?",
      answer: "Yes, cancellations and modifications are allowed based on our flexible cancellation policy. Please review the specific terms at the time of booking or contact our customer service."
    },
    {
      question: "Do you have facilities for guests with disabilities?",
      answer: "Yes, our hotels are equipped with accessible rooms and facilities for guests with disabilities. Please inform us of any specific requirements when making your reservation."
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12">
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Frequently Asked Questions
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Need Help? We've Got Answers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Find quick answers to common questions about bookings, services, and policies
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0 space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    className="cursor-pointer transition-all duration-300 hover:shadow-md"
                    onClick={() => toggleAccordion(index)}
                  >
                    <CardHeader className="py-3 sm:py-4 px-4 sm:px-6 flex flex-row items-center justify-between">
                      <CardTitle className="text-base sm:text-lg font-medium text-foreground">
                        {faq.question}
                      </CardTitle>
                      <ChevronDown 
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform duration-300 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </CardHeader>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {faq.answer}
                          </p>
                        </CardContent>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <div className="text-center mt-10 sm:mt-12 p-6 sm:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Our customer support team is ready to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="px-5 py-2.5 sm:px-6 sm:py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base">
                Contact Support
              </button>
              <button className="px-5 py-2.5 sm:px-6 sm:py-3 border border-input bg-background rounded-lg font-medium text-foreground hover:bg-accent transition-colors text-sm sm:text-base">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;