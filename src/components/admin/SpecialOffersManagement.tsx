import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Gift, 
  Calendar, 
  MapPin, 
  Clock,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  location: string;
  duration: string;
  featured: boolean;
  terms: string;
}

const SpecialOffersManagement: React.FC = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);
  const [formData, setFormData] = useState<Omit<SpecialOffer, 'id'>>({
    title: '',
    description: '',
    discount: '',
    validUntil: '',
    location: '',
    duration: '',
    featured: false,
    terms: ''
  });

  // Fetch special offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const fetchedOffers = await adminService.getSpecialOffers();
        setOffers(fetchedOffers);
      } catch (error) {
        toast.error('Failed to fetch special offers');
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOffer) {
        // Update existing offer
        await adminService.saveSpecialOffer(formData, editingOffer.id);
        setOffers(prev => prev.map(offer => 
          offer.id === editingOffer.id 
            ? { ...formData, id: editingOffer.id } as SpecialOffer
            : offer
        ));
        toast.success('Special offer updated successfully');
      } else {
        // Add new offer
        await adminService.saveSpecialOffer(formData);
        const newOffer: SpecialOffer = {
          ...formData,
          id: Date.now().toString()
        };
        setOffers(prev => [...prev, newOffer]);
        toast.success('Special offer added successfully');
      }
    } catch (error) {
      toast.error('Failed to save special offer');
      console.error('Error saving offer:', error);
      return;
    }
    
    // Reset form and close dialog
    setFormData({
      title: '',
      description: '',
      discount: '',
      validUntil: '',
      location: '',
      duration: '',
      featured: false,
      terms: ''
    });
    setEditingOffer(null);
    setIsDialogOpen(false);
  };

  // Handle edit offer
  const handleEditOffer = (offer: SpecialOffer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      validUntil: offer.validUntil,
      location: offer.location,
      duration: offer.duration,
      featured: offer.featured,
      terms: offer.terms
    });
    setIsDialogOpen(true);
  };

  // Handle delete offer
  const handleDeleteOffer = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the offer "${title}"? This action cannot be undone.`)) {
      try {
        await adminService.deleteSpecialOffer(id);
        setOffers(prev => prev.filter(offer => offer.id !== id));
        toast.success('Special offer deleted successfully');
      } catch (error) {
        toast.error('Failed to delete special offer');
        console.error('Error deleting offer:', error);
      }
    }
  };

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      setEditingOffer(null);
      setFormData({
        title: '',
        description: '',
        discount: '',
        validUntil: '',
        location: '',
        duration: '',
        featured: false,
        terms: ''
      });
    }
  }, [isDialogOpen]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Special Offers Management
            </CardTitle>
            <div className="flex space-x-2">
              <Link to="/special-offers" target="_blank">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Offers Page
                </Button>
              </Link>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Offer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingOffer ? 'Edit Special Offer' : 'Add New Special Offer'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="title">Offer Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="e.g., Weekend Getaway Special"
                          required
                        />
                      </div>
                    
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Brief description of the offer"
                          required
                        />
                      </div>
                    
                      <div>
                        <Label htmlFor="discount">Discount</Label>
                        <Input
                          id="discount"
                          name="discount"
                          value={formData.discount}
                          onChange={handleInputChange}
                          placeholder="e.g., 25% OFF or 1 FREE NIGHT"
                          required
                        />
                      </div>
                    
                      <div>
                        <Label htmlFor="validUntil">Valid Until</Label>
                        <Input
                          id="validUntil"
                          name="validUntil"
                          type="date"
                          value={formData.validUntil}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g., Lagos, Abuja"
                          required
                        />
                      </div>
                    
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          placeholder="e.g., Weekends Only, 7+ Nights"
                          required
                        />
                      </div>
                    
                      <div className="md:col-span-2">
                        <Label htmlFor="terms">Terms & Conditions</Label>
                        <Textarea
                          id="terms"
                          name="terms"
                          value={formData.terms}
                          onChange={handleInputChange}
                          placeholder="Detailed terms and conditions for this offer"
                          required
                        />
                      </div>
                    
                      <div className="md:col-span-2 flex items-center space-x-2">
                        <input
                          id="featured"
                          name="featured"
                          type="checkbox"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="featured">Featured Offer</Label>
                      </div>
                    </div>
                  
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingOffer ? 'Update Offer' : 'Add Offer'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Manage special offers and deals for your customers. Create, edit, and delete promotional offers.
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No special offers found</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Offer
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <Card key={offer.id} className={`h-full overflow-hidden relative ${offer.featured ? 'border-primary shadow-lg' : ''}`}>
                  {offer.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        <Gift className="w-4 h-4 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{offer.title}</CardTitle>
                      <Badge variant="outline" className="text-lg font-bold">
                        {offer.discount}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{offer.description}</p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{offer.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{offer.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditOffer(offer)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteOffer(offer.id, offer.title)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialOffersManagement;