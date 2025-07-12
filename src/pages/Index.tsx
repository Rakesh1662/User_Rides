import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchPanel from '@/components/SearchPanel';
import VehicleCard from '@/components/VehicleCard';
import AIAssistant from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, CheckCircle, Star, Percent, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  title: string;
  image_urls: string[];
  price_per_day: number;
  location: string;
  fuel_type: string;
  seating_capacity: number;
  rating: number;
  availability: boolean;
  category: string;
  subcategory: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [popularVehicles, setPopularVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularVehicles();
  }, []);

  const fetchPopularVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('availability', true)
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      setPopularVehicles(data || []);
    } catch (error) {
      console.error('Error fetching popular vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      icon: <Search className="h-8 w-8 text-accent" />,
      title: 'Search & Choose',
      description: 'Browse our wide selection of vehicles and find the perfect one for your needs'
    },
    {
      icon: <Calendar className="h-8 w-8 text-accent" />,
      title: 'Book & Pay',
      description: 'Select your dates, make a secure payment, and confirm your booking instantly'
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-accent" />,
      title: 'Pick Up & Go',
      description: 'Collect your vehicle from the designated location and start your journey'
    }
  ];

  const handleStartJourney = () => {
    navigate('/browse');
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  const handleViewAllVehicles = () => {
    navigate('/browse');
  };

  const handleClaimDiscount = () => {
    toast.success('Discount code: FIRST30 - Get 30% off on your first booking!');
    navigate('/browse');
  };

  const handleTryAIAssistant = () => {
    toast.success('AI Assistant activated! Click the bot icon to start chatting.');
    // The AI assistant is already visible as a floating button
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy to-steel text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse-scale"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Ride,
            <span className="text-accent block animate-bounce-gentle">Anytime, Anywhere</span>
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto animate-slide-in-from-bottom" style={{ animationDelay: '0.2s' }}>
            Discover the perfect vehicle for your journey with our enhanced platform. 
            Cars, bikes, and scooters available across Hyderabad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-from-bottom" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-lg px-8 py-3 btn-animate hover-lift"
              onClick={handleStartJourney}
            >
              Browse Vehicles
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-navy btn-animate"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Search Panel */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-in-from-bottom" style={{ animationDelay: '0.6s' }}>
        <SearchPanel />
      </section>

      {/* Popular Vehicles with Enhanced Layout */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Popular Vehicles
            </h2>
            <p className="text-xl text-steel max-w-2xl mx-auto">
              Discover our most booked vehicles, loved by thousands of customers across Hyderabad
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularVehicles.map((vehicle, index) => (
                <div 
                  key={vehicle.id}
                  className="animate-slide-in-from-bottom hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VehicleCard 
                    id={vehicle.id}
                    title={vehicle.title}
                    image={vehicle.image_urls[0] || 'https://images.unsplash.com/photo-1494976688153-ca3ce29cd93b?w=400&h=300&fit=crop'}
                    price={vehicle.price_per_day}
                    location={vehicle.location}
                    category={vehicle.category as 'car' | 'bike'}
                    subcategory={vehicle.subcategory}
                    fuelType={vehicle.fuel_type}
                    seatingCapacity={vehicle.seating_capacity}
                    rating={vehicle.rating}
                    isAvailable={vehicle.availability}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-white btn-animate hover-lift"
              onClick={handleViewAllVehicles}
            >
              View All Vehicles
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              How It Works
            </h2>
            <p className="text-xl text-steel max-w-2xl mx-auto">
              Get on the road in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card 
                key={index} 
                className="text-center p-8 hover:shadow-lg transition-all duration-500 hover:scale-105 animate-slide-in-from-bottom hover-lift"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="pt-6">
                  <div className="mb-6 flex justify-center animate-bounce-gentle" style={{ animationDelay: `${index * 0.3}s` }}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-4">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-steel">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Promotions Banner */}
      <section className="py-16 bg-gradient-to-r from-accent to-accent/80 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse-scale"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/20 rounded-full animate-float"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4 animate-fade-in">
            <Percent className="h-8 w-8 mr-3 animate-bounce-gentle" />
            <h2 className="text-3xl lg:text-4xl font-bold">
              Special Offers
            </h2>
          </div>
          <p className="text-xl mb-6 text-white/90 animate-slide-in-from-bottom" style={{ animationDelay: '0.2s' }}>
            Get up to 30% off on your first booking! Limited time offer for new users.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-accent btn-animate hover-lift animate-slide-in-from-bottom"
            onClick={handleClaimDiscount}
            style={{ animationDelay: '0.4s' }}
          >
            Claim Your Discount
          </Button>
        </div>
      </section>

      {/* Enhanced AI Assistant Feature Highlight */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy to-steel rounded-2xl p-8 lg:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-5 left-5 w-20 h-20 bg-accent/20 rounded-full animate-float"></div>
            <div className="absolute bottom-5 right-5 w-16 h-16 bg-white/10 rounded-full animate-pulse-scale"></div>
            
            <div className="relative max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">
                Meet Your AI Travel Assistant
              </h2>
              <p className="text-xl mb-8 text-white/90 animate-slide-in-from-bottom" style={{ animationDelay: '0.2s' }}>
                Get personalized recommendations, instant support, and smart suggestions 
                powered by Gemini AI. Just ask!
              </p>
              <div className="glass rounded-lg p-6 mb-8 animate-slide-in-from-bottom" style={{ animationDelay: '0.4s' }}>
                <p className="text-lg italic">
                  "Find me a family car under ₹4000 near Gachibowli for the weekend"
                </p>
              </div>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 btn-animate hover-lift animate-slide-in-from-bottom"
                onClick={handleTryAIAssistant}
                style={{ animationDelay: '0.6s' }}
              >
                Try AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Namma Rides</h3>
              <p className="text-white/80">
                Your trusted partner for vehicle rentals across Hyderabad.
              </p>
              <div className="mt-4">
                <Badge variant="outline" className="text-white border-white">
                  Hyderabad Based
                </Badge>
              </div>
            </div>
            <div className="animate-slide-in-from-bottom" style={{ animationDelay: '0.1s' }}>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/80">
                <li><button onClick={() => navigate('/about')} className="hover:text-accent transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('/browse')} className="hover:text-accent transition-colors">Browse Vehicles</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-accent transition-colors">My Account</button></li>
                <li><button onClick={handleTryAIAssistant} className="hover:text-accent transition-colors">AI Assistant</button></li>
              </ul>
            </div>
            <div className="animate-slide-in-from-bottom" style={{ animationDelay: '0.2s' }}>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-white/80">
                <li><button onClick={() => navigate('/browse?category=car&subcategory=4-seater')} className="hover:text-accent transition-colors">4-Seater Cars</button></li>
                <li><button onClick={() => navigate('/browse?category=car&subcategory=6-seater')} className="hover:text-accent transition-colors">6-Seater Cars</button></li>
                <li><button onClick={() => navigate('/browse?category=bike&subcategory=sport')} className="hover:text-accent transition-colors">Sport Bikes</button></li>
                <li><button onClick={() => navigate('/browse?category=bike&subcategory=scooter')} className="hover:text-accent transition-colors">Scooters</button></li>
              </ul>
            </div>
            <div className="animate-slide-in-from-bottom" style={{ animationDelay: '0.3s' }}>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +91 12345 67890
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  seshaallamraju08@gmail.com
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Hyderabad, India
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p>&copy; 2024 Namma Rides. All rights reserved. Made with ❤️ in Hyderabad</p>
          </div>
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
};

export default Index;
