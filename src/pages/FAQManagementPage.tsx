import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Define FAQ type
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQManagementPage = () => {
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: "How do I book a room?",
      answer: "You can book a room directly through our website by selecting your desired dates and hotel, or call our customer service team at +234 809 123 4567 for assistance."
    },
    {
      id: '2',
      question: "What are your check-in and check-out times?",
      answer: "Standard check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in and late check-out may be available upon request and subject to availability."
    },
    {
      id: '3',
      question: "Do you offer airport transfers?",
      answer: "Yes, we offer airport transfer services for an additional fee. Please book this service at least 24 hours in advance through our website or by contacting our concierge team."
    },
    {
      id: '4',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard), bank transfers, and mobile money payments. Cash payments are also accepted at the hotel."
    },
    {
      id: '5',
      question: "Can I cancel or modify my reservation?",
      answer: "Yes, cancellations and modifications are allowed based on our flexible cancellation policy. Please review the specific terms at the time of booking or contact our customer service."
    },
    {
      id: '6',
      question: "Do you have facilities for guests with disabilities?",
      answer: "Yes, our hotels are equipped with accessible rooms and facilities for guests with disabilities. Please inform us of any specific requirements when making your reservation."
    }
  ]);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      toast.error('Please fill in both question and answer');
      return;
    }
    
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: formData.question,
      answer: formData.answer
    };
    
    setFaqs(prev => [...prev, newFAQ]);
    setFormData({ question: '', answer: '' });
    setIsAddingFAQ(false);
    toast.success('FAQ added successfully');
  };

  const handleUpdateFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFAQ || !formData.question || !formData.answer) {
      toast.error('Please fill in both question and answer');
      return;
    }
    
    setFaqs(prev => 
      prev.map(faq => 
        faq.id === editingFAQ.id 
          ? { ...faq, question: formData.question, answer: formData.answer } 
          : faq
      )
    );
    
    setFormData({ question: '', answer: '' });
    setEditingFAQ(null);
    toast.success('FAQ updated successfully');
  };

  const handleDeleteFAQ = (id: string, question: string) => {
    if (window.confirm(`Are you sure you want to delete the FAQ: "${question}"?`)) {
      setFaqs(prev => prev.filter(faq => faq.id !== id));
      toast.success('FAQ deleted successfully');
    }
  };

  const startEditing = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer
    });
  };

  const cancelEditing = () => {
    setEditingFAQ(null);
    setFormData({ question: '', answer: '' });
    setIsAddingFAQ(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">FAQ Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditing(faq)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteFAQ(faq.id, faq.question)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {faqs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No FAQs found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {editingFAQ ? 'Edit FAQ' : isAddingFAQ ? 'Add New FAQ' : 'FAQ Management'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAddingFAQ || editingFAQ ? (
                <form onSubmit={editingFAQ ? handleUpdateFAQ : handleAddFAQ} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="question" className="text-sm font-medium">Question</label>
                    <Input
                      id="question"
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      placeholder="Enter the question"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="answer" className="text-sm font-medium">Answer</label>
                    <Textarea
                      id="answer"
                      name="answer"
                      value={formData.answer}
                      onChange={handleInputChange}
                      placeholder="Enter the answer"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {editingFAQ ? 'Update FAQ' : 'Add FAQ'}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <Button 
                    onClick={() => setIsAddingFAQ(true)}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New FAQ
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">FAQ Management</h3>
                    <p className="text-sm text-gray-500">
                      Manage frequently asked questions that appear on the website. 
                      These help customers find quick answers to common questions.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQManagementPage;