import api from './api';

// Donor services
export const createDonation = async (donationData) => {
  try {
    const response = await api.post('/donations', donationData);
    return response.data;
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
};

export const getDonorDonations = async () => {
  try {
    const response = await api.get('/donations/donor');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching donor donations:', error);
    throw error;
  }
};

// Receiver services
export const getAvailableDonations = async (po) => {
  try {
    const response = await api.post('/donations/available',po);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching available donations:', error);
    throw error;
  }
};


export const getAcceptedDonations = async () => {
  try {
    const response = await api.get('/donations/accepted');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching accepted donations:', error);
    throw error;
  }
};

export const acceptDonation = async (donationId) => {
  try {
    const response = await api.post(`/donations/${donationId}/accept`);
    return response.data;
  } catch (error) {
    console.error('Error accepting donation:', error);
    throw error;
  }
};



