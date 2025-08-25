import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FormInput from '@/components/FormInput';
import { getCurrentUser, createDonation, getDonations, type Donation } from '@/utils/mockApi';
import { validateDonation } from '@/utils/validations';
import { useToast } from '@/hooks/use-toast';
import { Heart, Package, Plus, Camera, MapPin, Calendar } from 'lucide-react';

const DashboardDonor = () => {
  const [showForm, setShowForm] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    items: '',
    category: '',
    quantity: 1,
    description: '',
    location: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  const categories = [
    { value: 'food', label: 'Food & Groceries' },
    { value: 'clothing', label: 'Clothing & Textiles' },
    { value: 'education', label: 'Books & Education' },
    { value: 'medical', label: 'Medical Supplies' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'furniture', label: 'Furniture & Household' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const allDonations = await getDonations();
      const userDonations = allDonations.filter(d => d.donorId === currentUser?.id);
      setDonations(userDonations);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load donations',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = () => {
    // Simulate image upload
    const imageUrl = `https://picsum.photos/300/200?random=${Date.now()}`;
    setFormData(prev => ({ ...prev, imageUrl }));
    toast({
      title: 'Image Uploaded',
      description: 'Photo has been attached to your donation',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateDonation(formData);
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((error, index) => {
        newErrors[`field${index}`] = error;
      });
      setErrors(newErrors);
      return;
    }

    if (!currentUser) return;

    setIsLoading(true);
    try {
      const donation = await createDonation({
        ...formData,
        donorId: currentUser.id,
        donorName: currentUser.name
      });

      setDonations(prev => [donation, ...prev]);
      setFormData({
        items: '',
        category: '',
        quantity: 1,
        description: '',
        location: '',
        imageUrl: ''
      });
      setShowForm(false);
      
      toast({
        title: 'Donation Added Successfully!',
        description: 'Your donation has been listed and is now available for matching.',
      });
    } catch (error) {
      setErrors({ general: 'Failed to create donation. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success-green text-white';
      case 'matched': return 'bg-generous-orange text-white';
      case 'delivered': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="h-8 w-8 text-trust-blue" />
          <h1 className="text-3xl font-bold text-foreground">Donor Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name}! Manage your donations and make a difference.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">Items donated</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Heart className="h-4 w-4 text-success-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-green">
              {donations.filter(d => d.status === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for matching</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched</CardTitle>
            <Heart className="h-4 w-4 text-generous-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-generous-orange">
              {donations.filter(d => d.status === 'matched').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully matched</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Donation Button */}
      <div className="mb-8">
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant="hero"
          size="lg"
          className="w-full md:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          {showForm ? 'Cancel' : 'Add New Donation'}
        </Button>
      </div>

      {/* Donation Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Donation</CardTitle>
            <CardDescription>
              Share details about what you'd like to donate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="items"
                  label="Items to Donate"
                  value={formData.items}
                  onChange={(value) => handleInputChange('items', value)}
                  placeholder="e.g., Winter jackets, canned food"
                  required
                  error={errors.items}
                />

                <FormInput
                  id="category"
                  label="Category"
                  type="select"
                  value={formData.category}
                  onChange={(value) => handleInputChange('category', value)}
                  options={categories}
                  required
                  error={errors.category}
                />

                <FormInput
                  id="quantity"
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(value) => handleInputChange('quantity', parseInt(value) || 1)}
                  placeholder="Number of items"
                  required
                  error={errors.quantity}
                />

                <FormInput
                  id="location"
                  label="Location"
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  placeholder="City, State"
                  required
                  error={errors.location}
                />
              </div>

              <FormInput
                id="description"
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="Provide more details about the items, condition, etc."
                required
                error={errors.description}
                rows={4}
              />

              <div className="flex items-center space-x-4">
                <Button 
                  type="button" 
                  variant="trust-outline" 
                  onClick={handleImageUpload}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
                {formData.imageUrl && (
                  <div className="flex items-center text-sm text-success-green">
                    <Badge variant="outline" className="border-success-green text-success-green">
                      Photo Added
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button type="submit" variant="hero" disabled={isLoading}>
                  {isLoading ? 'Adding Donation...' : 'Add Donation'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Donations List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Your Donations</h2>
        {donations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No donations yet</h3>
              <p className="text-muted-foreground mb-4">
                Start making a difference by adding your first donation!
              </p>
              <Button onClick={() => setShowForm(true)} variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Donation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{donation.items}</CardTitle>
                    <Badge className={getStatusColor(donation.status)}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="capitalize">
                    {categories.find(c => c.value === donation.category)?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {donation.imageUrl && (
                    <img 
                      src={donation.imageUrl} 
                      alt="Donation" 
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="text-sm text-muted-foreground mb-4">
                    {donation.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Package className="h-4 w-4 mr-2" />
                      Quantity: {donation.quantity}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {donation.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {donation.createdAt}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardDonor;