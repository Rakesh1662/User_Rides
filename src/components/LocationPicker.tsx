
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Search } from 'lucide-react';
import { toast } from 'sonner';

interface LocationPickerProps {
  onLocationSelect: (location: string, coordinates?: { lat: number; lng: number }) => void;
  currentLocation?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, currentLocation }) => {
  const [searchLocation, setSearchLocation] = useState(currentLocation || '');
  const [isDetecting, setIsDetecting] = useState(false);

  const predefinedLocations = [
    'Hyderabad City Center',
    'Secunderabad Railway Station',
    'Rajiv Gandhi International Airport',
    'Gachibowli Tech City',
    'HITEC City, Madhapur',
    'Banjara Hills',
    'Jubilee Hills',
    'Kondapur',
    'Kukatpally',
    'Ameerpet',
    'Dilsukhnagar',
    'LB Nagar'
  ];

  const handleCurrentLocation = useCallback(() => {
    setIsDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // In a real implementation, you would use a geocoding service
            // For demo purposes, we'll use a mock location
            const mockLocation = 'Current Location (Hyderabad)';
            setSearchLocation(mockLocation);
            onLocationSelect(mockLocation, { lat: latitude, lng: longitude });
            toast.success('Current location detected successfully!');
          } catch (error) {
            console.error('Geocoding error:', error);
            toast.error('Could not determine address. Please select manually.');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to access location. Please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
    
    setIsDetecting(false);
  }, [onLocationSelect]);

  const handleLocationSelect = (location: string) => {
    setSearchLocation(location);
    onLocationSelect(location);
    toast.success(`Location set to ${location}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      onLocationSelect(searchLocation.trim());
      toast.success(`Location set to ${searchLocation}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-accent" />
          Select Pickup Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleCurrentLocation}
          disabled={isDetecting}
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isDetecting ? 'Detecting...' : 'Use Current Location'}
        </Button>

        {/* Search Location */}
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-steel" />
            <Input
              placeholder="Search for a location in Hyderabad"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            Set Location
          </Button>
        </form>

        {/* Predefined Locations */}
        <div>
          <h4 className="font-medium text-navy mb-3">Popular Pickup Locations</h4>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {predefinedLocations.map((location) => (
              <Button
                key={location}
                variant="ghost"
                className="justify-start text-left h-auto p-3 hover:bg-secondary"
                onClick={() => handleLocationSelect(location)}
              >
                <MapPin className="h-4 w-4 mr-2 text-accent flex-shrink-0" />
                <span className="text-sm">{location}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationPicker;
