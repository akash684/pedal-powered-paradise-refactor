
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bike, MapPin, Clock, Shield, Zap, Heart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Bike className="h-8 w-8 text-primary" />,
      title: "Premium Bikes",
      description: "High-quality bikes including electric, mountain, city, and hybrid models"
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Multiple Locations",
      description: "Convenient pickup and drop-off locations throughout the city"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Flexible Rental",
      description: "Rent by the hour, day, or week - whatever suits your needs"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Safe",
      description: "All bikes are regularly maintained and equipped with safety features"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Electric Options",
      description: "Eco-friendly electric bikes for effortless city commuting"
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Customer Care",
      description: "24/7 support and assistance whenever you need help"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">About BikeRental</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're passionate about making urban transportation sustainable, convenient, and fun. 
          Our bike rental service connects you with the perfect bike for every journey.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="mb-12">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            To revolutionize urban mobility by providing accessible, sustainable, and enjoyable bike rental 
            experiences that connect communities, reduce carbon footprints, and promote healthy lifestyles. 
            We believe every journey should be an adventure, whether you're commuting to work, exploring 
            the city, or enjoying a leisurely ride.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <Card className="mb-12">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Our Impact</CardTitle>
          <CardDescription>Making a difference in our community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <p className="text-sm text-muted-foreground">Rental Locations</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <p className="text-sm text-muted-foreground">Bikes Available</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Customer Support</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Get in Touch</CardTitle>
          <CardDescription>Have questions? We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">support@bikerental.com</p>
          </div>
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-muted-foreground">+1 (555) 123-BIKE</p>
          </div>
          <div>
            <p className="font-medium">Address</p>
            <p className="text-muted-foreground">123 Bike Street, Cycle City, CC 12345</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
