
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SearchPanel = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!pickupLocation.trim()) {
      toast.error('Please enter a pickup location');
      return;
    }

    // Create search parameters
    const searchParams = new URLSearchParams();
    if (pickupLocation) searchParams.set('location', pickupLocation);
    if (vehicleType) {
      searchParams.set('category', vehicleType);
    }
    if (startDate) searchParams.set('startDate', format(startDate, 'yyyy-MM-dd'));
    if (endDate) searchParams.set('endDate', format(endDate, 'yyyy-MM-dd'));

    // Navigate to browse page with search parameters
    navigate(`/browse?${searchParams.toString()}`);
    toast.success('Searching vehicles for you!');
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse geocode these coordinates
          const { latitude, longitude } = position.coords;
          console.log('Location detected:', latitude, longitude);
          
          // For demo purposes, set a default location
          setPickupLocation('Current Location - Hyderabad');
          toast.success('Location detected successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to detect location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 -mt-8 relative z-10 mx-4 lg:mx-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Pickup Location */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-navy mb-2">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-steel" />
            <Input
              placeholder="Enter city or area"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="pl-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1 text-xs text-accent hover:text-accent/80"
              onClick={handleLocationDetect}
            >
              Detect
            </Button>
          </div>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Vehicle Type
          </label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
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
                {startDate ? format(startDate, "PPP") : "Pick a date"}
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

        {/* End Date */}
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
                {endDate ? format(endDate, "PPP") : "Pick a date"}
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
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleSearch}
          size="lg" 
          className="bg-accent hover:bg-accent/90 px-8"
        >
          <Search className="mr-2 h-4 w-4" />
          Search Vehicles
        </Button>
      </div>
    </div>
  );
};

export default SearchPanel;
