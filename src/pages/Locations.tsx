
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bike, Clock, Phone, Star } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  totalBikes: number;
  availableBikes: number;
  rating: number;
  phone: string;
  timings: string;
  landmark: string;
}

const Locations = () => {
  // Indian bike rental locations
  const locations: Location[] = [
    {
      id: '1',
      name: 'Chennai Central Hub',
      address: 'Express Avenue Mall, Anna Salai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600002',
      totalBikes: 25,
      availableBikes: 18,
      rating: 4.5,
      phone: '+91 98765 43210',
      timings: '6:00 AM - 10:00 PM',
      landmark: 'Near Chennai Central Railway Station'
    },
    {
      id: '2',
      name: 'Bengaluru Koramangala',
      address: '80 Feet Road, Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560034',
      totalBikes: 30,
      availableBikes: 22,
      rating: 4.7,
      phone: '+91 98765 43211',
      timings: '24/7',
      landmark: 'Near Forum Mall'
    },
    {
      id: '3',
      name: 'Delhi Connaught Place',
      address: 'Block A, Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      totalBikes: 35,
      availableBikes: 12,
      rating: 4.3,
      phone: '+91 98765 43212',
      timings: '6:00 AM - 11:00 PM',
      landmark: 'Near Rajiv Chowk Metro Station'
    },
    {
      id: '4',
      name: 'Hyderabad Banjara Hills',
      address: 'Road No. 1, Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500034',
      totalBikes: 20,
      availableBikes: 15,
      rating: 4.4,
      phone: '+91 98765 43213',
      timings: '5:30 AM - 10:30 PM',
      landmark: 'Near GVK One Mall'
    },
    {
      id: '5',
      name: 'Kochi Marine Drive',
      address: 'Marine Drive, Ernakulam',
      city: 'Kochi',
      state: 'Kerala',
      zipCode: '682031',
      totalBikes: 18,
      availableBikes: 16,
      rating: 4.6,
      phone: '+91 98765 43214',
      timings: '6:00 AM - 9:00 PM',
      landmark: 'Near High Court of Kerala'
    },
    {
      id: '6',
      name: 'Pune FC Road',
      address: 'Fergusson College Road',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411004',
      totalBikes: 28,
      availableBikes: 20,
      rating: 4.2,
      phone: '+91 98765 43215',
      timings: '6:00 AM - 10:00 PM',
      landmark: 'Near Fergusson College'
    },
    {
      id: '7',
      name: 'Kolkata Park Street',
      address: 'Park Street, Near Park Hotel',
      city: 'Kolkata',
      state: 'West Bengal',
      zipCode: '700016',
      totalBikes: 22,
      availableBikes: 8,
      rating: 4.1,
      phone: '+91 98765 43216',
      timings: '7:00 AM - 9:00 PM',
      landmark: 'Near Park Street Metro Station'
    },
    {
      id: '8',
      name: 'Mumbai Bandra West',
      address: 'Hill Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050',
      totalBikes: 40,
      availableBikes: 25,
      rating: 4.8,
      phone: '+91 98765 43217',
      timings: '24/7',
      landmark: 'Near Bandra Railway Station'
    }
  ];

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 60) return { status: 'High', variant: 'default' as const, color: 'text-green-600' };
    if (percentage > 30) return { status: 'Medium', variant: 'secondary' as const, color: 'text-yellow-600' };
    return { status: 'Low', variant: 'destructive' as const, color: 'text-red-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Bike Rental Locations</h1>
          <p className="text-lg text-muted-foreground">
            Find our bike rental stations across major Indian cities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => {
            const availability = getAvailabilityStatus(location.availableBikes, location.totalBikes);
            
            return (
              <Card key={location.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                        {location.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {location.city}, {location.state}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{location.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">{location.address}</p>
                    <p>{location.landmark}</p>
                    <p>{location.zipCode}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bike className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className={`font-semibold ${availability.color}`}>
                          {location.availableBikes}
                        </span>
                        <span className="text-muted-foreground"> / {location.totalBikes} available</span>
                      </span>
                    </div>
                    <Badge variant={availability.variant}>
                      {availability.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{location.timings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{location.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      📍 All bikes come with helmets and basic insurance
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Book</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">1. Choose Location</h3>
              <p className="text-sm text-muted-foreground">Select your preferred pickup location from the list above</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bike className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">2. Select Bike</h3>
              <p className="text-sm text-muted-foreground">Browse available bikes and choose one that suits your needs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">3. Book & Ride</h3>
              <p className="text-sm text-muted-foreground">Complete payment and enjoy your ride with our quality bikes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
