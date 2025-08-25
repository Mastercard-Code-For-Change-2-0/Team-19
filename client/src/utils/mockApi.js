// Mock API functions for donation portal

// Mock data storage
const users = [
  { id: 'admin1', email: 'admin@donation.com', name: 'Admin User', role: 'admin' }
];

const donations = [
  {
    id: '1',
    donorId: 'donor1',
    donorName: 'John Smith',
    items: 'Winter Clothes',
    category: 'clothing',
    quantity: 5,
    description: 'Warm winter jackets and boots for children',
    status: 'available',
    createdAt: '2024-01-15',
    location: 'New York'
  },
  {
    id: '2',
    donorId: 'donor2',
    donorName: 'Sarah Johnson',
    items: 'Books and School Supplies',
    category: 'education',
    quantity: 20,
    description: 'Educational books and stationery for students',
    status: 'available',
    createdAt: '2024-01-14',
    location: 'Boston'
  }
];

const requests = [
  {
    id: '1',
    receiverId: 'receiver1',
    receiverName: 'Community Center',
    items: 'Food Items',
    category: 'food',
    urgency: 'high',
    description: 'Non-perishable food items for local families',
    status: 'pending',
    createdAt: '2024-01-16',
    location: 'New York'
  }
];

const matches = [];

// Authentication functions
export const loginUser = async (email, password, role) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (role === 'admin' && email === 'admin@donation.com' && password === 'admin123') {
    return users.find(u => u.role === 'admin') || null;
  }
  
  // For demo, accept any email/password for donor/receiver
  if (role === 'donor' || role === 'receiver') {
    const user = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role: role
    };
    users.push(user);
    return user;
  }
  
  return null;
};

export const registerUser = async (email, password, name, role) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = {
    id: Date.now().toString(),
    email,
    name,
    role: role
  };
  
  users.push(user);
  return user;
};

// Donation functions
export const createDonation = async (donation) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newDonation = {
    ...donation,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
    status: 'available'
  };
  
  donations.push(newDonation);
  return newDonation;
};

export const getDonations = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...donations];
};

// Request functions
export const createRequest = async (request) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newRequest = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  
  requests.push(newRequest);
  return newRequest;
};

export const getRequests = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...requests];
};

// Match functions
export const createMatch = async (donationId, requestId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const match = {
    id: Date.now().toString(),
    donationId,
    requestId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  matches.push(match);
  return match;
};

export const getMatches = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...matches];
};

export const updateMatchStatus = async (matchId, status) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const match = matches.find(m => m.id === matchId);
  if (match) {
    match.status = status;
    
    // Update related donation and request status
    if (status === 'approved') {
      const donation = donations.find(d => d.id === match.donationId);
      const request = requests.find(r => r.id === match.requestId);
      
      if (donation) donation.status = 'matched';
      if (request) request.status = 'matched';
    }
    
    return match;
  }
  
  return null;
};

// Utility functions
export const getCurrentUser = () => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// ...existing code...
export const logout = () => {
  localStorage.removeItem('currentUser');
}; // <-- Add this closing brace