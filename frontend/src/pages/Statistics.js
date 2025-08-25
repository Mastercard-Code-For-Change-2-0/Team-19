import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Button
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { getUserCount, getDonorRoleCount ,getReciverRoleCount,getDonationCount} from '../services/auth.service.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Statistics = () => {
  const [stats, setStats] = useState({
  
    donors: 0,
    receivers: 0,
    donations: 0,
    users: 0,
  });

  const [donorrole, setDonorrole] = useState({
    restaurant: 0,
    grocery: 0,
    hotel: 0,
    catering: 0,
    other: 0,
  });

  const [donationCount, setDonationCount] = useState(0);
  

  const [reciverrole, setReciverrole] = useState({
    ngo: 0,
    shelter: 0,
    foodbank: 0,
    charity: 0,
    other: 0,
  });
  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const data = await getUserCount();
        if (data.success) {
          setStats((prevStats) => ({
            ...prevStats,
            donors: data.data.donors,
            receivers: data.data.receivers,
            // donations: data.data.donations,

            users: data.data.donors + data.data.receivers
          }));
        }
      } catch (error) {
        console.error('Error fetching user counts:', error);
      }
    };
    fetchUserCounts();
  }, []);

  useEffect(() => {
    const fetchDonorCounts = async () => {
      try {
        const data = await getDonorRoleCount();
        if (data.success) {
          // Convert array response into object
          const donorData = data.data.reduce((acc, curr) => {
            acc[curr.type] = curr.count;
            return acc;
          }, { restaurant: 0, grocery: 0, hotel: 0, catering: 0, other: 0 });

          setDonorrole(donorData);
        }
      } catch (error) {
        console.error('Error fetching donor role counts:', error);
      }
    };
    fetchDonorCounts();
  }, []);

  useEffect(() => {
    const fetchReciverCounts = async () => {
      try {
        const data = await getReciverRoleCount();
        if (data.success) {
          // Convert array response into object
          const reciverData = data.data.reduce((acc, curr) => {
            acc[curr.type] = curr.count;
            return acc;
          }, { restaurant: 0, grocery: 0, hotel: 0, catering: 0, other: 0 });

          setReciverrole(reciverData);
        }
      } catch (error) {
        console.error('Error fetching donor role counts:', error);
      }
    };
    fetchReciverCounts();
  }, []);


  useEffect(() => {
    const fetchDonationCounts = async () => {
      try {
        const data = await getDonationCount();
        if (data.success) {
          setStats((prevStats) => ({
            ...prevStats,
      
            donations: data.data,

            
          }));
        }
      } catch (error) {
        console.error('Error fetching user counts:', error);
      }
    };
    fetchDonationCounts();
  }, []);

  const barData = {
    labels: ['Restaurant', 'Grocery', 'Hotel', 'Catering', 'Other'],
    datasets: [
      {
        label: 'Donor Distribution',
        data: [
          donorrole.restaurant || 0,
          donorrole.grocery || 0,
          donorrole.hotel || 0,
          donorrole.catering || 0,
          donorrole.other || 0,
        ],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#673AB7'],
        borderColor: '#000',
        borderWidth: 1.5,
        minBarLength: 5, // Ensures small values are visible
      },
    ],
  };
 
  const bar2Data = {
    labels: ['NGO', 'Food Bank', 'Shelter', 'Charity', 'Other'],
    datasets: [
      {
        label: 'Reciver Distribution',
        data: [
          reciverrole.ngo || 0,
          reciverrole.foodbank || 0,
          reciverrole.shelter|| 0,
          reciverrole.charity || 0,
          reciverrole.other || 0,
        ],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#673AB7'],
        borderColor: '#000',
        borderWidth: 1.5,
        minBarLength: 5, // Ensures small values are visible
      },
    ],
  };

  const pieData = {
    labels: ['Donors', 'Receivers'],
    datasets: [
      {
        label: 'User Distribution',
        data: [stats.donors, stats.receivers],
        backgroundColor: ['#FF9800', '#3F51B5'],
        borderColor: '#000',
        borderWidth: 2,
      },
    ],
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ py: 10, bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6, color: '#2196F3', fontWeight: 'bold' }}
        >
          Donation & User Statistics
        </Typography>

        <Button variant="contained" color="primary" onClick={() => navigate('/role-selection')} sx={{ mb: 2 }}>
          Back to Home
        </Button>

        <Grid container spacing={4}>
          {Object.entries(stats).map(([key, value]) => (
            <Grid item xs={6} md={3} key={key}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Donor Overview
                </Typography>
                <Bar data={barData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Reciver Overview
                </Typography>
                <Bar data={bar2Data} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  User Distribution
                </Typography>
                <Pie data={pieData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Statistics;
