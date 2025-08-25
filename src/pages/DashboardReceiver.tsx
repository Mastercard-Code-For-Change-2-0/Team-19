import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormInput from '@/components/FormInput';
import { getCurrentUser, createRequest, getRequests, getDonations, type Request, type Donation } from '@/utils/mockApi';
import { validateRequest } from '@/utils/validations';
import { useToast } from '@/hooks/use-toast';
import { Users, AlertTriangle, Plus, Search, Filter, Package, MapPin, Calendar, Clock } from 'lucide-react';

const DashboardReceiver = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    items: '',
    category: '',
    urgency: '',
    description: '',
    location: ''
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

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority - Urgent' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [donations, searchTerm, categoryFilter]);

  const loadData = async () => {
    try {
      const [allRequests, allDonations] = await Promise.all([
        getRequests(),
        getDonations()
      ]);
      
      const userRequests = allRequests.filter(r => r.receiverId === currentUser?.id);
      const availableDonations = allDonations.filter(d => d.status === 'available');
      
      setRequests(userRequests);
      setDonations(availableDonations);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    }
  };

  const filterDonations = () => {
    let filtered = donations;

    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(d => d.category === categoryFilter);
    }

    setFilteredDonations(filtered);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateRequest(formData);
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
      const request = await createRequest({
        ...formData,
        urgency: formData.urgency as 'low' | 'medium' | 'high',
        receiverId: currentUser.id,
        receiverName: currentUser.name
      });

      setRequests(prev => [request, ...prev]);
      setFormData({
        items: '',
        category: '',
        urgency: '',
        description: '',
        location: ''
      });
      setShowRequestForm(false);
      
      toast({
        title: 'Request Submitted Successfully!',
        description: 'Your request has been added and will be reviewed for matching.',
      });
    } catch (error) {
      setErrors({ general: 'Failed to create request. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-destructive text-white';
      case 'medium': return 'bg-generous-orange text-white';
      case 'low': return 'bg-success-green text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-trust-blue text-white';
      case 'matched': return 'bg-generous-orange text-white';
      case 'fulfilled': return 'bg-success-green text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-8 w-8 text-generous-orange" />
          <h1 className="text-3xl font-bold text-foreground">Receiver Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name}! Manage your requests and browse available donations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">Total requests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Donations</CardTitle>
            <Package className="h-4 w-4 text-success-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-green">
              {filteredDonations.length}
            </div>
            <p className="text-xs text-muted-foreground">Items available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched</CardTitle>
            <Users className="h-4 w-4 text-generous-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-generous-orange">
              {requests.filter(r => r.status === 'matched').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully matched</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button 
          onClick={() => setShowRequestForm(!showRequestForm)} 
          variant="warm"
          size="lg"
          className="w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          {showRequestForm ? 'Cancel Request' : 'Create New Request'}
        </Button>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Request</CardTitle>
            <CardDescription>
              Tell us what you need and we'll help find matching donations
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
                  label="Items Needed"
                  value={formData.items}
                  onChange={(value) => handleInputChange('items', value)}
                  placeholder="e.g., Winter clothing, food supplies"
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
                  id="urgency"
                  label="Urgency Level"
                  type="select"
                  value={formData.urgency}
                  onChange={(value) => handleInputChange('urgency', value)}
                  options={urgencyLevels}
                  required
                  error={errors.urgency}
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
                placeholder="Provide more details about what you need and why"
                required
                error={errors.description}
                rows={4}
              />

              <div className="flex space-x-4">
                <Button type="submit" variant="warm" disabled={isLoading}>
                  {isLoading ? 'Submitting Request...' : 'Submit Request'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Available Donations Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Browse Available Donations</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Donations Grid */}
        {filteredDonations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No donations available</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Check back later for new donations from our community.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredDonations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{donation.items}</CardTitle>
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
                    <div className="text-xs text-muted-foreground">
                      Donated by: {donation.donorName}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Your Requests Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Your Requests</h2>
        {requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No requests yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first request to get help from our community!
              </p>
              <Button onClick={() => setShowRequestForm(true)} variant="warm">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{request.items}</CardTitle>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {urgencyLevels.find(u => u.value === request.urgency)?.label}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="capitalize">
                    {categories.find(c => c.value === request.category)?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {request.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {request.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {request.createdAt}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {urgencyLevels.find(u => u.value === request.urgency)?.label}
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

export default DashboardReceiver;