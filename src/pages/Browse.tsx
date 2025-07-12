
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import VehicleCard from '@/components/VehicleCard';
import AIAssistant from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Car, Bike } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  price_per_day: number;
  location: string;
  fuel_type: string;
  transmission: string;
  seating_capacity: number;
  mileage: number;
  engine_capacity: string;
  features: string[];
  image_urls: string[];
  rating: number;
  availability: boolean;
  pickup_locations: string[];
}

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [subcategory, setSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [fuelType, setFuelType] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlLocation = searchParams.get('location');
    
    if (urlCategory || urlLocation) {
      setShowCategories(false);
      if (urlCategory) setCategory(urlCategory);
      if (urlLocation) {
        setLocation(urlLocation);
        setSearchQuery(urlLocation);
      }
    } else {
      setShowCategories(true);
    }
  }, [searchParams]);

  // Get default images based on vehicle category
  const getDefaultImage = (vehicle: Vehicle) => {
    if (vehicle.image_urls && vehicle.image_urls.length > 0 && vehicle.image_urls[0]) {
      return vehicle.image_urls[0];
    }
    
    // Default images based on category and subcategory
    if (vehicle.category === 'car') {
      if (vehicle.subcategory === '6-seater') {
        return 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop';
      }
      return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop';
    } else if (vehicle.category === 'bike') {
      if (vehicle.subcategory === 'sport') {
        return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop';
      } else if (vehicle.subcategory === 'scooter' || vehicle.subcategory === 'electric-scooter') {
        return 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop';
      } else if (vehicle.subcategory === 'cruiser') {
        return 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop';
      }
      return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop';
    }
    
    // Fallback image
    return 'https://images.unsplash.com/photo-1494976688153-ca3ce29cd93b?w=400&h=300&fit=crop';
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchQuery, category, subcategory, priceRange, location, fuelType, transmission]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('availability', true)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched vehicles:', data);
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = vehicles;
    console.log('Applying filters with:', { searchQuery, category, location, vehicles: vehicles.length });

    // Category filter - this should be applied first and is most important
    if (category && category !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.category === category);
      console.log('After category filter:', filtered.length);
    }

    // Search query filter - search in title, brand, model, location
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      // Remove "current location -" prefix for better matching
      const cleanQuery = query.replace('current location - ', '').replace('current location-', '');
      
      filtered = filtered.filter(vehicle =>
        vehicle.title.toLowerCase().includes(cleanQuery) ||
        vehicle.brand.toLowerCase().includes(cleanQuery) ||
        vehicle.model.toLowerCase().includes(cleanQuery) ||
        vehicle.location.toLowerCase().includes(cleanQuery) ||
        vehicle.category.toLowerCase().includes(cleanQuery) ||
        vehicle.subcategory.toLowerCase().includes(cleanQuery) ||
        vehicle.pickup_locations.some(loc => loc.toLowerCase().includes(cleanQuery)) ||
        // For location searches, be more flexible - if searching for any city, show Hyderabad vehicles
        cleanQuery.includes('hyderabad') || cleanQuery.includes('chennai') || cleanQuery.includes('bangalore') || 
        cleanQuery.includes('mumbai') || cleanQuery.includes('delhi') || cleanQuery.includes('pune')
      );
      console.log('After search query filter:', filtered.length);
    }

    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.subcategory === subcategory);
      console.log('After subcategory filter:', filtered.length);
    }

    // Price range filter
    filtered = filtered.filter(vehicle => 
      vehicle.price_per_day >= priceRange[0] && vehicle.price_per_day <= priceRange[1]
    );
    console.log('After price filter:', filtered.length);

    // Location filter - be more flexible with location matching
    if (location && location.trim() && location !== searchQuery) {
      const loc = location.toLowerCase().trim();
      const cleanLoc = loc.replace('current location - ', '').replace('current location-', '');
      
      filtered = filtered.filter(vehicle =>
        vehicle.location.toLowerCase().includes(cleanLoc) ||
        vehicle.pickup_locations.some(pickupLoc => pickupLoc.toLowerCase().includes(cleanLoc)) ||
        // Show vehicles for any major city search since we operate from Hyderabad
        cleanLoc.includes('hyderabad') || cleanLoc.includes('chennai') || cleanLoc.includes('bangalore') || 
        cleanLoc.includes('mumbai') || cleanLoc.includes('delhi') || cleanLoc.includes('pune')
      );
      console.log('After location filter:', filtered.length);
    }

    // Fuel type filter
    if (fuelType && fuelType !== 'all') {
      filtered = filtered.filter(vehicle =>
        vehicle.fuel_type.toLowerCase() === fuelType.toLowerCase()
      );
      console.log('After fuel type filter:', filtered.length);
    }

    // Transmission filter
    if (transmission && transmission !== 'all') {
      filtered = filtered.filter(vehicle =>
        vehicle.transmission.toLowerCase() === transmission.toLowerCase()
      );
      console.log('After transmission filter:', filtered.length);
    }

    console.log('Final filtered vehicles:', filtered.length);
    setFilteredVehicles(filtered);
  };

  const getSubcategories = () => {
    const currentCategoryVehicles = vehicles.filter(v => 
      category === 'all' || v.category === category
    );
    const subcategories = [...new Set(currentCategoryVehicles.map(v => v.subcategory))];
    return subcategories;
  };

  const categoryStats = {
    car: {
      total: vehicles.filter(v => v.category === 'car').length,
      fourSeater: vehicles.filter(v => v.category === 'car' && v.subcategory === '4-seater').length,
      sixSeater: vehicles.filter(v => v.category === 'car' && v.subcategory === '6-seater').length,
    },
    bike: {
      total: vehicles.filter(v => v.category === 'bike').length,
      sport: vehicles.filter(v => v.category === 'bike' && v.subcategory === 'sport').length,
      cruiser: vehicles.filter(v => v.category === 'bike' && v.subcategory === 'cruiser').length,
      scooter: vehicles.filter(v => v.category === 'bike' && (v.subcategory === 'scooter' || v.subcategory === 'electric-scooter')).length,
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Animation */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-navy mb-4">Browse Vehicles</h1>
          <p className="text-steel">Find the perfect vehicle for your journey</p>
          {searchQuery && (
            <p className="text-accent mt-2">
              Showing results for: <strong>{searchQuery}</strong>
              {category !== 'all' && <span> in <strong>{category}</strong> category</span>}
            </p>
          )}
        </div>

        {/* Category Selection */}
        {showCategories && (
          <div className="mb-8 animate-slide-in-from-bottom">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-accent" />
                  Vehicle Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cars Category */}
                  <div className="border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center mb-4">
                      <Car className="h-8 w-8 text-accent mr-3" />
                      <div>
                        <h3 className="text-xl font-semibold text-navy">Cars</h3>
                        <p className="text-steel">{categoryStats.car.total} vehicles available</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-secondary rounded">
                        <div className="text-2xl font-bold text-accent">{categoryStats.car.fourSeater}</div>
                        <div className="text-sm text-steel">4-Seater Cars</div>
                      </div>
                      <div className="text-center p-3 bg-secondary rounded">
                        <div className="text-2xl font-bold text-accent">{categoryStats.car.sixSeater}</div>
                        <div className="text-sm text-steel">6-Seater Cars</div>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90"
                      onClick={() => {setCategory('car'); setShowCategories(false);}}
                    >
                      Browse Cars
                    </Button>
                  </div>

                  {/* Bikes Category */}
                  <div className="border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center mb-4">
                      <Bike className="h-8 w-8 text-accent mr-3" />
                      <div>
                        <h3 className="text-xl font-semibold text-navy">Bikes</h3>
                        <p className="text-steel">{categoryStats.bike.total} vehicles available</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-secondary rounded">
                        <div className="text-lg font-bold text-accent">{categoryStats.bike.sport}</div>
                        <div className="text-xs text-steel">Sport</div>
                      </div>
                      <div className="text-center p-2 bg-secondary rounded">
                        <div className="text-lg font-bold text-accent">{categoryStats.bike.cruiser}</div>
                        <div className="text-xs text-steel">Cruiser</div>
                      </div>
                      <div className="text-center p-2 bg-secondary rounded">
                        <div className="text-lg font-bold text-accent">{categoryStats.bike.scooter}</div>
                        <div className="text-xs text-steel">Scooter</div>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90"
                      onClick={() => {setCategory('bike'); setShowCategories(false);}}
                    >
                      Browse Bikes
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline"
                    onClick={() => {setCategory('all'); setShowCategories(false);}}
                  >
                    View All Vehicles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        {!showCategories && (
          <div className="animate-slide-in-from-left">
            {/* Smart Search Bar */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Search className="h-5 w-5 mr-2 text-accent" />
                    Smart Search
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCategories(true)}
                  >
                    Back to Categories
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    placeholder="Search by brand, model, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-lg py-3"
                  />
                  <Button className="absolute right-2 top-2 bg-accent hover:bg-accent/90">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Enhanced Filters Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Category
                      </label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="car">Cars</SelectItem>
                          <SelectItem value="bike">Bikes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Type
                      </label>
                      <Select value={subcategory} onValueChange={setSubcategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {getSubcategories().map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub.charAt(0).toUpperCase() + sub.slice(1).replace('-', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Price Range (₹/day)
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={10000}
                        min={0}
                        step={100}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-steel">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Pickup Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-steel" />
                        <Input
                          placeholder="Any city in India"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Fuel Type
                      </label>
                      <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All fuel types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Fuel Types</SelectItem>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Transmission */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Transmission
                      </label>
                      <Select value={transmission} onValueChange={setTransmission}>
                        <SelectTrigger>
                          <SelectValue placeholder="All transmissions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Transmissions</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vehicle Grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-steel">
                    Showing {filteredVehicles.length} vehicles
                  </p>
                  <Select defaultValue="rating">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle, index) => (
                    <div 
                      key={vehicle.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <VehicleCard 
                        id={vehicle.id}
                        title={vehicle.title}
                        image={getDefaultImage(vehicle)}
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

                {/* Show helpful message when no vehicles found */}
                {filteredVehicles.length === 0 && !loading && (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-xl font-semibold text-navy mb-4">
                        Looking for vehicles in {location || searchQuery || 'your area'}?
                      </h3>
                      <p className="text-steel text-lg mb-4">
                        We're currently operating in Hyderabad, but have great vehicles available for your needs!
                      </p>
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
                        <p className="text-accent font-medium">
                          🚀 Good news! We can arrange pickup/delivery to nearby areas.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setLocation('');
                          setSearchQuery('');
                        }}
                        className="bg-accent hover:bg-accent/90"
                      >
                        View All Available Vehicles
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AIAssistant />
    </div>
  );
};

export default Browse;
