import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, Button, Chip, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField
} from '@mui/material';
import { getAvailableDonations, acceptDonation } from '../../services/donation.service';
import { geocodeLocation } from '../../services/geocoding.service'; 
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash'; // Import debounce for efficient location updates

const AvailableDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    fetchDonations();
  }, [latitude, longitude]); // Re-fetch donations when location changes

  useEffect(() => {
    if (!useManualLocation) {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {
          setError('Unable to retrieve location. Please allow location access or enter it manually.');
          setUseManualLocation(true);
        }
      );
    }
  }, [useManualLocation]); 

  const fetchDonations = async () => {
    if (!latitude || !longitude) {
      console.error("Location coordinates not available");
      return;
    }
  
    console.log("Fetching donations for:", { latitude, longitude });
  
    try {
      setLoading(true);
      const data = await getAvailableDonations({
        latitude: Number(user.latitude) , 
        longitude: Number(user.longitude) ,
        maxDistance: 10, // Ensure the backend is set up to filter correctly
      });
  
      console.log("Received donations:", data);
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("Failed to fetch available donations");
    } finally {
      setLoading(false);
    }
  };

  const handleManualLocationChange = debounce(async (value) => {
    setManualLocation(value);
    console.log("Manual location converted to:", { latitude: lat, longitude: lng });

    if (value.trim()) {
      try {
        const { latitude: lat, longitude: lng } = await geocodeLocation(value);
        setLatitude(lat);
        setLongitude(lng);
      } catch {
        setError('Invalid location. Try again.');
      }
    }
  }, 500); // Debounce input to avoid unnecessary API calls

  const handleAcceptClick = (donation) => {
    setSelectedDonation(donation);
    setDialogOpen(true);
  };

  const handleAcceptConfirm = async () => {
    setAcceptLoading(true);
    try {
      await acceptDonation(selectedDonation._id);
      setDialogOpen(false);
      fetchDonations();
    } catch {
      setError('Failed to accept donation');
    } finally {
      setAcceptLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Donations
      </Typography>

      {/* Manual Location Input */}
      {useManualLocation && (
        <Box sx={{ my: 2 }}>
          <Alert severity="info">Enter your location manually to find nearby donations.</Alert>
          <TextField
            label="Enter City or Address"
            variant="outlined"
            fullWidth
            value={manualLocation}
            onChange={(e) => handleManualLocationChange(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>
      )}

      <Button variant="contained" color="primary" onClick={() => navigate('/donor/dashboard')} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>

      {/* Donations List */}
      <Grid container spacing={3}>
        {donations.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">No available donations at the moment.</Alert>
          </Grid>
        ) : (
          donations.map((donation) => (
            <Grid item xs={12} key={donation._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>{donation.foodType}</Typography>
                      <Typography color="textSecondary">Quantity: {donation.quantity}</Typography>
                      <Typography color="textSecondary">Pickup Location: {donation.pickupLocation}</Typography>
                      {donation.additionalNotes && <Typography color="textSecondary">Notes: {donation.additionalNotes}</Typography>}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Chip label="Available" color="success" />
                      <Button variant="contained" color="primary" onClick={() => handleAcceptClick(donation)}>
                        Accept Donation
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">Donor: {donation.donor?.name || 'Anonymous'}</Typography>
                    <Typography variant="body2" color="textSecondary">Expires: {new Date(donation.expiryDate).toLocaleDateString()}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Accept Donation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Accept Donation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to accept this donation? You will be responsible for picking it up.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={acceptLoading}>Cancel</Button>
          <Button onClick={handleAcceptConfirm} color="primary" variant="contained" disabled={acceptLoading}>
            {acceptLoading ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AvailableDonations;
