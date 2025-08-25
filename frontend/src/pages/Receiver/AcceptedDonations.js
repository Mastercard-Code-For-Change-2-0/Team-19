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
import { getAcceptedDonations } from '../../services/donation.service';
import{useNavigate} from 'react-router-dom';

const AcceptedDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getAcceptedDonations();
      setDonations(data);
    } catch (err) {
      setError('Failed to fetch accepted donations');
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
        Accepted Donations
      </Typography>

      {/* Back Button */}
      <Button variant="contained" color="primary" onClick={() => navigate('/donor/dashboard')} sx={{ mb: 2 }}>
             Back to Dashboard
           </Button>

      <Grid container spacing={3}>
        {donations.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">You haven't accepted any donations yet.</Alert>
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
                      label="Accepted" 
                      color="primary"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Donor: {donation.donor?.name || 'Anonymous'}
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

export default AcceptedDonations;
