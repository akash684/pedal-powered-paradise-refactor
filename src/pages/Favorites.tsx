
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import BikeCard from '@/components/BikeCard';
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

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: favoriteBikes, isLoading, error, refetch } = useQuery({
    queryKey: ['favorite-bikes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          bike_id,
          bikes (
            *,
            locations (
              name,
              city,
              state
            )
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data.map(item => item.bikes as Bike);
    },
    enabled: !!user,
  });

  const handleFavoriteToggle = async (bikeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('bike_id', bikeId);

      if (error) throw error;

      toast({
        title: "Removed from favorites",
        description: "Bike removed from your favorites.",
      });

      refetch();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
              <div className="aspect-video bg-muted rounded-lg mb-4"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Favorites</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">My Favorites</h1>
        <p className="text-lg text-muted-foreground">
          Your saved bikes for quick access
        </p>
      </div>

      {favoriteBikes && favoriteBikes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteBikes.map((bike) => (
            <BikeCard
              key={bike.id}
              bike={{
                id: bike.id,
                name: bike.name,
                type: bike.type,
                price: bike.price_per_hour,
                rating: 4.5, // Mock rating
                reviews: Math.floor(Math.random() * 100) + 10, // Mock reviews
                image: bike.image_url || '',
                location: bike.locations ? `${bike.locations.name}, ${bike.locations.city}` : 'Unknown',
                available: bike.available,
                features: bike.features || [],
                electric: bike.type === 'electric',
                batteryLevel: bike.battery_level,
              }}
              isFavorited={true}
              onFavoriteToggle={() => handleFavoriteToggle(bike.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-4">
            Start adding bikes to your favorites to see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
