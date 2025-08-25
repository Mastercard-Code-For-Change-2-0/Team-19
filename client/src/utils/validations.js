// Validation utilities for donation portal

export const validateEmail = (email) => {
  const errors = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name) => {
  const errors = [];
  
  if (!name) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateDonation = (donation) => {
  const errors = [];
  
  if (!donation.items || donation.items.trim().length < 3) {
    errors.push('Items description must be at least 3 characters long');
  }
  
  if (!donation.category) {
    errors.push('Please select a category');
  }
  
  if (!donation.quantity || donation.quantity < 1) {
    errors.push('Quantity must be at least 1');
  }
  
  if (!donation.description || donation.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  if (!donation.location || donation.location.trim().length < 2) {
    errors.push('Location is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequest = (request) => {
  const errors = [];
  
  if (!request.items || request.items.trim().length < 3) {
    errors.push('Items needed must be at least 3 characters long');
  }
  
  if (!request.category) {
    errors.push('Please select a category');
  }
  
  if (!request.urgency) {
    errors.push('Please select urgency level');
  }
  
  if (!request.description || request.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  if (!request.location || request.location.trim().length < 2) {
    errors.push('Location is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value, fieldName) => {
  const errors = [];
  
  if (!value || value.trim().length === 0) {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const combineValidationResults = (...results) => {
  const allErrors = results.flatMap(result => result.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};