import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormInput from '@/components/FormInput';
import { registerUser, setCurrentUser } from '@/utils/mockApi';
import { validateEmail, validatePassword, validateName } from '@/utils/validations';
import { useToast } from '@/hooks/use-toast';
import { Heart, ArrowLeft } from 'lucide-react';

const DonorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    authType: '',          // New field (Aadhar / PAN)
    authValue: ''          // Stores entered number
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const maskAadhar = (value: string) => {
    // Allow only digits
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 4) return clean;
    // Mask first 8 digits, show only last 4
    return '*'.repeat(clean.length - 4) + clean.slice(-4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    
    const newErrors: Record<string, string> = {};
    
    if (!nameValidation.isValid) newErrors.name = nameValidation.errors[0];
    if (!emailValidation.isValid) newErrors.email = emailValidation.errors[0];
    if (!passwordValidation.isValid) newErrors.password = passwordValidation.errors[0];
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validation for Aadhar / PAN
    if (formData.authType === 'aadhar') {
      if (!/^\d{12}$/.test(formData.authValue)) {
        newErrors.authValue = 'Enter a valid 12-digit Aadhar number';
      }
    } else if (formData.authType === 'pan') {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.authValue.toUpperCase())) {
        newErrors.authValue = 'Enter a valid 10-character PAN number';
      }
    } else {
      newErrors.authType = 'Please select an authentication method';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerUser(
        formData.email, 
        formData.password, 
        formData.name, 
        'donor'
      );
      if (user) {
        setCurrentUser(user);
        toast({
          title: 'Registration Successful',
          description: `Welcome to Seva Sahayog, ${user.name}!`,
        });
        navigate('/donor/dashboard');
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-trust-blue mr-2" />
            <span className="text-2xl font-bold text-foreground">Donor Registration</span>
          </div>
          <p className="text-muted-foreground">Join our community of generous donors</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Donor Account</CardTitle>
            <CardDescription>
              Start making a difference in your community today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              {/* Existing Inputs */}
              <FormInput
                id="name"
                label="Full Name"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                required
                error={errors.name}
              />

              <FormInput
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                required
                error={errors.email}
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                placeholder="Create a password"
                required
                error={errors.password}
                hint="Minimum 6 characters"
              />

              <FormInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm your password"
                required
                error={errors.confirmPassword}
              />

              {/* NEW DROPDOWN */}
              <div>
                <label className="block text-sm font-medium mb-1">Authentication Method</label>
                <select
                  id="authType"
                  value={formData.authType}
                  onChange={(e) => handleInputChange('authType', e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select...</option>
                  <option value="aadhar">Aadhar Number</option>
                  <option value="pan">PAN Number</option>
                </select>
                {errors.authType && (
                  <p className="text-destructive text-sm mt-1">{errors.authType}</p>
                )}
              </div>

              {/* Conditional Input */}
              {formData.authType === 'aadhar' && (
                <FormInput
                  id="aadhar"
                  label="Aadhar Number"
                  type="text"
                  maxLength={12}
                  value={maskAadhar(formData.authValue)}
                  onChange={(value) => handleInputChange('authValue', value)}
                  placeholder="Enter 12-digit Aadhar number"
                  required
                  error={errors.authValue}
                />
              )}

              {formData.authType === 'pan' && (
                <FormInput
                  id="pan"
                  label="PAN Number"
                  type="text"
                  maxLength={10}
                  value={formData.authValue}
                  onChange={(value) => handleInputChange('authValue', value.toUpperCase())}
                  placeholder="Enter 10-character PAN number"
                  required
                  error={errors.authValue}
                />
              )}

              <Button 
                type="submit" 
                className="w-full" 
                variant="hero" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Donor Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/donor/login" 
                  className="text-trust-blue hover:underline font-medium"
                >
                  Sign In
                </Link>
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Need a different role?</p>
                <div className="flex justify-center space-x-2">
                  <Link to="/receiver/register">
                    <Button variant="outline" size="sm">Receiver Register</Button>
                  </Link>
                  <Link to="/admin/login">
                    <Button variant="outline" size="sm">Admin Access</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonorRegister;
