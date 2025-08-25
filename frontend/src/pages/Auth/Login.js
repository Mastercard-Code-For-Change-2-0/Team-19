import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { login } from '../../services/auth.service';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const roleFromUrl = searchParams.get('role');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: roleFromUrl || ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Redirect based on the user's actual role from the response
        const dashboardPath = response.user.role === 'donor' ? '/donor/dashboard' : '/receiver/dashboard';
        navigate(dashboardPath);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const roleColor = formData.role === 'donor' ? '#4CAF50' : '#2196F3';
  const bgGradient = formData.role === 'donor' 
    ? 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)';

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)',
        py: { xs: 4, md: 8 },
        px: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Container component="div" maxWidth="sm" sx={{ position: 'relative' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Back to Home
        </Button>

        <Paper 
          elevation={0}
          component="section"
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }}
        >
          <Box
            component="header"
            sx={{
              background: bgGradient,
              py: 4,
              px: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" component="h1" color="white" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="subtitle1" component="p" color="white" sx={{ opacity: 0.9 }}>
              Login as {formData.role === 'donor' ? 'Food Donor' : 'Food Receiver'}
            </Typography>
          </Box>

          <Box component="div" sx={{ p: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: roleColor }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: roleColor,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: roleColor,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: roleColor }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: roleColor,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: roleColor,
                  },
                }}
              />

              <Box sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    bgcolor: roleColor,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: roleColor,
                      filter: 'brightness(0.9)'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Login'
                  )}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Button
                  color="primary"
                  onClick={() => navigate(`/register?role=${formData.role}`)}
                  sx={{ 
                    color: roleColor,
                    '&:hover': {
                      bgcolor: `${roleColor}10`
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
