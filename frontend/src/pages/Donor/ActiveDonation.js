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
  accepted: 'success'
};

const ActiveDonations = () => {
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
      const activeDonations = (data || []).filter((donation) => {
        const isActive = (donation.status === 'pending');
        const isNotExpired = new Date(donation.expiryDate) > new Date();
        return isActive && isNotExpired;
      });
      setDonations(activeDonations);
    } catch (err) {
      setError('Failed to fetch active donations');
    } finally {
      setLoading(false);
    }
  };

  const alternatives = {
    "Cooked Food": [
      "♻️ Turn into compost for soil enrichment.",
      "🌿 Feed to livestock if safe."
    ],
    "Raw Ingredients": [
      "🧊 Freeze for later use.",
      "🍲 Use scraps for homemade broths."
    ],
    "Packaged Foods": [
      "📦 Reuse or recycle packaging.",
      "♻️ Convert into eco-bricks if plastic-based."
    ],
    "Beverages": [
      "💦 Use leftover liquid for plant watering (if suitable).",
      "♻️ Recycle glass or plastic bottles."
    ],
    "Fruits and Vegetables": [
      "🍌 Make jams, smoothies, or dried snacks.",
      "🌱 Compost peels and scraps."
    ],
    "Bakery Items": [
      "🥖 Convert stale bread into breadcrumbs.",
      "🧁 Use leftovers for new recipes (pudding, toast)."
    ],
    "Other": [
      "🔄 Repurpose creatively or recycle.",
      "⚠️ Dispose responsibly following eco-guidelines."
    ]
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
        Active Donations
      </Typography>

      <Grid container spacing={3}>
        {donations.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">No active donations found.</Alert>
          </Grid>
        ) : (
          donations.map((donation) => (
            <Grid item xs={12} key={donation._id}>
              {/* <Card>
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
              </Card> */}


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

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="body2" color="textSecondary">
        Created: {new Date(donation.createdAt).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Expires: {new Date(donation.expiryDate).toLocaleDateString()}
      </Typography>
    </Box>

    {/* Alternative Options Section */}
    <Box sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
      <Typography variant="subtitle2" color="primary">
        Alternative Options:
      </Typography>
      <ul style={{ paddingLeft: '16px', marginTop: '8px', color: '#555' }}>
        {alternatives[donation.foodType]?.map((point, index) => (
          <li key={index}>
            <Typography variant="body2">{point}</Typography>
          </li>
        )) || (
          <li>
            <Typography variant="body2">Consider eco-friendly disposal or repurposing.</Typography>
          </li>
        )}
      </ul>
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

export default ActiveDonations;