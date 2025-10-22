import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { Mail, Send, Users } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: Date;
}

const NewsletterManagement: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      try {
        const subscribersData = await adminService.getNewsletterSubscribers();
        setSubscribers(subscribersData);
      } catch (error) {
        toast.error('Failed to fetch subscribers');
        console.error('Fetch subscribers error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  // Handle sending newsletter
  const handleSendNewsletter = async () => {
    if (!subject || !message) {
      toast.error('Please fill in both subject and message');
      return;
    }

    setSending(true);
    try {
      const result = await adminService.sendNewsletter(subject, message);
      
      toast.success(`Newsletter sent successfully! ${result.successCount} sent, ${result.failureCount} failed.`);
      setSubject('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send newsletter');
      console.error('Send newsletter error:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Newsletter Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Send Newsletter</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Newsletter subject"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your newsletter content here..."
                    rows={6}
                  />
                </div>
                <Button 
                  onClick={handleSendNewsletter} 
                  disabled={sending || loading}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscriber Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Total Subscribers</span>
                  </div>
                  <span className="text-2xl font-bold">{subscribers.length}</span>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Recent Subscribers</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {subscribers.map((subscriber) => (
                      <div key={subscriber.id} className="flex justify-between text-sm">
                        <span>{subscriber.name || subscriber.email}</span>
                        <span className="text-gray-500">
                          {subscriber.subscribedAt.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagement;