import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormInput from '@/components/FormInput';
import { loginUser, setCurrentUser } from '@/utils/mockApi';
import { validateEmail, validatePassword, combineValidationResults } from '@/utils/validations';
import { useToast } from '@/hooks/use-toast';
import { Users, ArrowLeft } from 'lucide-react';
import axios from 'axios';


const ReceiverLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const validation = combineValidationResults(emailValidation, passwordValidation);

    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      if (!emailValidation.isValid) newErrors.email = emailValidation.errors[0];
      if (!passwordValidation.isValid) newErrors.password = passwordValidation.errors[0];
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role: 'receiver', // Role for this specific login
      });

      const { token, user } = response.data;

      // Store token and user data (can also use Context API or Redux)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${user.name}!`,
      });

      navigate('/receiver/dashboard');
    } catch (error) {
      // Handle error if login fails
      if (error.response) {
        setErrors({ general: error.response.data.msg || 'Invalid email or password' });
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
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
            <span className="text-2xl font-bold text-foreground">Receiver Portal</span>
          </div>
          <p className="text-muted-foreground">Access help and support from our community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Receiver Login</CardTitle>
            <CardDescription>
              Access your receiver dashboard to manage requests
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
                variant="warm" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In as Receiver'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/receiver/register" 
                  className="text-generous-orange hover:underline font-medium"
                >
                  Register as Receiver
                </Link>
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Looking for a different role?</p>
                <div className="flex justify-center space-x-2">
                  <Link to="/donor/login">
                    <Button variant="outline" size="sm">Donor Login</Button>
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

export default ReceiverLogin;