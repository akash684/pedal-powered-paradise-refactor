
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CreditCard, User, MapPin, Bike, Phone, Mail, Calendar as CalendarIcon } from 'lucide-react';

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

  // Indian cities for pickup/dropoff
  const indianCities = [
    'Chennai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Kochi', 
    'Pune', 'Kolkata', 'Mumbai', 'Jaipur', 'Ahmedabad'
  ];

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
  const securityDeposit = Math.round(pricePerDay * 0.5); // 50% of daily rate as security
  const finalTotal = totalPrice + gst + securityDeposit;

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
    
    // Format phone number (allow only digits, max 10)
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
      return;
    }
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
      if (digitsOnly.length <= 16) {
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    // Format expiry date (MM/YY)
    if (name === 'expiryDate') {
      const digitsOnly = value.replace(/\D/g, '');
      let formatted = digitsOnly;
      if (digitsOnly.length >= 2) {
        formatted = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4);
      }
      if (digitsOnly.length <= 4) {
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    // CVV (3 digits only)
    if (name === 'cvv') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 3) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Phone validation (Indian mobile numbers)
    if (formData.phone.length !== 10 || !formData.phone.match(/^[6-9]/)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian mobile number starting with 6-9",
        variant: "destructive"
      });
      return false;
    }

    // Card validation
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
      // Simulate payment processing with Razorpay (would integrate actual Razorpay here)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save booking details
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
        paymentMethod: 'razorpay',
        securityDeposit,
        gst,
        createdAt: new Date().toISOString()
      };

      // Store in localStorage (in production, this would go to Supabase/Firebase)
      const existingBookings = JSON.parse(localStorage.getItem('bikeBookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('bikeBookings', JSON.stringify(existingBookings));

      toast({
        title: "Payment Successful! 🎉",
        description: `Your booking for ${bikeName} has been confirmed. Security deposit of ₹${securityDeposit} will be refunded after return.`,
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
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground text-center">Secure payment powered by Indian payment gateways</p>
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
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <div className="flex">
                        <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                          <span className="text-sm">+91</span>
                        </div>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          className="rounded-l-none pl-3"
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Pickup & Drop-off Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupLocation">Pickup City *</Label>
                      <Select value={formData.pickupLocation} onValueChange={(value) => handleSelectChange('pickupLocation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pickup city" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianCities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dropoffLocation">Drop-off City *</Label>
                      <Select value={formData.dropoffLocation} onValueChange={(value) => handleSelectChange('dropoffLocation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select drop-off city" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianCities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                  <p className="text-sm text-muted-foreground">Secure payment with 256-bit SSL encryption</p>
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
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay ₹{finalTotal} Securely
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
                    <CalendarIcon className="h-4 w-4" />
                    <span>{rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
                  </div>
                  {startDate && endDate && (
                    <div className="text-sm text-muted-foreground">
                      {new Date(startDate).toLocaleDateString('en-IN')} - {new Date(endDate).toLocaleDateString('en-IN')}
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
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Security Deposit</span>
                    <span>₹{securityDeposit}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₹{finalTotal}</span>
                </div>

                <div className="text-xs text-muted-foreground mt-4 space-y-1">
                  <p>• Security deposit refunded after bike return</p>
                  <p>• Valid driving license required at pickup</p>
                  <p>• Fuel charges not included</p>
                  <p>• Free cancellation up to 2 hours before pickup</p>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    🛡️ Your payment is secured with bank-level encryption
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

export default Payment;
