import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getDonations, 
  getRequests, 
  getMatches, 
  updateMatchStatus, 
  createMatch,
  type Donation, 
  type Request, 
  type Match 
} from '@/utils/mockApi';
import { useToast } from '@/hooks/use-toast';
import { Shield, Package, Users, CheckCircle, XCircle, Link, BarChart3, Calendar } from 'lucide-react';

const DashboardAdmin = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [donationsData, requestsData, matchesData] = await Promise.all([
        getDonations(),
        getRequests(),
        getMatches()
      ]);
      
      setDonations(donationsData);
      setRequests(requestsData);
      setMatches(matchesData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    }
  };

  const handleMatchApproval = async (matchId: string, status: 'approved' | 'rejected') => {
    setIsLoading(true);
    try {
      const updatedMatch = await updateMatchStatus(matchId, status);
      if (updatedMatch) {
        setMatches(prev => prev.map(m => m.id === matchId ? updatedMatch : m));
        await loadData(); // Reload to get updated donation/request statuses
        
        toast({
          title: status === 'approved' ? 'Match Approved!' : 'Match Rejected',
          description: status === 'approved' 
            ? 'The donation and request have been successfully matched.'
            : 'The match has been rejected and items remain available.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update match status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMatch = async (donationId: string, requestId: string) => {
    setIsLoading(true);
    try {
      const newMatch = await createMatch(donationId, requestId);
      setMatches(prev => [newMatch, ...prev]);
      
      toast({
        title: 'Match Created',
        description: 'A new match has been proposed and is pending approval.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create match',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'pending': return 'bg-trust-blue text-white';
      case 'matched': return 'bg-generous-orange text-white';
      case 'delivered':
      case 'fulfilled':
      case 'approved': return 'bg-success-green text-white';
      case 'rejected': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
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

  const getMatchedDonation = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    return match ? donations.find(d => d.id === match.donationId) : null;
  };

  const getMatchedRequest = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    return match ? requests.find(r => r.id === match.requestId) : null;
  };

  const stats = {
    totalDonations: donations.length,
    totalRequests: requests.length,
    pendingMatches: matches.filter(m => m.status === 'pending').length,
    approvedMatches: matches.filter(m => m.status === 'approved').length,
    availableDonations: donations.filter(d => d.status === 'available').length,
    pendingRequests: requests.filter(r => r.status === 'pending').length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-8 w-8 text-success-green" />
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Manage donations, requests, and approve matches across the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableDonations} available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingRequests} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Matches</CardTitle>
            <Link className="h-4 w-4 text-generous-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-generous-orange">
              {stats.pendingMatches}
            </div>
            <p className="text-xs text-muted-foreground">Need approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Matches</CardTitle>
            <CheckCircle className="h-4 w-4 text-success-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-green">
              {stats.approvedMatches}
            </div>
            <p className="text-xs text-muted-foreground">Successfully matched</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matches">Pending Matches</TabsTrigger>
          <TabsTrigger value="donations">All Donations</TabsTrigger>
          <TabsTrigger value="requests">All Requests</TabsTrigger>
        </TabsList>

        {/* Pending Matches Tab */}
        <TabsContent value="matches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Matches - Approval Required</CardTitle>
              <CardDescription>
                Review and approve or reject donation matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matches.filter(m => m.status === 'pending').length === 0 ? (
                <div className="text-center py-12">
                  <Link className="h-12 w-12 text-muted-foreground mx-auto mb-4 block" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No pending matches</h3>
                  <p className="text-muted-foreground">
                    All matches have been reviewed. New matches will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.filter(m => m.status === 'pending').map((match) => {
                    const donation = getMatchedDonation(match.id);
                    const request = getMatchedRequest(match.id);
                    
                    return (
                      <Card key={match.id} className="border-l-4 border-l-generous-orange">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Donation Details */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                                <Package className="h-4 w-4 mr-2 text-trust-blue" />
                                Donation Details
                              </h4>
                              {donation && (
                                <div className="space-y-2 text-sm">
                                  <p><strong>Items:</strong> {donation.items}</p>
                                  <p><strong>Donor:</strong> {donation.donorName}</p>
                                  <p><strong>Quantity:</strong> {donation.quantity}</p>
                                  <p><strong>Location:</strong> {donation.location}</p>
                                  <p><strong>Description:</strong> {donation.description}</p>
                                </div>
                              )}
                            </div>

                            {/* Request Details */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                                <Users className="h-4 w-4 mr-2 text-generous-orange" />
                                Request Details
                              </h4>
                              {request && (
                                <div className="space-y-2 text-sm">
                                  <p><strong>Items Needed:</strong> {request.items}</p>
                                  <p><strong>Receiver:</strong> {request.receiverName}</p>
                                  <p className="flex items-center">
                                    <strong>Urgency:</strong>
                                    <Badge className={`ml-2 ${getUrgencyColor(request.urgency)}`}>
                                      {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                                    </Badge>
                                  </p>
                                  <p><strong>Location:</strong> {request.location}</p>
                                  <p><strong>Description:</strong> {request.description}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              Match created: {new Date(match.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMatchApproval(match.id, 'rejected')}
                                disabled={isLoading}
                                className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleMatchApproval(match.id, 'approved')}
                                disabled={isLoading}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Match
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Donations Tab */}
        <TabsContent value="donations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Donations</CardTitle>
              <CardDescription>
                Overview of all donations in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Items</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{donation.items}</TableCell>
                      <TableCell>{donation.donorName}</TableCell>
                      <TableCell className="capitalize">{donation.category}</TableCell>
                      <TableCell>{donation.quantity}</TableCell>
                      <TableCell>{donation.location}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(donation.status)}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{donation.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Requests</CardTitle>
              <CardDescription>
                Overview of all requests in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Items Needed</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.items}</TableCell>
                      <TableCell>{request.receiverName}</TableCell>
                      <TableCell className="capitalize">{request.category}</TableCell>
                      <TableCell>
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAdmin;