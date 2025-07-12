
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Car } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  vehicles: {
    id: string;
    title: string;
    location: string;
    vehicle_type: string;
    image_urls: string[];
    price_per_day: number;
  };
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicles (
            id,
            title,
            location,
            vehicle_type,
            image_urls,
            price_per_day
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading your bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-navy mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-16 w-16 mx-auto text-steel mb-4" />
              <h3 className="text-xl font-semibold text-navy mb-2">No bookings yet</h3>
              <p className="text-steel mb-6">Start exploring our vehicles and make your first booking!</p>
              <Button onClick={() => navigate('/browse')} className="bg-accent hover:bg-accent/90">
                Browse Vehicles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="md:flex">
                    <div className="md:w-48">
                      <img
                        src={booking.vehicles.image_urls[0] || 'https://images.unsplash.com/photo-1494976688153-ca3ce29cd93b?w=300&h=200&fit=crop'}
                        alt={booking.vehicles.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-navy mb-2">
                            {booking.vehicles.title}
                          </h3>
                          <div className="flex items-center text-steel mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.vehicles.location}
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {booking.vehicles.vehicle_type}
                          </Badge>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-accent" />
                          <div>
                            <p className="text-sm text-steel">Start Date</p>
                            <p className="font-medium">{new Date(booking.start_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-accent" />
                          <div>
                            <p className="text-sm text-steel">End Date</p>
                            <p className="font-medium">{new Date(booking.end_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-steel">Total Price</p>
                          <p className="text-xl font-bold text-navy">₹{booking.total_price}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/vehicle/${booking.vehicles.id}`)}
                        >
                          View Details
                        </Button>
                        {booking.status === 'pending' && (
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                        {booking.status === 'completed' && (
                          <Button
                            className="bg-accent hover:bg-accent/90"
                            onClick={() => navigate(`/vehicle/${booking.vehicles.id}`)}
                          >
                            Book Again
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
