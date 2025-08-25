import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Shield, Package, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-light-gray to-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center mb-6">
            {/* <Heart className="h-16 w-16 text-trust-blue mr-4" /> */}
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Seva Sahayog
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Connecting generous donors with those in need through a transparent 
            and efficient donation matching platform
          </p>
          
          <p className="text-lg text-muted-foreground mb-12">
            Building stronger communities one donation at a time
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/donor/register">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                <Heart className="h-5 w-5 mr-2" />
                Become a Donor
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/receiver/register">
              <Button variant="warm" size="lg" className="w-full sm:w-auto">
                <Users className="h-5 w-5 mr-2" />
                Request Help
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/admin/login">
              <Button variant="trust-outline" size="lg" className="w-full sm:w-auto">
                <Shield className="h-5 w-5 mr-2" />
                Admin Access
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How Seva Sahayog Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Donor Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <Heart className="h-12 w-12 text-trust-blue mx-auto" />
                </div>
                <CardTitle className="text-xl">For Donors</CardTitle>
                <CardDescription>
                  Share your generosity with those who need it most
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-left">
                  <CheckCircle className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                  <span className="text-sm">Easy donation listing with photos</span>
                </div>
                <div className="flex items-center text-left">
                  <CheckCircle className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                  <span className="text-sm">Track your donation impact</span>
                </div>
                <div className="flex items-center text-left">
                  <CheckCircle className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                  <span className="text-sm">Connect directly with receivers</span>
                </div>
                <div className="pt-4">
                  <Link to="/donor/register">
                    <Button variant="hero" className="w-full">
                      Start Donating
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Receiver Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <Users className="h-12 w-12 text-generous-orange mx-auto" />
                </div>
                <CardTitle className="text-xl">For Receivers</CardTitle>
                <CardDescription>
                  Get the help you need from our caring community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-left">
                  <CheckCircle className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                  <span className="text-sm">Submit detailed help requests</span>
                </div>
                <div className="flex items-center text-left">
                  <CheckCircle className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                  <span className="text-sm">Browse available donations</span>
                </div>
                <div className="flex items-center text-left">
                  <CheckCircle className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                  <span className="text-sm">Priority matching system</span>
                </div>
                <div className="pt-4">
                  <Link to="/receiver/register">
                    <Button variant="warm" className="w-full">
                      Request Help
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <Shield className="h-12 w-12 text-success-green mx-auto" />
                </div>
                <CardTitle className="text-xl">For Admins</CardTitle>
                <CardDescription>
                  Ensure transparent and efficient matching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-left">
                  <CheckCircle className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                  <span className="text-sm">Review and approve matches</span>
                </div>
                <div className="flex items-center text-left">
                  <CheckCircle className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                  <span className="text-sm">Monitor platform activity</span>
                </div>
                <div className="flex items-center text-left">
                  <CheckCircle className="h-5 w-5 text-success-green mr-3 flex-shrink-0" />
                  <span className="text-sm">Ensure quality and trust</span>
                </div>
                <div className="pt-4">
                  <Link to="/admin/login">
                    <Button variant="success" className="w-full">
                      Admin Access
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Making a Real Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-trust-blue mb-2">100+</div>
              <div className="text-muted-foreground">Successful Matches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-generous-orange mb-2">50+</div>
              <div className="text-muted-foreground">Active Donors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-success-green mb-2">75+</div>
              <div className="text-muted-foreground">Families Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Join Our Community Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you want to give or receive help, Seva Sahayog makes it simple, 
            transparent, and meaningful. Start making a difference today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donor/register">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                <Package className="h-5 w-5 mr-2" />
                Start Donating Now
              </Button>
            </Link>
            <Link to="/receiver/register">
              <Button variant="warm" size="lg" className="w-full sm:w-auto">
                <Heart className="h-5 w-5 mr-2" />
                Get Help Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
