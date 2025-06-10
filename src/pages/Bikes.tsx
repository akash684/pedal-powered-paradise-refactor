
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import BikeCard from '@/components/BikeCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Bike {
  id: string;
  name: string;
  type: string;
  description: string;
  price_per_hour: number;
  image_url: string | null;
  available: boolean;
  location_id: string;
  battery_level: number | null;
  features: string[];
  locations?: {
    name: string;
    city: string;
    state: string;
  };
}

interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
}

const Bikes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteBikeIds, setFavoriteBikeIds] = useState<Set<string>>(new Set());
  
  const itemsPerPage = 12;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch locations for filter dropdown
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, city, state')
        .order('name');
      
      if (error) throw error;
      return data as Location[];
    },
  });

  // Fetch user favorites
  useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select('bike_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const favoriteIds = new Set(data.map(fav => fav.bike_id));
      setFavoriteBikeIds(favoriteIds);
      return data;
    },
    enabled: !!user,
  });

  // Fetch bikes with filtering
  const { data: bikesData, isLoading, error } = useQuery({
    queryKey: [
      'bikes',
      debouncedSearch,
      selectedType,
      selectedLocation,
      availabilityFilter,
      showFavoritesOnly,
      user?.id
    ],
    queryFn: async () => {
      let query = supabase
        .from('bikes')
        .select(`
          *,
          locations (
            name,
            city,
            state
          )
        `);

      // Apply search filter
      if (debouncedSearch) {
        query = query.or(
          `name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%,type.ilike.%${debouncedSearch}%`
        );
      }

      // Apply type filter
      if (selectedType !== 'all') {
        query = query.eq('type', selectedType);
      }

      // Apply location filter
      if (selectedLocation !== 'all') {
        query = query.eq('location_id', selectedLocation);
      }

      // Apply availability filter
      if (availabilityFilter === 'available') {
        query = query.eq('available', true);
      } else if (availabilityFilter === 'unavailable') {
        query = query.eq('available', false);
      }

      const { data, error } = await query.order('name');
      
      if (error) throw error;

      let bikes = data as Bike[];

      // Filter favorites if user is logged in and toggle is on
      if (showFavoritesOnly && user && favoriteBikeIds.size > 0) {
        bikes = bikes.filter(bike => favoriteBikeIds.has(bike.id));
      }

      return bikes;
    },
  });

  // Sort and paginate bikes
  const processedBikes = useMemo(() => {
    if (!bikesData) return [];

    let sorted = [...bikesData];

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        sorted.sort((a, b) => a.price_per_hour - b.price_per_hour);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.price_per_hour - a.price_per_hour);
        break;
      case 'type':
        sorted.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'availability':
        sorted.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));
        break;
      default: // name
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [bikesData, sortBy]);

  // Paginate results
  const paginatedBikes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedBikes.slice(startIndex, startIndex + itemsPerPage);
  }, [processedBikes, currentPage]);

  const totalPages = Math.ceil(processedBikes.length / itemsPerPage);

  // Handle favorite toggle
  const handleFavoriteToggle = async (bikeId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add bikes to your favorites.",
        variant: "destructive",
      });
      return;
    }

    const isFavorited = favoriteBikeIds.has(bikeId);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('bike_id', bikeId);

        if (error) throw error;

        setFavoriteBikeIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(bikeId);
          return newSet;
        });

        toast({
          title: "Removed from favorites",
          description: "Bike removed from your favorites.",
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, bike_id: bikeId }]);

        if (error) throw error;

        setFavoriteBikeIds(prev => new Set([...prev, bikeId]));

        toast({
          title: "Added to favorites",
          description: "Bike added to your favorites.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedLocation('all');
    setAvailabilityFilter('all');
    setSortBy('name');
    setShowFavoritesOnly(false);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Bikes</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Available Bikes</h1>
        <p className="text-lg text-muted-foreground">
          Find the perfect bike for your next adventure
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border p-6 mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bikes by name, type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Bike Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="mountain">Mountain</SelectItem>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name} - {location.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Availability Filter */}
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bikes</SelectItem>
              <SelectItem value="available">Available Now</SelectItem>
              <SelectItem value="unavailable">Currently Rented</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price_low">Price (Low to High)</SelectItem>
              <SelectItem value="price_high">Price (High to Low)</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="availability">Availability</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggle Controls */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
          {user && (
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              size="sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              My Favorites Only
            </Button>
          )}
          
          <Button variant="outline" onClick={clearFilters} size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>

          <div className="ml-auto text-sm text-muted-foreground">
            {processedBikes.length} bikes found
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
              <div className="aspect-video bg-muted rounded-lg mb-4"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : paginatedBikes.length > 0 ? (
        <>
          {/* Bikes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedBikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={{
                  id: bike.id,
                  name: bike.name,
                  type: bike.type,
                  price: bike.price_per_hour,
                  rating: 4.5, // Mock rating - you can add this to your schema later
                  reviews: Math.floor(Math.random() * 100) + 10, // Mock reviews
                  image: bike.image_url || '',
                  location: bike.locations ? `${bike.locations.name}, ${bike.locations.city}` : 'Unknown',
                  available: bike.available,
                  features: bike.features || [],
                  electric: bike.type === 'electric',
                  batteryLevel: bike.battery_level,
                }}
                isFavorited={favoriteBikeIds.has(bike.id)}
                onFavoriteToggle={() => handleFavoriteToggle(bike.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚴</div>
          <h3 className="text-xl font-semibold mb-2">No bikes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )}
    </div>
  );
};

export default Bikes;
