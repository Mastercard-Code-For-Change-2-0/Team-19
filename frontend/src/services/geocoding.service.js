import axios from 'axios';

export const geocodeLocation = async (location) => {
  const apiKey  = "94675ddfc9344fd8bfc94aff3e6b01bb"; // Replace with your geocoding API key
  const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
    params: {
      q: location,
      key: apiKey,
    },
  });

  if (response.data.results.length === 0) {
    throw new Error('Location not found');
  }

  const { lat, lng } = response.data.results[0].geometry;
  return { latitude: lat, longitude: lng };
};