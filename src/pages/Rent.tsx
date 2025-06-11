
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock, MapPin, Bike, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Rent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Get bike details from URL params
  const bikeId = searchParams.get('bikeId');
  const bikeName = searchParams.get('bikeName') || 'Selected Bike';
  const pricePerDay = parseInt(searchParams.get('pricePerDay') || '500');

  const [rentalData, setRentalData] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    startTime: '09:00',
    endTime: '18:00',
    days: 1
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!bikeId) {
      toast({
        title: "No bike selected",
        description: "Please select a bike from the bikes page.",
        variant: "destructive"
      });
      navigate('/bikes');
    }
  }, [bikeId, navigate, toast]);

  useEffect(() => {
    // Calculate days when dates change
    if (rentalData.startDate && rentalData.endDate) {
      const diffTime = Math.abs(rentalData.endDate.getTime() - rentalData.startDate.getTime());
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setRentalData(prev => ({ ...prev, days: diffDays }));
    }
  }, [rentalData.startDate, rentalData.endDate]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRentalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!rentalData.startDate || !rentalData.endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates.",
        variant: "destructive"
      });
      return false;
    }

    if (rentalData.startDate < today) {
      toast({
        title: "Invalid start date",
        description: "Start date cannot be in the past.",
        variant: "destructive"
      });
      return false;
    }

    if (rentalData.endDate < rentalData.startDate) {
      toast({
        title: "Invalid end date",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateDates()) return;

    setIsLoading(true);

    // Simulate availability check
    setTimeout(() => {
      setIsLoading(false);
      
      // Navigate to payment page with all details
      const params = new URLSearchParams({
        bikeId: bikeId!,
        bikeName,
        pricePerDay: pricePerDay.toString(),
        days: rentalData.days.toString(),
        startDate: rentalData.startDate!.toISOString(),
        endDate: rentalData.endDate!.toISOString()
      });

      navigate(`/payment?${params.toString()}`);
    }, 1000);
  };

  const totalPrice = pricePerDay * rentalData.days;
  const gst = Math.round(totalPrice * 0.18);
  const securityDeposit = Math.round(pricePerDay * 0.5);
  const finalTotal = totalPrice + gst + securityDeposit;

  // Set minimum date to today
  const today = new Date();

  // Popular pickup locations in India
  const pickupLocations = [
    'Chennai Central - Express Avenue Mall',
    'Bengaluru Koramangala - Forum Mall',
    'Delhi Connaught Place - Rajiv Chowk Metro',
    'Hyderabad Banjara Hills - GVK One Mall',
    'Kochi Marine Drive - High Court Junction',
    'Pune FC Road - Fergusson College',
    'Kolkata Park Street - Park Hotel',
    'Mumbai Bandra West - Hill Road'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Book Your Bike</h1>
          <p className="text-muted-foreground text-center">Select your rental period and confirm booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rental Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Rental Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Bike */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bike className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{bikeName}</h3>
                      <p className="text-blue-600 font-medium">₹{pricePerDay}/day</p>
                    </div>
                  </div>
                </div>

                {/* Date Selection with Calendar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !rentalData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {rentalData.startDate ? format(rentalData.startDate, "PPP") : "Pick start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={rentalData.startDate || undefined}
                          onSelect={(date) => setRentalData(prev => ({ ...prev, startDate: date || null }))}
                          disabled={(date) => date < today}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !rentalData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {rentalData.endDate ? format(rentalData.endDate, "PPP") : "Pick end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={rentalData.endDate || undefined}
                          onSelect={(date) => setRentalData(prev => ({ ...prev, endDate: date || null }))}
                          disabled={(date) => date < (rentalData.startDate || today)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Pickup Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={rentalData.startTime}
                      onChange={handleTimeChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Return Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={rentalData.endTime}
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>

                {/* Duration Display */}
                {rentalData.days > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        Rental Duration: {rentalData.days} day{rentalData.days > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}

                {/* Important Notes */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Valid Indian driving license required at pickup</li>
                    <li>• Security deposit will be refunded after bike return</li>
                    <li>• Fuel charges not included in rental price</li>
                    <li>• Late return charges: ₹50 per hour after grace period</li>
                    <li>• Free helmet and basic insurance included</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  disabled={isLoading || !rentalData.startDate || !rentalData.endDate}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Checking Availability...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Rate per day</span>
                    <span>₹{pricePerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of days</span>
                    <Badge variant="secondary">{rentalData.days}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>GST (18%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Security Deposit</span>
                    <span>₹{securityDeposit}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{finalTotal}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Security deposit refundable)
                  </p>
                </div>

                {/* Pickup Locations */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Available Pickup Locations
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {pickupLocations.slice(0, 4).map((location, index) => (
                      <li key={index}>• {location}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    + 4 more locations across India
                  </p>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    🎉 Special Offer: Book for 3+ days and get 10% discount!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rent;
