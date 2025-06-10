
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Clock, MapPin, Headphones, Zap, Star } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'All bikes are regularly maintained and equipped with safety features. GPS tracking ensures security.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Rent a bike anytime, anywhere. Our service is available round the clock for your convenience.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: MapPin,
      title: 'Multiple Locations',
      description: 'Over 50 pickup and drop-off locations across the city. Find a station near you.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Our friendly support team is here to help you 24/7. Get assistance whenever you need it.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Zap,
      title: 'Electric Options',
      description: 'Try our eco-friendly electric bikes for effortless rides and extended range.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'High-quality bikes from top brands. Regular maintenance ensures the best riding experience.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose BikeRent?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best bike rental experience with unmatched service quality
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover-lift border-0 shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
            >
              <CardContent className="p-6 text-center">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Adventure?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Join thousands of satisfied customers who have chosen BikeRent for their cycling needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors">
                Browse Bikes
              </button>
              <button className="border border-border hover:bg-muted text-foreground px-8 py-3 rounded-lg font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
