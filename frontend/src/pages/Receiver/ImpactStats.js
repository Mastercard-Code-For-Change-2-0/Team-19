import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { getAcceptedDonations } from '../../services/donation.service';
import{useNavigate} from 'react-router-dom';

const ImpactStats = () => {
  const [stats, setStats] = useState({
    totalAccepted: 0,
    totalMeals: 0,
    uniqueDonors: 0,
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = async () => {
    try {
      const donations = await getAcceptedDonations();
      
      const uniqueDonorIds = new Set(donations.map(d => d.donor?._id));
      const totalMeals = donations.reduce((sum, d) => sum + (parseInt(d.mealCount) || 0), 0);
      
      setStats({
        totalAccepted: donations.length,
        totalMeals,
        uniqueDonors: uniqueDonorIds.size,
        recentDonations: donations.slice(0, 5)
      });
    } catch (err) {
      setError('Failed to fetch impact statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Impact
      </Typography>

        {/* Back Button */}
                 <Button variant="contained" color="primary" onClick={() => navigate('/donor/dashboard')} sx={{ mb: 2 }}>
                   Back to Dashboard
                 </Button>


      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#E3F2FD' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Donations Accepted
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.totalAccepted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#E8F5E9' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Meals Received
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.totalMeals}+
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Estimated number of meals
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#FFF3E0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Unique Donors
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.uniqueDonors}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Different donors you've worked with
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Recent Donations
          </Typography>
          {stats.recentDonations.map((donation, index) => (
            <Card key={donation._id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">
                      {donation.foodType}
                    </Typography>
                    <Typography color="textSecondary">
                      From: {donation.donor?.name || 'Anonymous'}
                    </Typography>
                  </Box>
                  <Typography color="textSecondary">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ImpactStats;
