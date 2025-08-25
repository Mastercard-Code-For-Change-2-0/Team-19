import React, { useState,useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { register } from '../../services/auth.service';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role');
  const [address,setAddress] = useState([]);
  const [fatlat,setFlat]= useState("");
  const [falong,setFlong]= useState("");
  const [latitude,setLatitude] = useState(null);
  const [longitude,setLongitude] = useState(null);
  const API_KEY = "94675ddfc9344fd8bfc94aff3e6b01bb";
  const API_END_POINT = `https://api.opencagedata.com/geocode/v1/json`;
  let myCity = "";

  useEffect(() => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
            },
            (err) => {
                setError('Failed to fetch geolocation. Please allow location access.');
            }
        );
    } else {
        setError('Geolocation is not supported by this browser.');
    }
}, []);

const getUserCurrentLocation = async (latitude, longitude) => {
  let query = `${latitude},${longitude}`;
  let apiURL = `${API_END_POINT}?key=${API_KEY}&q=${query}&pretty=1`;

  try {
      const res = await fetch(apiURL);
      const data = await res.json();

      if (data && data.results && data.results.length > 0) {
          const result = data.results[0];
          setAddress({
              formatted: result.formatted,
              city: result.components.city,
              state: result.components.state,
              country: result.components.country,
              postcode: result.components.postcode,
              town: result.components.town,
              village: result.components.village,
          });
      }
  } catch (error) {
      setError('Failed to fetch address data.');
  }
};

useEffect(() => {
  if (latitude && longitude) {
      getUserCurrentLocation(latitude, longitude);
  }
}, [latitude, longitude]);

myCity = `${address.village ? address.village + ", " : ""}${address.formatted}`;


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: roleFromUrl || '',
    phone: '',
    address: '',
    organizationType: '',//,
    latitude:'',
    longitude:'',
    // ngoRegistrationNumber: ''
  });

  useEffect(()=>{
    setFormData(prevState => ({
      ...prevState,
    address: myCity!='undefined'?myCity : "VIT ,Pune"
  }));
  
  },[myCity])
console.log(myCity.length)
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  async function getCoordinates(address) {
    const API_KEY = "94675ddfc9344fd8bfc94aff3e6b01bb"; // Replace with your API Key
    const GEOCODE_URL = "https://api.opencagedata.com/geocode/v1/json";

    try {
        const response = await fetch(`${GEOCODE_URL}?q=${encodeURIComponent(address)}&key=${API_KEY}`);
        const data = await response.json();

        if (data.status.code === 200 && data.results.length > 0) {
            const location = data.results[0].geometry;
            return { latitude: location.lat, longitude: location.lng };
        } else {
            console.error("No valid coordinates found.");
            return { latitude: null, longitude: null };
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return { latitude: null, longitude: null };
    }
}

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  getCoordinates(formData.address)
    .then((coordinates) => {
      console.log("Coordinates:", coordinates);

      if (coordinates && coordinates.latitude !== null && coordinates.longitude !== null) {
        // Update the state correctly
        setFlat(coordinates.latitude);
        setFlong(coordinates.longitude);

        // Use updated values immediately inside setFormData()
        setFormData((prevState) => ({
          ...prevState,
          latitude: coordinates.latitude, 
          longitude: coordinates.longitude, 
        }));

        // Proceed with registration
        registerUser({
          ...formData,
          latitude: coordinates.latitude, 
          longitude: coordinates.longitude, 
        });
      } else {
        console.error("Invalid coordinates received:", coordinates);
        alert("Failed to fetch valid coordinates. Please check the address and try again.");
      }
    })
    .catch((error) => {
      console.error("Error fetching coordinates:", error);
      alert("An error occurred while fetching location data. Please try again later.");
    });
};
const registerUser = async (updatedFormData) => {
  try {
    const response = await register(updatedFormData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate(formData.role === 'donor' ? '/donor/dashboard' : '/receiver/dashboard');
    }
  } catch (err) {
    setError(err.message || 'Registration failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const getOrganizationTypes = () => {
    if (formData.role === 'donor') {
      return [
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'grocery', label: 'Grocery Store' },
        { value: 'hotel', label: 'Hotel' },
        { value: 'catering', label: 'Catering Service' },
        { value: 'other', label: 'Other' }
      ];
    }
    return [
      { value: 'ngo', label: 'NGO' },
      { value: 'shelter', label: 'Shelter' },
      { value: 'foodbank', label: 'Food Bank' },
      { value: 'charity', label: 'Charity Organization' },
      { value: 'other', label: 'Other' }
    ];
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
          aria-label="Back to home"
        >
          Back to Home
        </Button>

        <Paper 
          component="section"
          elevation={0}
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
              Register as {formData.role === 'donor' ? 'Food Donor' : 'Food Receiver'}
            </Typography>
          </Box>

          <Box component="div" sx={{ p: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
                role="alert"
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                inputProps={{
                  'aria-label': 'Name',
                  'aria-required': 'true'
                }}
              />

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
                inputProps={{
                  'aria-label': 'Email',
                  'aria-required': 'true'
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
                inputProps={{
                  'aria-label': 'Password',
                  'aria-required': 'true'
                }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                inputProps={{
                  'aria-label': 'Phone number',
                  'aria-required': 'true'
                }}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="organization-type-label">Organization Type</InputLabel>
                <Select
                  labelId="organization-type-label"
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  disabled={loading}
                  label="Organization Type"
                  inputProps={{
                    'aria-label': 'Organization type',
                    'aria-required': 'true'
                  }}
                >
                  {getOrganizationTypes().map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            

              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                required
                multiline
                rows={3}
                disabled={loading}
                inputProps={{
                  'aria-label': 'Address',
                  'aria-required': 'true'
                }}
              />

              <Box sx={{ mt: 3 }}>
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
                    'Register'
                  )}
                </Button>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Button
                    color="primary"
                    onClick={() => navigate(`/login?role=${formData.role}`)}
                    sx={{ 
                      color: roleColor,
                      '&:hover': {
                        bgcolor: `${roleColor}10`
                      }
                    }}
                  >
                    Login
                  </Button>
                </Typography>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
