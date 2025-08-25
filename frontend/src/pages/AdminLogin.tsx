import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormInput from '@/components/FormInput';
import { loginUser, setCurrentUser } from '@/utils/mockApi';
import { validateEmail, validatePassword, combineValidationResults } from '@/utils/validations';
import { useToast } from '@/hooks/use-toast';
import { Shield, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@donation.com');
  const [password, setPassword] = useState('admin123');
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
      const user = await loginUser(email, password, 'admin');
      if (user) {
        setCurrentUser(user);
        toast({
          title: 'Admin Login Successful',
          description: `Welcome back, ${user.name}!`,
        });
        navigate('/admin/dashboard');
      } else {
        setErrors({ general: 'Invalid admin credentials' });
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
            <Shield className="h-8 w-8 text-success-green mr-2" />
            <span className="text-2xl font-bold text-foreground">Admin Portal</span>
          </div>
          <p className="text-muted-foreground">Administrative access to manage the platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Access the administrative dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground mb-2">Demo Admin Credentials:</p>
                <p className="text-xs font-mono">Email: admin@donation.com</p>
                <p className="text-xs font-mono">Password: admin123</p>
              </div>

              <FormInput
                id="email"
                label="Admin Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter admin email"
                required
                error={errors.email}
              />

              <FormInput
                id="password"
                label="Admin Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter admin password"
                required
                error={errors.password}
              />

              <Button 
                type="submit" 
                className="w-full" 
                variant="success" 
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Admin Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Not an admin?</p>
                <div className="flex justify-center space-x-2">
                  <Link to="/donor/login">
                    <Button variant="outline" size="sm">Donor Login</Button>
                  </Link>
                  <Link to="/receiver/login">
                    <Button variant="outline" size="sm">Receiver Login</Button>
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

export default AdminLogin;