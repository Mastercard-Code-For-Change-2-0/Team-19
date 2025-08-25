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
import { getDonorDonations } from '../../services/donation.service';
import { useNavigate } from 'react-router-dom';


const DonationStats = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonations: 0,
    acceptedDonations: 0,
    expiredDonations: 0,
    totalMeals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const navigate = useNavigate();

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = async () => {
    try {
      const donations = await getDonorDonations();
      
      const stats = {
        totalDonations: donations.length,
        activeDonations: donations.filter(d => d.status === 'pending').length,
        acceptedDonations: donations.filter(d => d.status === 'accepted').length,
        expiredDonations: donations.filter(d => d.status === 'expired').length,
        totalMeals: donations.reduce((sum, d) => sum + (parseInt(d.mealCount) || 0), 0)
      };

      setStats(stats);
    } catch (err) {
      setError('Failed to fetch donation statistics');
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
        Your Impact Statistics
      </Typography>
       {/* Back Button */}
           <Button variant="contained" color="primary" onClick={() => navigate('/donor/dashboard')} sx={{ mb: 2 }}>
             Back to Dashboard
           </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#E8F5E9' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Donations
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.totalDonations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#E3F2FD' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Donations
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.activeDonations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#FFF3E0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Accepted Donations
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.acceptedDonations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ bgcolor: '#F3E5F5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Meals Donated
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.totalMeals}+
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Estimated number of meals provided
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ bgcolor: '#FFEBEE' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expired Donations
              </Typography>
              <Typography variant="h3" color="error">
                {stats.expiredDonations}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Donations that expired before being accepted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DonationStats;
