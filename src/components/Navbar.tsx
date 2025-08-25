import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {LogOut, Globe } from 'lucide-react';
import { getCurrentUser, logout } from '@/utils/mockApi';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const [language, setLanguage] = useState('en');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'donor': return 'Donor';
      case 'receiver': return 'Receiver';
      default: return '';
    }
  };

  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'donor': return '/donor/dashboard';
      case 'receiver': return '/receiver/dashboard';
      default: return '/';
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            
            <span className="text-xl font-bold text-foreground">Seva Sahayog</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-background border border-border rounded-md px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-medium text-foreground">{currentUser.name}</span>
                  <span className="ml-1 text-xs bg-trust-blue text-white px-2 py-1 rounded-full">
                    {getRoleDisplayName(currentUser.role)}
                  </span>
                </span>
                
                {location.pathname !== getDashboardPath(currentUser.role) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(getDashboardPath(currentUser.role))}
                  >
                    Dashboard
                  </Button>
                )}
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/donor/login">
                  <Button variant="outline" size="sm">Donor Login</Button>
                </Link>
                <Link to="/receiver/login">
                  <Button variant="outline" size="sm">Receiver Login</Button>
                </Link>
                <Link to="/admin/login">
                  <Button variant="secondary" size="sm">Admin</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;