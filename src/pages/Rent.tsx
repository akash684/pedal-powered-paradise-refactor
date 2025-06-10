
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Zap, Battery } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Bike {
  id: string;
  name: string;
  type: string;
  description: string;
  price_per_hour: number;
  available: boolean;
  battery_level: number | null;
  features: string[];
  locations?: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
  };
}

const Rent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const preselectedBikeId = searchParams.get('bikeId');

  // Form state
  const [selectedBikeId, setSelectedBikeId] = useState<string>(preselectedBikeId || '');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available bikes
  const { data: bikes, isLoading: bikesLoading } = useQuery({
    queryKey: ['available-bikes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bikes')
        .select(`
          *,
          locations (
            id,
            name,
            address,
            city,
            state
          )
        `)
        .eq('available', true)
        .order('name');
      
      if (error) throw error;
      return data as Bike[];
    },
  });

  // Get selected bike details
  const selectedBike = bikes?.find(bike => bike.id === selectedBikeId);

  // Check for existing rentals to prevent double booking
  const { data: existingRentals } = useQuery({
    queryKey: ['bike-rentals', selectedBikeId, startDate],
    queryFn: async () => {
      if (!selectedBikeId || !startDate) return [];
      
      const { data, error } = await supabase
        .from('rentals')
        .select('start_time, end_time')
        .eq('bike_id', selectedBikeId)
        .eq('status', 'active')
        .gte('end_time', `${startDate}T00:00:00`)
        .lte('start_time', `${startDate}T23:59:59`);
      
      if (error) throw error;
      return data;
    },
    enabled: !!(selectedBikeId && startDate),
  });

  // Calculate total price
  const totalPrice = selectedBike ? selectedBike.price_per_hour * parseInt(duration) : 0;

  // Calculate end time
  const getEndTime = () => {
    if (!startDate || !startTime) return '';
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(start.getTime() + parseInt(duration) * 60 * 60 * 1000);
    return end.toLocaleString();
  };

  // Check if selected time slot is available
  const isTimeSlotAvailable = () => {
    if (!existingRentals || !startDate || !startTime) return true;
    
    const requestedStart = new Date(`${startDate}T${startTime}`);
    const requestedEnd = new Date(requestedStart.getTime() + parseInt(duration) * 60 * 60 * 1000);
    
    return !existingRentals.some(rental => {
      const rentalStart = new Date(rental.start_time);
      const rentalEnd = new Date(rental.end_time);
      
      return (
        (requestedStart >= rentalStart && requestedStart < rentalEnd) ||
        (requestedEnd > rentalStart && requestedEnd <= rentalEnd) ||
        (requestedStart <= rentalStart && requestedEnd >= rentalEnd)
      );
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to rent a bike.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!selectedBikeId || !startDate || !startTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isTimeSlotAvailable()) {
      toast({
        title: "Time slot unavailable",
        description: "This bike is already rented during the selected time.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(duration) * 60 * 60 * 1000);

      const { error } = await supabase
        .from('rentals')
        .insert([{
          user_id: user.id,
          bike_id: selectedBikeId,
          location_id: selectedBike?.locations?.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          total_hours: parseInt(duration),
          total_price: totalPrice,
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Booking confirmed!",
        description: `Your bike rental has been confirmed for ${duration} hour${parseInt(duration) > 1 ? 's' : ''}.`,
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating rental:', error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your rental. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  if (bikesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Rent a Bike</h1>

        {/* Selected Bike Preview */}
        {selectedBike && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Selected Bike</span>
                {selectedBike.type === 'electric' && <Zap className="h-5 w-5 text-accent" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚴</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedBike.name}</h3>
                  <p className="text-muted-foreground mb-2">{selectedBike.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="secondary">{selectedBike.type}</Badge>
                    <span className="font-semibold text-primary">${selectedBike.price_per_hour}/hour</span>
                    {selectedBike.battery_level && (
                      <div className="flex items-center gap-1">
                        <Battery className="h-3 w-3" />
                        <span>{selectedBike.battery_level}%</span>
                      </div>
                    )}
                  </div>
                  {selectedBike.locations && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedBike.locations.name}, {selectedBike.locations.city}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rental Form */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bike Selection */}
              <div className="space-y-2">
                <Label htmlFor="bike">Select Bike *</Label>
                <Select value={selectedBikeId} onValueChange={setSelectedBikeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bike" />
                  </SelectTrigger>
                  <SelectContent>
                    {bikes?.map((bike) => (
                      <SelectItem key={bike.id} value={bike.id}>
                        <div className="flex items-center gap-2">
                          <span>{bike.name}</span>
                          <Badge variant="outline" className="text-xs">
                            ${bike.price_per_hour}/hr
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Rental Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={today}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Start Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours) *</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour} hour{hour > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rental Summary */}
              {selectedBike && startDate && startTime && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Rental Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Start:</span>
                      <span>{new Date(`${startDate}T${startTime}`).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>End:</span>
                      <span>{getEndTime()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{duration} hour{parseInt(duration) > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-primary">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {!isTimeSlotAvailable() && (
                    <div className="bg-destructive/10 text-destructive p-2 rounded text-sm">
                      ⚠️ This time slot is not available. Please choose a different time.
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !isTimeSlotAvailable() || !selectedBikeId}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Confirm Rental - $${totalPrice.toFixed(2)}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rent;
