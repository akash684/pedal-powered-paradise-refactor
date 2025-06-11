
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CreditCard, User, MapPin, Bike, IndianRupee } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Get bike details from URL params
  const bikeId = searchParams.get('bikeId');
  const bikeName = searchParams.get('bikeName') || 'Selected Bike';
  const pricePerDay = parseInt(searchParams.get('pricePerDay') || '500');
  const rentalDays = parseInt(searchParams.get('days') || '1');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    pickupLocation: '',
    dropoffLocation: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = pricePerDay * rentalDays;
  const gst = Math.round(totalPrice * 0.18);
  const finalTotal = totalPrice + gst;

  useEffect(() => {
    if (!bikeId) {
      toast({
        title: "No bike selected",
        description: "Please select a bike first.",
        variant: "destructive"
      });
      navigate('/bikes');
    }
  }, [bikeId, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'pickupLocation', 'dropoffLocation', 'cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        toast({
          title: "Missing Information",
          description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit Indian mobile number",
        variant: "destructive"
      });
      return false;
    }

    // Card number validation (basic)
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save booking details (in real app, this would go to database)
      const bookingData = {
        id: Date.now().toString(),
        bikeId,
        bikeName,
        ...formData,
        rentalDays,
        pricePerDay,
        totalPrice: finalTotal,
        startDate,
        endDate,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Store in localStorage for demo purposes
      const existingBookings = JSON.parse(localStorage.getItem('bikeBookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('bikeBookings', JSON.stringify(existingBookings));

      toast({
        title: "Payment Successful!",
        description: `Your booking for ${bikeName} has been confirmed.`,
      });

      // Navigate to success page
      navigate(`/booking-success?bookingId=${bookingData.id}`);

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground text-center">Fill in your details to confirm your bike rental</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Pickup & Drop-off
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="pickupLocation">Pickup Location *</Label>
                    <Input
                      id="pickupLocation"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      placeholder="Enter pickup address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dropoffLocation">Drop-off Location *</Label>
                    <Input
                      id="dropoffLocation"
                      name="dropoffLocation"
                      value={formData.dropoffLocation}
                      onChange={handleInputChange}
                      placeholder="Enter drop-off address"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="nameOnCard">Name on Card *</Label>
                    <Input
                      id="nameOnCard"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      placeholder="Name as on card"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </div>
                ) : (
                  <>
                    <IndianRupee className="h-5 w-5 mr-2" />
                    Pay ₹{finalTotal}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bike className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{bikeName}</h3>
                  <Badge variant="secondary" className="mt-1">Selected Bike</Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
                  </div>
                  {startDate && endDate && (
                    <div className="text-sm text-muted-foreground">
                      {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rate per day</span>
                    <span>₹{pricePerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days</span>
                    <span>{rentalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>GST (18%)</span>
                    <span>₹{gst}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>

                <div className="text-xs text-muted-foreground mt-4">
                  <p>• Security deposit may be required at pickup</p>
                  <p>• Valid driving license required</p>
                  <p>• Fuel charges not included</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
