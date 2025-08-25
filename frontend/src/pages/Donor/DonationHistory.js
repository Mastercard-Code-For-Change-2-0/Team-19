import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDonorDonations } from '../../services/donation.service';

const statusColors = {
  pending: 'warning',
  accepted: 'success',
  completed: 'info',
  expired: 'error'
};

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getDonorDonations();
      setDonations(data);
    } catch (err) {
      setError('Failed to fetch donation history');
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
      {/* Back Button */}
      <Button variant="contained" color="primary" onClick={() => navigate('/donor/dashboard')} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Donation History
      </Typography>

      <Grid container spacing={3}>
        {donations.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">No donations found in your history.</Alert>
          </Grid>
        ) : (
          donations.map((donation) => (
            <Grid item xs={12} key={donation._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {donation.foodType}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        Quantity: {donation.quantity}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        Pickup Location: {donation.pickupLocation}
                      </Typography>
                      {donation.additionalNotes && (
                        <Typography color="textSecondary">
                          Notes: {donation.additionalNotes}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      color={statusColors[donation.status]}
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Created: {new Date(donation.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Expires: {new Date(donation.expiryDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default DonationHistory;
