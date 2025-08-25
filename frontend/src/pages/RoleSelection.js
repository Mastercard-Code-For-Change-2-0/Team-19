import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  IconButton,
  Stack,
  CheckCircleIcon
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';

const RoleSelection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const roles = [
    {
      role: 'donor',
      title: 'Food Donor',
      description: 'Share your surplus food with those in need. Join us in reducing food waste and making a difference.',
      icon: <RestaurantIcon sx={{ fontSize: 60, color: '#2ECC71' }} />,
      color: '#2ECC71',
      bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderColor: '#2ECC71'
    },
    {
      role: 'receiver',
      title: 'Food Receiver',
      description: 'Connect with food donors and access surplus food resources for your community.',
      icon: <GroupsIcon sx={{ fontSize: 60, color: '#FF6B2C' }} />,
      color: '#FF6B2C',
      bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderColor: '#FF6B2C'
    }
  ];

  const impactPoints = [
    {
      icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Connection',
      description: 'Simple platform connecting donors with receivers'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Updates',
      description: 'Track donations and delivery status instantly'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: 'Community Impact',
      description: 'Make a difference in your local community'
    }
  ];

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '70vh',
          background: '#fff',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={showContent} timeout={1000}>
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      color: '#2C3E50',
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      background: 'linear-gradient(135deg, #FF6B2C 0%, #FF8F50 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    MealBridge
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#666',
                      mb: 4,
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 500,
                      lineHeight: 1.4
                    }}
                  >
                    Bridging the gap with surplus food
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={scrollToContent}
                    sx={{
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, #FF6B2C 0%, #FF8F50 100%)',
                      boxShadow: '0 4px 20px rgba(255, 107, 44, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF8F50 0%, #FF6B2C 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(255, 107, 44, 0.4)'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                  
                </Box>
                
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: '300px', md: '500px' },
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                  borderRadius: { xs: '30px', md: '50px' },
                  p: 4,
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
              >
                {/* Background Circles */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-20%',
                    width: '60%',
                    height: '60%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255, 44, 213, 0.35) 0%, rgba(255, 144, 80, 0.26) 100%)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '40%',
                    height: '40%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%)',
                  }}
                />

                {/* Main Content */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                  }}
                >
                  {/* Food Donor Icon */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      borderRadius: '30px',
                      background: 'white',
                      boxShadow: '0 10px 30px rgba(255, 107, 44, 0.2)',
                      transform: 'translateX(-20px)',
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    <RestaurantIcon 
                      sx={{ 
                        fontSize: { xs: '3rem', md: '4rem' },
                        color: '#FF6B2C'
                      }} 
                    />
                  </Box>

                  {/* Connection Line */}
                  <Box
                    sx={{
                      width: '4px',
                      height: '60px',
                      background: 'linear-gradient(to bottom, #FF6B2C, #2ECC71)',
                      borderRadius: '4px'
                    }}
                  />

                  {/* Food Receiver Icon */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      borderRadius: '30px',
                      background: 'white',
                      boxShadow: '0 10px 30px rgba(46, 204, 113, 0.2)',
                      transform: 'translateX(20px)',
                      animation: 'float 3s ease-in-out infinite',
                      animationDelay: '1.5s'
                    }}
                  >
                    <GroupsIcon 
                      sx={{ 
                        fontSize: { xs: '3rem', md: '4rem' },
                        color: '#2ECC71'
                      }} 
                    />
                    
                  </Box>
                  <Button
  variant="contained"
  onClick={() => navigate('/statistics')}
  sx={{
    mb: 2,
    px: 4,
    py: 1.5,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(33, 203, 243, 0.5)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
      boxShadow: '0px 6px 15px rgba(33, 150, 243, 0.6)',
      transform: 'scale(1.05)',
    },
  }}
>
  View Statistics
</Button>

                </Box>

                {/* Floating Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '20%',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#FF6B2C',
                    opacity: 0.5,
                    animation: 'float 4s ease-in-out infinite'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '30%',
                    right: '25%',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#2ECC71',
                    opacity: 0.5,
                    animation: 'float 4s ease-in-out infinite',
                    animationDelay: '2s'
                  }}
                />
              </Box>

              {/* Add floating animation keyframes */}
              <Box
                sx={{
                  '@keyframes float': {
                    '0%': {
                      transform: 'translateY(0px)'
                    },
                    '50%': {
                      transform: 'translateY(-10px)'
                    },
                    '100%': {
                      transform: 'translateY(0px)'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Role Selection Section */}
      <Box
        sx={{
          py: 10,
          px: 3,
          background: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 6,
              color: '#2C3E50',
              fontSize: { xs: '2.5rem', md: '3rem' }
            }}
          >
            Choose Your Role
          </Typography>

          <Grid container spacing={6} justifyContent="center">
            {roles.map((role) => (
              <Grid item xs={12} md={6} key={role.role}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    minHeight: '600px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${role.borderColor}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: role.bgGradient,
                      zIndex: 0
                    }}
                  />
                  <CardContent 
                    sx={{ 
                      position: 'relative',
                      zIndex: 1,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      p: { xs: 4, md: 6 },
                      '&:last-child': { 
                        pb: { xs: 4, md: 6 } 
                      }
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box 
                        sx={{
                          transform: 'scale(1.5)',
                          mb: 4,
                          mt: 2,
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        {role.icon}
                      </Box>
                      <Typography 
                        variant="h3" 
                        align="center"
                        sx={{ 
                          mb: 3,
                          fontWeight: 700,
                          fontSize: { xs: '2rem', md: '2.5rem' },
                          color: '#2C3E50'
                        }}
                      >
                        {role.title}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        align="center"
                        sx={{ 
                          mb: 4,
                          lineHeight: 1.6,
                          fontSize: { xs: '1.1rem', md: '1.25rem' },
                          color: '#666666'
                        }}
                      >
                        {role.description}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 'auto', pt: 4 }}>
                      <Stack spacing={3}>
                        <Button
                          fullWidth
                          size="large"
                          variant="contained"
                          onClick={() => navigate(`/register?role=${role.role}`)}
                          sx={{
                            bgcolor: role.color,
                            color: 'white',
                            py: 2,
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            '&:hover': {
                              bgcolor: role.color,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 6px 20px ${role.color}40`
                            }
                          }}
                        >
                          Register as {role.title}
                        </Button>
                        <Button
                          fullWidth
                          size="large"
                          variant="outlined"
                          onClick={() => navigate(`/login?role=${role.role}`)}
                          sx={{
                            borderColor: role.color,
                            borderWidth: 2,
                            color: role.color,
                            py: 2,
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: role.color,
                              borderWidth: 2,
                              bgcolor: `${role.color}10`,
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          Login as {role.title}
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>



      {/* Impact Section */}
      <Box
        sx={{
          py: 8,
          background: '#F8F9FA'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 6,
              color: '#2C3E50'
            }}
          >
            Why Choose MealBridge?
          </Typography>

          <Grid container spacing={4}>
            {impactPoints.map((point, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      color: '#FF6B2C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255, 107, 44, 0.1)'
                    }}
                  >
                    {point.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ color: '#2C3E50', fontWeight: 600 }}>
                    {point.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {point.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-20px);
            }
            60% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default RoleSelection;
