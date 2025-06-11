
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BikeCard from './BikeCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const BikeGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Updated bike data with Indian names and INR pricing
  const bikes = [
    {
      id: '1',
      name: 'Honda Activa 6G',
      type: 'Scooter',
      price: 450,
      rating: 4.5,
      reviews: 127,
      image: '',
      location: 'Mumbai Central',
      available: true,
      features: ['Electric Start', 'LED Headlight', 'Under Seat Storage'],
      electric: false,
    },
    {
      id: '2',
      name: 'TVS iQube Electric',
      type: 'Electric Scooter',
      price: 800,
      rating: 4.8,
      reviews: 89,
      image: '',
      location: 'Bangalore Koramangala',
      available: true,
      features: ['Smart Connect', 'GPS Navigation', 'Fast Charging'],
      electric: true,
      batteryLevel: 85,
    },
    {
      id: '3',
      name: 'Royal Enfield Classic 350',
      type: 'Cruiser',
      price: 1200,
      rating: 4.6,
      reviews: 203,
      image: '',
      location: 'Delhi Connaught Place',
      available: true,
      features: ['Vintage Style', 'Long Range', 'Comfortable Ride'],
      electric: false,
    },
    {
      id: '4',
      name: 'Bajaj Pulsar NS200',
      type: 'Sports',
      price: 900,
      rating: 4.3,
      reviews: 156,
      image: '',
      location: 'Pune FC Road',
      available: false,
      features: ['Sporty Design', 'Performance Engine', 'Digital Console'],
      electric: false,
    },
    {
      id: '5',
      name: 'Ather 450X',
      type: 'Electric Scooter',
      price: 950,
      rating: 4.7,
      reviews: 92,
      image: '',
      location: 'Chennai T Nagar',
      available: true,
      features: ['Fast Charging', 'Smart Dashboard', 'Long Range'],
      electric: true,
      batteryLevel: 92,
    },
    {
      id: '6',
      name: 'Hero Splendor Plus',
      type: 'Commuter',
      price: 350,
      rating: 4.4,
      reviews: 78,
      image: '',
      location: 'Hyderabad Banjara Hills',
      available: true,
      features: ['Fuel Efficient', 'Low Maintenance', 'Reliable'],
      electric: false,
    },
  ];

  const bikeTypes = ['all', 'Scooter', 'Electric Scooter', 'Cruiser', 'Sports', 'Commuter'];
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹800', value: '500-800' },
    { label: 'Over ₹800', value: '800+' },
  ];

  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bike.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bike.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || bike.type === selectedType;
      
      const matchesPrice = (() => {
        if (priceRange === 'all') return true;
        if (priceRange === '0-500') return bike.price <= 500;
        if (priceRange === '500-800') return bike.price > 500 && bike.price <= 800;
        if (priceRange === '800+') return bike.price > 800;
        return true;
      })();

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [searchTerm, selectedType, priceRange]);

  return (
    <section id="bikes" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Your Perfect Bike
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from India's most popular bikes with affordable daily rental rates
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search bikes, types, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Filters - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Bike Type" />
                </SelectTrigger>
                <SelectContent>
                  {bikeTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Toggle - Mobile */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden h-12 px-6"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t space-y-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Bike Type" />
                </SelectTrigger>
                <SelectContent>
                  {bikeTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredBikes.length} of {bikes.length} bikes
          </p>
          {(searchTerm || selectedType !== 'all' || priceRange !== 'all') && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setPriceRange('all');
              }}
              className="text-primary hover:text-primary/80"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Bike Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>

        {/* No Results */}
        {filteredBikes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No bikes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or clear the filters
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setPriceRange('all');
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BikeGallery;
