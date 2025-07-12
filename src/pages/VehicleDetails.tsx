
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LocationPicker from '@/components/LocationPicker';
import PaymentGateway from '@/components/PaymentGateway';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, MapPin, User, Zap, Star, Fuel, Settings, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  location: string;
  fuel_type: string;
  transmission: string;
  seating_capacity: number;
  mileage: number;
  engine_capacity: string;
  features: string[];
  availability: boolean;
  image_urls: string[];
  rating: number;
  pickup_locations: string[];
}

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [pickupLocation, setPickupLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get default image based on vehicle category
  const getDefaultImage = (vehicle: Vehicle) => {
    if (vehicle.image_urls && vehicle.image_urls.length > 0 && vehicle.image_urls[0]) {
      return vehicle.image_urls[0];
    }
    
    // Default images based on category
    if (vehicle.category === 'car') {
      if (vehicle.subcategory === '6-seater') {
        return 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop';
      }
      return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop';
    } else if (vehicle.category === 'bike') {
      if (vehicle.subcategory === 'sport') {
        return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop';
      } else if (vehicle.subcategory === 'scooter') {
        return 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop';
      }
      return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop';
    }
    
    // Fallback image
    return 'https://images.unsplash.com/photo-1494976688153-ca3ce29cd93b?w=600&h=400&fit=crop';
  };

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      console.log('Fetching vehicle with ID:', id);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched vehicle data:', data);
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      toast.error('Vehicle not found');
      navigate('/browse');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !vehicle) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * vehicle.price_per_day;
  };

  const getTotalDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleBookNow = () => {
    console.log('Book now clicked, user:', user);
    
    if (!user) {
      toast.error('Please sign in to book a vehicle');
      navigate('/auth');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    if (!pickupLocation) {
      console.log('No pickup location selected, showing picker');
      setShowLocationPicker(true);
      return;
    }

    console.log('All requirements met, showing payment gateway');
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      const bookingData = {
        user_id: user?.id,
        vehicle_id: id,
        start_date: format(startDate!, 'yyyy-MM-dd'),
        end_date: format(endDate!, 'yyyy-MM-dd'),
        pickup_location: pickupLocation,
        total_days: getTotalDays(),
        price_per_day: vehicle!.price_per_day,
        total_amount: calculateTotalPrice(),
        booking_status: 'confirmed',
        payment_status: 'paid'
      };

      console.log('Creating booking with data:', bookingData);

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) {
        console.error('Booking creation error:', error);
        throw error;
      }

      console.log('Booking created successfully');
      setShowPaymentGateway(false);
      setShowSuccessModal(true);
      toast.success('Booking confirmed successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/bookings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Vehicle not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Image */}
            <Card className="overflow-hidden animate-fade-in">
              <CardContent className="p-0">
                <img
                  src={getDefaultImage(vehicle)}
                  alt={vehicle.title}
                  className="w-full h-64 lg:h-96 object-cover hover:scale-105 transition-transform duration-500"
                />
              </CardContent>
            </Card>

            {/* Vehicle Info */}
            <Card className="animate-slide-in-from-bottom">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-navy">{vehicle.title}</CardTitle>
                    <p className="text-steel mt-1">{vehicle.brand} {vehicle.model} • {vehicle.year}</p>
                  </div>
                  <Badge variant={vehicle.availability ? "default" : "secondary"} className="animate-pulse">
                    {vehicle.availability ? 'Available' : 'Booked'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-steel">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {vehicle.location}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {vehicle.rating}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {vehicle.subcategory}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-steel mb-6">{vehicle.description}</p>
                
                {/* Vehicle Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center p-3 bg-secondary rounded-lg">
                    <Fuel className="h-5 w-5 mr-2 text-accent" />
                    <div>
                      <p className="text-sm text-steel">Fuel</p>
                      <p className="font-medium capitalize">{vehicle.fuel_type}</p>
                    </div>
                  </div>
                  
                  {vehicle.seating_capacity && (
                    <div className="flex items-center p-3 bg-secondary rounded-lg">
                      <User className="h-5 w-5 mr-2 text-accent" />
                      <div>
                        <p className="text-sm text-steel">Seats</p>
                        <p className="font-medium">{vehicle.seating_capacity}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center p-3 bg-secondary rounded-lg">
                    <Settings className="h-5 w-5 mr-2 text-accent" />
                    <div>
                      <p className="text-sm text-steel">Transmission</p>
                      <p className="font-medium capitalize">{vehicle.transmission}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary rounded-lg">
                    <Zap className="h-5 w-5 mr-2 text-accent" />
                    <div>
                      <p className="text-sm text-steel">Mileage</p>
                      <p className="font-medium">{vehicle.mileage} km/l</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-navy mb-3">Features & Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="bg-white">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 animate-slide-in-from-right">
              <CardHeader>
                <CardTitle className="text-center">
                  <span className="text-3xl font-bold text-navy">₹{vehicle.price_per_day}</span>
                  <span className="text-steel">/day</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Pickup Location
                  </label>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setShowLocationPicker(true)}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {pickupLocation || "Select pickup location"}
                  </Button>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Start Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    End Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Booking Summary */}
                {startDate && endDate && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-steel">
                      <span>Total days:</span>
                      <span>{getTotalDays()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-steel">
                      <span>Price per day:</span>
                      <span>₹{vehicle.price_per_day}</span>
                    </div>
                    <div className="flex justify-between font-bold text-navy text-lg">
                      <span>Total price:</span>
                      <span className="text-accent">₹{calculateTotalPrice()}</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 h-12 text-lg btn-animate"
                  onClick={handleBookNow}
                  disabled={!vehicle.availability}
                >
                  {vehicle.availability ? 'Book Now' : 'Not Available'}
                </Button>

                {/* Trust Indicators */}
                <div className="text-center text-sm text-steel space-y-1">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Instant Confirmation
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Free Cancellation
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Location Picker Modal */}
      <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose Pickup Location</DialogTitle>
          </DialogHeader>
          <LocationPicker
            onLocationSelect={(location) => {
              console.log('Location selected:', location);
              setPickupLocation(location);
              setShowLocationPicker(false);
            }}
            currentLocation={pickupLocation}
          />
        </DialogContent>
      </Dialog>

      {/* Payment Gateway */}
      {showPaymentGateway && startDate && endDate && (
        <PaymentGateway
          isOpen={showPaymentGateway}
          onClose={() => setShowPaymentGateway(false)}
          onPaymentSuccess={handlePaymentSuccess}
          bookingDetails={{
            vehicleTitle: vehicle.title,
            totalAmount: calculateTotalPrice(),
            startDate: format(startDate, 'PPP'),
            endDate: format(endDate, 'PPP'),
            totalDays: getTotalDays()
          }}
        />
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl text-navy">Booking Confirmed!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-steel">
              Your {vehicle.title} has been successfully booked!
            </p>
            {startDate && endDate && (
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-steel mb-2">Booking Details:</p>
                <p className="font-medium">{format(startDate, 'PPP')} to {format(endDate, 'PPP')}</p>
                <p className="text-accent font-bold">Total: ₹{calculateTotalPrice()}</p>
              </div>
            )}
            <Button 
              className="w-full bg-accent hover:bg-accent/90"
              onClick={handleSuccessClose}
            >
              View My Bookings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleDetails;
