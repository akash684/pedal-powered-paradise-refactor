
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

  // Updated bike data with popular Indian bikes and Indian cities
  const bikes = [
    {
      id: '1',
      name: 'Honda Activa 6G',
      type: 'Scooter',
      price: 400,
      rating: 4.5,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300',
      location: 'Chennai Central',
      available: true,
      features: ['Electric Start', 'LED Headlight', 'Under Seat Storage', 'Fuel Efficient'],
      electric: false,
    },
    {
      id: '2',
      name: 'TVS Apache RTR 160',
      type: 'Sports',
      price: 600,
      rating: 4.3,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
      location: 'Bengaluru Koramangala',
      available: true,
      features: ['Performance Engine', 'Digital Console', 'Racing DNA', 'ABS'],
      electric: false,
    },
    {
      id: '3',
      name: 'Royal Enfield Classic 350',
      type: 'Cruiser',
      price: 900,
      rating: 4.6,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
      location: 'Delhi Connaught Place',
      available: true,
      features: ['Vintage Style', 'Long Range', 'Comfortable Ride', 'Classic Design'],
      electric: false,
    },
    {
      id: '4',
      name: 'Bajaj Pulsar 150',
      type: 'Sports',
      price: 550,
      rating: 4.2,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
      location: 'Hyderabad Banjara Hills',
      available: false,
      features: ['Sporty Design', 'Twin Spark Engine', 'ExhausTEC', 'Digital Console'],
      electric: false,
    },
    {
      id: '5',
      name: 'Yamaha FZ-S',
      type: 'Street',
      price: 650,
      rating: 4.4,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
      location: 'Kochi Marine Drive',
      available: true,
      features: ['Fuel Injection', 'LED Lighting', 'Single Channel ABS', 'Muscular Design'],
      electric: false,
    },
    {
      id: '6',
      name: 'TVS iQube Electric',
      type: 'Electric Scooter',
      price: 750,
      rating: 4.7,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300',
      location: 'Pune FC Road',
      available: true,
      features: ['Smart Connect', 'GPS Navigation', 'Fast Charging', 'Zero Emission'],
      electric: true,
      batteryLevel: 85,
    },
    {
      id: '7',
      name: 'Hero Splendor Plus',
      type: 'Commuter',
      price: 350,
      rating: 4.1,
      reviews: 164,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
      location: 'Kolkata Park Street',
      available: true,
      features: ['Fuel Efficient', 'Low Maintenance', 'Reliable', 'Comfortable Seat'],
      electric: false,
    },
    {
      id: '8',
      name: 'Ather 450X',
      type: 'Electric Scooter',
      price: 800,
      rating: 4.8,
      reviews: 115,
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300',
      location: 'Mumbai Bandra West',
      available: true,
      features: ['Fast Charging', 'Smart Dashboard', 'Long Range', 'Premium Build'],
      electric: true,
      batteryLevel: 92,
    },
  ];

  const bikeTypes = ['all', 'Scooter', 'Sports', 'Cruiser', 'Street', 'Electric Scooter', 'Commuter'];
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹700', value: '500-700' },
    { label: 'Over ₹700', value: '700+' },
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
        if (priceRange === '500-700') return bike.price > 500 && bike.price <= 700;
        if (priceRange === '700+') return bike.price > 700;
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
            Rent Your Perfect Bike in India
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from India's most popular bikes with affordable daily rental rates across major cities
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search bikes, types, or cities..."
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
