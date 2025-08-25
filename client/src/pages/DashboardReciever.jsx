import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser, createRequest, getRequests, getDonations } from '@/utils/mockApi';
import { validateRequest } from '@/utils/validations';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Search, Filter, Package, MapPin, Calendar } from 'lucide-react';

const DashboardReceiver = () => {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // Receiver selects an item from donor
  const handleSelectDonation = async (donation) => {
    if (!currentUser) return;
    setIsLoading(true);

    try {
      const request = await createRequest({
        items: donation.items,
        category: donation.category,
        urgency: 'medium', // default urgency
        description: donation.description,
        location: donation.location,
        receiverId: currentUser.id,
        receiverName: currentUser.name,
        donorId: donation.donorId,
        donorName: donation.donorName,
      });

      setRequests(prev => [request, ...prev]);

      toast({
        title: 'Request Sent',
        description: `You requested "${donation.items}" from ${donation.donorName}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send request',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Receiver Dashboard</h1>
        <Badge variant="secondary">
          <Users className="h-4 w-4 mr-1" /> Welcome, {currentUser?.name}
        </Badge>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2 w-full">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search donations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Available Donations (Donor list) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Donations</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDonations.map(donation => (
            <Card key={donation.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{donation.items}</CardTitle>
                <CardDescription>{donation.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{donation.description}</p>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <MapPin className="h-4 w-4" /> {donation.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Calendar className="h-4 w-4" /> {donation.date}
                </div>
                <p className="text-xs text-muted-foreground">
                  Donor: <span className="font-medium">{donation.donorName}</span>
                </p>

                <Button
                  className="w-full mt-2"
                  onClick={() => handleSelectDonation(donation)}
                  disabled={isLoading}
                >
                  <Package className="h-4 w-4 mr-1" />
                  Request This Item
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Your Requests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Requests</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map(req => (
            <Card key={req.id}>
              <CardHeader>
                <CardTitle>{req.items}</CardTitle>
                <CardDescription>Status: {req.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{req.description}</p>
                <p className="text-xs text-muted-foreground">Urgency: {req.urgency}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardReceiver;

