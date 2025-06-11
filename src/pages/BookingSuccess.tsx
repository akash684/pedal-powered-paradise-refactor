
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, MapPin, User, CreditCard, Download, Home } from 'lucide-react';

interface BookingData {
  id: string;
  bikeName: string;
  fullName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  rentalDays: number;
  pricePerDay: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (bookingId) {
      // Retrieve booking data from localStorage
      const bookings = JSON.parse(localStorage.getItem('bikeBookings') || '[]');
      const booking = bookings.find((b: BookingData) => b.id === bookingId);
      
      if (booking) {
        setBookingData(booking);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [bookingId, navigate]);

  const downloadReceipt = () => {
    if (!bookingData) return;
    
    // Create a simple text receipt
    const receiptContent = `
BIKE RENTAL BOOKING RECEIPT
========================

Booking ID: ${bookingData.id}
Date: ${new Date(bookingData.createdAt).toLocaleDateString()}

BIKE DETAILS:
${bookingData.bikeName}
Rental Duration: ${bookingData.rentalDays} day(s)
Rate: ₹${bookingData.pricePerDay}/day

CUSTOMER DETAILS:
Name: ${bookingData.fullName}
Email: ${bookingData.email}
Phone: ${bookingData.phone}

PICKUP & DROP-OFF:
Pickup: ${bookingData.pickupLocation}
Drop-off: ${bookingData.dropoffLocation}

PAYMENT SUMMARY:
Subtotal: ₹${bookingData.pricePerDay * bookingData.rentalDays}
GST (18%): ₹${Math.round(bookingData.pricePerDay * bookingData.rentalDays * 0.18)}
Total Paid: ₹${bookingData.totalPrice}

Status: ${bookingData.status.toUpperCase()}

Thank you for choosing our bike rental service!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${bookingData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your bike rental has been successfully booked</p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Confirmed
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Booking ID: #{bookingData.id}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bike Info */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏍️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{bookingData.bikeName}</h3>
                <p className="text-sm text-muted-foreground">
                  {bookingData.rentalDays} day{bookingData.rentalDays > 1 ? 's' : ''} rental
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{bookingData.totalPrice}</p>
                <p className="text-sm text-muted-foreground">Total paid</p>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{bookingData.fullName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{bookingData.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">+91 {bookingData.phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Booking Date:</span>
                  <p className="font-medium">{new Date(bookingData.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Pickup & Drop-off
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Pickup Location:</span>
                  <p className="font-medium">{bookingData.pickupLocation}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Drop-off Location:</span>
                  <p className="font-medium">{bookingData.dropoffLocation}</p>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            {bookingData.startDate && bookingData.endDate && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Rental Period
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>
                    <p className="font-medium">{new Date(bookingData.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">End Date:</span>
                    <p className="font-medium">{new Date(bookingData.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Summary
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rate per day:</span>
                  <span>₹{bookingData.pricePerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of days:</span>
                  <span>{bookingData.rentalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{bookingData.pricePerDay * bookingData.rentalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{Math.round(bookingData.pricePerDay * bookingData.rentalDays * 0.18)}</span>
                </div>
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Total Paid:</span>
                  <span>₹{bookingData.totalPrice}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Please carry a valid driving license at the time of pickup</li>
              <li>• Security deposit may be required at pickup location</li>
              <li>• Fuel charges are not included in the rental price</li>
              <li>• Return the bike with the same fuel level as pickup</li>
              <li>• Late return charges may apply beyond the rental period</li>
              <li>• Contact us for any changes to your booking</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={downloadReceipt} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button onClick={() => navigate('/')} className="flex-1">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Need help? Contact us at <strong>support@bikerental.com</strong> or call <strong>+91 9876543210</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
