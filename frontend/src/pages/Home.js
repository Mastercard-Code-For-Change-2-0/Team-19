import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Slide 
} from '@mui/material';
import { 
  RestaurantOutlined as RestaurantIcon,
  VolunteerActivismOutlined as DonateIcon,
  AccessTimeOutlined as TimeIcon,
  LocalShippingOutlined as DeliveryIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const features = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Fresh Food',
      description: 'Connect with local restaurants and food providers to receive fresh, quality food donations.'
    },
    {
      icon: <DonateIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Donations',
      description: 'Simple and efficient process for donors to contribute excess food to those in need.'
    },
    {
      icon: <TimeIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Updates',
      description: 'Track donations and pickups in real-time with our advanced notification system.'
    },
    {
      icon: <DeliveryIcon sx={{ fontSize: 40 }} />,
      title: 'Quick Delivery',
      description: 'Streamlined pickup and delivery process to ensure food reaches recipients promptly.'
    }
  ];

  const stats = [
    { value: '1000+', label: 'Meals Shared' },
    { value: '50+', label: 'Active Donors' },
    { value: '30+', label: 'Partner Organizations' },
    { value: '500+', label: 'People Helped' }
  ];

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        <Fade in={showContent} timeout={1000}>
          <Container maxWidth="lg">
            <Typography 
              variant={isMobile ? 'h3' : 'h1'} 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Bridging the Gap Between
              <br />
              Excess and Need
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mb: 5,
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Join our mission to reduce food waste and create a sustainable future.
              Connect with local organizations and make a real difference in your community.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/role-selection')}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 30,
                  textTransform: 'none',
                  bgcolor: 'white',
                  color: '#4CAF50',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/about')}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 30,
                  textTransform: 'none',
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          </Container>
        </Fade>
        <IconButton
          onClick={scrollToContent}
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            animation: 'bounce 2s infinite'
          }}
        >
          <ArrowDownIcon />
        </IconButton>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Slide in={showContent} direction="up" timeout={1000}>
            <Box>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center" 
                gutterBottom
                sx={{ 
                  mb: 6,
                  color: '#2196F3',
                  fontWeight: 'bold'
                }}
              >
                How It Works
              </Typography>
              <Grid container spacing={4}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        textAlign: 'center',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'translateY(-10px)'
                        }
                      }}
                    >
                      <CardContent>
                        <Box 
                          sx={{ 
                            mb: 2,
                            color: '#4CAF50',
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          gutterBottom
                          sx={{ fontWeight: 'bold' }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box 
        sx={{ 
          py: 8,
          background: 'linear-gradient(135deg, #2196F3 0%, #4CAF50 100%)',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h3" 
                    component="p"
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" component="p">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: '#2196F3'
            }}
          >
            Ready to Make a Difference?
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              mb: 4,
              color: 'text.secondary'
            }}
          >
            Join MealBridge today and be part of the solution to reduce food waste
            while helping those in need in your community.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/role-selection')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              borderRadius: 30,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #4CAF50 30%, #2196F3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #45a049 30%, #1e88e5 90%)'
              }
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* Add custom keyframes for bounce animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0) translateX(-50%);
            }
            40% {
              transform: translateY(-20px) translateX(-50%);
            }
            60% {
              transform: translateY(-10px) translateX(-50%);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Home;
