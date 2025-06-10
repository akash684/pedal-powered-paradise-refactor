
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MapPin, Battery, Zap } from 'lucide-react';

interface BikeCardProps {
  bike: {
    id: string;
    name: string;
    type: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    location: string;
    available: boolean;
    features: string[];
    electric?: boolean;
    batteryLevel?: number;
  };
}

const BikeCard = ({ bike }: BikeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRent = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Renting bike:', bike.id);
    setIsLoading(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="group hover-lift bg-white border-0 shadow-lg overflow-hidden">
      <div className="relative">
        {/* Bike Image */}
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚴</span>
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {bike.electric && (
              <Badge className="bg-accent text-accent-foreground">
                <Zap className="h-3 w-3 mr-1" />
                Electric
              </Badge>
            )}
            {!bike.available && (
              <Badge variant="destructive">Unavailable</Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>

          {/* Battery Level for Electric Bikes */}
          {bike.electric && bike.batteryLevel && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <Battery className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium">{bike.batteryLevel}%</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {bike.name}
              </h3>
              <p className="text-sm text-muted-foreground">{bike.type}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-primary">
                ${bike.price}<span className="text-sm font-normal text-muted-foreground">/hour</span>
              </div>
            </div>
          </div>

          {/* Rating & Location */}
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{bike.rating}</span>
              <span className="text-muted-foreground">({bike.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{bike.location}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {bike.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {bike.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{bike.features.length - 3} more
              </Badge>
            )}
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleRent}
            disabled={!bike.available || isLoading}
            className={`w-full ${bike.available 
              ? 'gradient-primary text-white hover:opacity-90' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Booking...
              </div>
            ) : bike.available ? (
              'Rent Now'
            ) : (
              'Unavailable'
            )}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default BikeCard;
