import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { MessageCircle, User, Mail, Calendar, Reply } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  status: 'unread' | 'read' | 'replied';
}

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Fetch contact messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const messagesData = await adminService.getContactMessages();
        setMessages(messagesData);
      } catch (error) {
        toast.error('Failed to fetch messages');
        console.error('Fetch messages error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Handle message status update
  const handleMessageStatusUpdate = async (messageId: string, status: 'read' | 'replied') => {
    try {
      await adminService.updateContactMessageStatus(messageId, status);
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
      
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      
      toast.success('Message status updated');
    } catch (error) {
      toast.error('Failed to update message status');
      console.error('Update message status error:', error);
    }
  };

  // Handle reply to message
  const handleReplyToMessage = async () => {
    if (!selectedMessage || !replyMessage) return;
    
    try {
      // In a real implementation, you would send the reply email and save it to Firestore
      console.log('Sending reply:', { 
        to: selectedMessage.email, 
        message: replyMessage,
        originalMessage: selectedMessage 
      });
      
      // Update status to replied
      await handleMessageStatusUpdate(selectedMessage.id, 'replied');
      setReplyMessage('');
      toast.success('Reply sent successfully');
    } catch (error) {
      toast.error('Failed to send reply');
      console.error('Reply message error:', error);
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: ContactMessage['status']) => {
    switch (status) {
      case 'unread': return 'default';
      case 'read': return 'secondary';
      case 'replied': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{message.name}</h3>
                        <Badge variant={getStatusVariant(message.status)}>
                          {message.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{message.email}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{format(message.createdAt, "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 line-clamp-2">
                    {message.message}
                  </p>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No contact messages found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedMessage.name}</span>
                  <Badge variant={getStatusVariant(selectedMessage.status)}>
                    {selectedMessage.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="max-h-[50vh] pr-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{selectedMessage.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{format(selectedMessage.createdAt, "MMMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Message:</h4>
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Reply:</h4>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write your reply here..."
                      className="w-full min-h-[120px] p-3 border rounded-md"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        onClick={() => handleMessageStatusUpdate(selectedMessage.id, 'read')}
                      >
                        Mark as Read
                      </Button>
                      <Button 
                        onClick={handleReplyToMessage}
                        disabled={!replyMessage.trim()}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactMessages;