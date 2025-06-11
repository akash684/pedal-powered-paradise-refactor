
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BikeCard from './BikeCard';
import LocationDetector from './LocationDetector';
import { Search, Filter, SlidersHorizontal, MapPin, IndianRupee } from 'lucide-react';
import bikesData from '@/data/bikes.json';

const BikeGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);

  // Use the local bikes data
  const bikes = bikesData.map(bike => ({
    ...bike,
    name: bike.bike_name,
    price: bike.rental_price_inr,
    image: bike.bike_image_url,
  }));

  const bikeTypes = ['all', 'Scooter', 'Sports', 'Cruiser', 'Street', 'Electric Scooter', 'Commuter'];
  const locations = ['all', ...Array.from(new Set(bikes.map(bike => bike.location)))];
  
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹700', value: '500-700' },
    { label: 'Over ₹700', value: '700+' },
  ];

  // Auto-select detected city
  const handleLocationDetected = (city: string) => {
    setDetectedCity(city);
    setSelectedLocation(city);
  };

  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      const matchesSearch = bike.bike_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bike.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bike.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || bike.type === selectedType;
      const matchesLocation = selectedLocation === 'all' || bike.location === selectedLocation;
      
      const matchesPrice = (() => {
        if (priceRange === 'all') return true;
        if (priceRange === '0-500') return bike.rental_price_inr <= 500;
        if (priceRange === '500-700') return bike.rental_price_inr > 500 && bike.rental_price_inr <= 700;
        if (priceRange === '700+') return bike.rental_price_inr > 700;
        return true;
      })();

      return matchesSearch && matchesType && matchesLocation && matchesPrice;
    });
  }, [searchTerm, selectedType, selectedLocation, priceRange, bikes]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedLocation('all');
    setPriceRange('all');
    setDetectedCity(null);
  };

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

        {/* Location Detection */}
        <div className="max-w-md mx-auto mb-8">
          <LocationDetector onLocationDetected={handleLocationDetected} />
        </div>

        {/* Location-aware header */}
        {selectedLocation !== 'all' && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full">
              <MapPin className="h-4 w-4 text-primary mr-2" />
              <span className="text-primary font-medium">
                Bikes available in {selectedLocation}
              </span>
            </div>
          </div>
        )}

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

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location === 'all' ? 'All Cities' : location}
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

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location === 'all' ? 'All Cities' : location}
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
          <p className="text-muted-foreground flex items-center">
            <IndianRupee className="h-4 w-4 mr-1" />
            Showing {filteredBikes.length} of {bikes.length} bikes
          </p>
          {(searchTerm || selectedType !== 'all' || selectedLocation !== 'all' || priceRange !== 'all') && (
            <Button
              variant="ghost"
              onClick={clearFilters}
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
              onClick={clearFilters}
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
