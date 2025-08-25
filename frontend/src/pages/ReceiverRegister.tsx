import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormInput from '@/components/FormInput';
import { registerUser, setCurrentUser } from '@/utils/mockApi';
import { validateEmail, validatePassword, validateName } from '@/utils/validations';
import { useToast } from '@/hooks/use-toast';
import { Users, ArrowLeft } from 'lucide-react';

const ReceiverRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerUser(formData.email, formData.password, formData.name, 'receiver');
      if (user) {
        setCurrentUser(user);
        toast({
          title: 'Registration Successful',
          description: `Welcome to DonationHub, ${user.name}!`,
        });
        navigate('/receiver/dashboard');
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
            <Users className="h-8 w-8 text-generous-orange mr-2" />
            <span className="text-2xl font-bold text-foreground">Receiver Registration</span>
          </div>
          <p className="text-muted-foreground">Join our community to get the help you need</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Receiver Account</CardTitle>
            <CardDescription>
              Connect with generous donors in your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              <FormInput
                id="name"
                label="Organization/Individual Name"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="Enter your name or organization"
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

              <Button 
                type="submit" 
                className="w-full" 
                variant="warm" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Receiver Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/receiver/login" 
                  className="text-generous-orange hover:underline font-medium"
                >
                  Sign In
                </Link>
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Need a different role?</p>
                <div className="flex justify-center space-x-2">
                  <Link to="/donor/register">
                    <Button variant="outline" size="sm">Donor Register</Button>
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

export default ReceiverRegister;