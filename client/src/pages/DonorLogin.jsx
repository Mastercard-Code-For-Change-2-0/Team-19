import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormInput from '@/components/FormInput';
import { loginUser, setCurrentUser } from '@/utils/mockApi';
import { validateEmail, validatePassword, combineValidationResults } from '@/utils/validations';
import { useToast } from '@/hooks/use-toast';
import { Heart, ArrowLeft } from 'lucide-react';

const DonorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const validation = combineValidationResults(emailValidation, passwordValidation);

    if (!validation.isValid) {
      const newErrors = {};
      if (!emailValidation.isValid) newErrors.email = emailValidation.errors[0];
      if (!passwordValidation.isValid) newErrors.password = passwordValidation.errors[0];
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginUser(email, password, 'donor');
      if (user) {
        setCurrentUser(user);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.name}!`,
        });
        navigate('/donor/dashboard');
      } else {
        setErrors({ general: 'Invalid email or password' });
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
            <span className="text-2xl font-bold text-foreground">Donor Portal</span>
          </div>
          <p className="text-muted-foreground">Sign in to start sharing your generosity</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Donor Login</CardTitle>
            <CardDescription>
              Access your donor dashboard to manage donations
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
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                required
                error={errors.email}
                hint="Use any email for demo purposes"
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                required
                error={errors.password}
                hint="Use any password (minimum 6 characters)"
              />

              <Button 
                type="submit" 
                className="w-full" 
                variant="hero" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In as Donor'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/donor/register" 
                  className="text-trust-blue hover:underline font-medium"
                >
                  Register as Donor
                </Link>
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Looking for a different role?</p>
                <div className="flex justify-center space-x-2">
                  <Link to="/receiver/login">
                    <Button variant="outline" size="sm">Receiver Login</Button>
                  </Link>
                  <Link to="/admin/login">
                    <Button variant="outline" size="sm">Admin Login</Button>
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
export default DonorLogin;