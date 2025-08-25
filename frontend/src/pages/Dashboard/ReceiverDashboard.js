import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  FastfoodOutlined as FoodIcon,
  CheckCircleOutline as AcceptedIcon,
  SearchOutlined as SearchIcon,
  BarChartOutlined as StatsIcon,
  ExitToApp as LogoutIcon,
  NotificationsOutlined as NotificationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';
import { getAcceptedDonations } from '../../services/donation.service';

const ReceiverDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = JSON.parse(localStorage.getItem('user'));

  const [stats, setStats] = useState({
    acceptedDonations: 0,
    availableDonations: 0,
    totalMeals: 0,
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const donations = await getAcceptedDonations();
      const totalMeals = donations.reduce((acc, curr) => acc + (curr.mealCount || 0), 0);

      setStats({
        acceptedDonations: donations.length,
        totalMeals,
        recentDonations: donations.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const quickActions = [
    {
      title: 'Available Donations',
      icon: <SearchIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      action: () => navigate('/receiver/available'),
      color: '#E8F5E9',
      ariaLabel: 'View available donations'
    },
    {
      title: 'Accepted Donations',
      icon: <AcceptedIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
      action: () => navigate('/receiver/accepted'),
      color: '#E3F2FD',
      ariaLabel: 'View accepted donations'
    },
    {
      title: 'Impact Stats',
      icon: <StatsIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      action: () => navigate('/receiver/stats'),
      color: '#FFF3E0',
      ariaLabel: 'View impact statistics'
    }
  ];

  if (loading) {
    return (
      <Box 
        component="main"
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
        role="main"
        aria-label="Loading dashboard"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      component="main"
      sx={{ 
        bgcolor: '#F5F5F5', 
        minHeight: '100vh' 
      }}
      role="main"
    >
      {/* Header */}
      <Box 
        component="header"
        sx={{ 
          bgcolor: 'white', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          mb: 3
        }}
      >
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#2196F3',
                  width: 50,
                  height: 50
                }}
                alt={user?.name || 'User'}
              >
                {user?.name?.charAt(0) || 'R'}
              </Avatar>
              <Box>
                <Typography variant="h6" component="h1">
                  Welcome back, {user?.name || 'Receiver'}!
                </Typography>
                <Typography variant="body2" color="text.secondary" component="p">
                  {user?.organizationType?.charAt(0).toUpperCase() + user?.organizationType?.slice(1) || 'Food Receiver'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton aria-label="Notifications">
                <NotificationIcon />
              </IconButton>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Stats Cards */}
        <Grid 
          container 
          spacing={3} 
          sx={{ mb: 4 }}
          component="section"
          aria-label="Donation Statistics"
        >
          <Grid item xs={12} sm={6} md={4}>
            <Card className="hover-scale shadow-soft">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#E8F5E9' }} aria-hidden="true">
                    <FoodIcon sx={{ color: '#4CAF50' }} />
                  </Avatar>
                  <Typography color="textSecondary" component="h2">
                    Accepted Donations
                  </Typography>
                </Box>
                <Typography variant="h4" component="p">
                  {stats.acceptedDonations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className="hover-scale shadow-soft">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#E3F2FD' }} aria-hidden="true">
                    <StatsIcon sx={{ color: '#2196F3' }} />
                  </Avatar>
                  <Typography color="textSecondary" component="h2">
                    Total Meals
                  </Typography>
                </Box>
                <Typography variant="h4" component="p">
                  {stats.totalMeals}+
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid 
          container 
          spacing={3}
          component="section"
          aria-label="Quick actions"
        >
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                className="hover-scale shadow-soft" 
                sx={{ cursor: 'pointer' }}
                onClick={action.action}
                role="button"
                aria-label={action.ariaLabel}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    action.action();
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ bgcolor: action.color, width: 56, height: 56 }}
                      aria-hidden="true"
                    >
                      {action.icon}
                    </Avatar>
                    <Typography variant="h6" align="center" component="span">
                      {action.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ReceiverDashboard;
