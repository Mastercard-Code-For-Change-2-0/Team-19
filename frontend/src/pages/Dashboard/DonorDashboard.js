import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  FastfoodOutlined as FoodIcon,
  AccessTimeOutlined as PendingIcon,
  CheckCircleOutline as CompletedIcon,
  AddCircleOutline as AddIcon,
  HistoryOutlined as HistoryIcon,
  BarChartOutlined as StatsIcon,
  BarChartOutlined as ActiveIcon, 
  ExitToApp as LogoutIcon,
  NotificationsOutlined as NotificationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';
import { getDonorDonations } from '../../services/donation.service';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = JSON.parse(localStorage.getItem('user'));

  const [stats, setStats] = useState({
    activeDonations: 0,
    totalDonations: 0,
    pendingRequests: 0,
    impactMade: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonationStats();
  }, []);

  const fetchDonationStats = async () => {
    try {
      const donations = await getDonorDonations();
      const activeDonations = donations.filter(d => d.status === 'active').length;
      const pendingRequests = donations.filter(d => d.status === 'pending').length;
      const totalMeals = donations.reduce((acc, curr) => acc + (curr.mealCount || 0), 0);

      setStats({
        activeDonations,
        totalDonations: donations.length,
        pendingRequests,
        impactMade: `${totalMeals}+ meals`
      });
    } catch (error) {
      console.error('Error fetching donation stats:', error);
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
      title: 'New Donation',
      icon: <AddIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      action: () => navigate('/donor/new-donation'),
      color: '#E8F5E9',
      ariaLabel: 'Create a new donation'
    },
    {
      title: 'Donation History',
      icon: <HistoryIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
      action: () => navigate('/donor/history'),
      color: '#E3F2FD',
      ariaLabel: 'View donation history'
    },
    {
      title: 'Impact Stats',
      icon: <StatsIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      action: () => navigate('/donor/stats'),
      color: '#FFF3E0',
      ariaLabel: 'View impact statistics'
    },
    {
      title: 'Active Donations',
      icon: <ActiveIcon sx={{ fontSize: 40, color: '#9C27B0' }} />,
      action: () => navigate('/donor/active'),
      color: '#F3E5F5',
      ariaLabel: 'View active donations'
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
                  bgcolor: '#4CAF50',
                  width: 50,
                  height: 50
                }}
                alt={user?.name || 'User'}
              >
                {user?.name?.charAt(0) || 'D'}
              </Avatar>
              <Box>
                <Typography variant="h6" component="h1">
                  Welcome back, {user?.name || 'Donor'}!
                </Typography>
                <Typography variant="body2" color="text.secondary" component="p">
                  {user?.organizationType?.charAt(0).toUpperCase() + user?.organizationType?.slice(1) || 'Food Donor'}
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
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover-scale shadow-soft">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#E8F5E9' }} aria-hidden="true">
                    <FoodIcon sx={{ color: '#4CAF50' }} />
                  </Avatar>
                  <Typography color="textSecondary" component="h2">
                    Active Donations
                  </Typography>
                </Box>
                <Typography variant="h4" component="p">
                  {stats.activeDonations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover-scale shadow-soft">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#E3F2FD' }} aria-hidden="true">
                    <CompletedIcon sx={{ color: '#2196F3' }} />
                  </Avatar>
                  <Typography color="textSecondary" component="h2">
                    Total Donations
                  </Typography>
                </Box>
                <Typography variant="h4" component="p">
                  {stats.totalDonations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover-scale shadow-soft">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#FFF3E0' }} aria-hidden="true">
                    <PendingIcon sx={{ color: '#FF9800' }} />
                  </Avatar>
                  <Typography color="textSecondary" component="h2">
                    Pending Requests
                  </Typography>
                </Box>
                <Typography variant="h4" component="p">
                  {stats.pendingRequests}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover-scale shadow-soft">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#F3E5F5' }} aria-hidden="true">
                    <StatsIcon sx={{ color: '#9C27B0' }} />
                  </Avatar>
                  <Typography color="textSecondary" component="h2">
                    Impact Made
                  </Typography>
                </Box>
                <Typography variant="h4" component="p">
                  {stats.impactMade}
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
            <Grid item xs={12} sm={6} md={3} key={index}>
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

        {/* Recent Donations */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Recent Donations
          </Typography>
          <Card className="shadow-soft">
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                Loading recent donations...
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default DonorDashboard;
