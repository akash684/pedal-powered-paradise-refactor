
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

const BikeCard = ({ bike, isFavorited = false, onFavoriteToggle }: BikeCardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRent = () => {
    if (!bike.available) return;
    navigate(`/rent?bikeId=${bike.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'electric':
        return 'bg-accent text-accent-foreground';
      case 'mountain':
        return 'bg-green-500 text-white';
      case 'city':
        return 'bg-blue-500 text-white';
      case 'hybrid':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="group hover-lift bg-card border overflow-hidden h-full flex flex-col">
      <div className="relative">
        {/* Bike Image */}
        <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
          {bike.image ? (
            <img 
              src={bike.image} 
              alt={bike.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🚴</span>
              </div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className={getTypeColor(bike.type)}>
              {bike.electric && <Zap className="h-3 w-3 mr-1" />}
              {bike.type.charAt(0).toUpperCase() + bike.type.slice(1)}
            </Badge>
            {!bike.available && (
              <Badge variant="destructive">Unavailable</Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8 p-0"
          >
            <Heart 
              className={`h-4 w-4 ${
                isFavorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-muted-foreground hover:text-red-500'
              }`} 
            />
          </Button>

          {/* Battery Level for Electric Bikes */}
          {bike.electric && bike.batteryLevel && (
            <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <Battery className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium">{bike.batteryLevel}%</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {bike.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">{bike.type}</p>
          </div>
          <div className="text-right ml-2">
            <div className="font-bold text-lg text-primary">
              ${bike.price}<span className="text-sm font-normal text-muted-foreground">/hr</span>
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
          <div className="flex items-center gap-1 text-muted-foreground min-w-0">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{bike.location}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4 flex-1">
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
              Loading...
            </div>
          ) : bike.available ? (
            'Rent Now'
          ) : (
            'Unavailable'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BikeCard;
