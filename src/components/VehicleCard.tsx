
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Zap, Star, Fuel, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VehicleCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  location: string;
  category: 'car' | 'bike';
  subcategory: string;
  fuelType: string;
  seatingCapacity?: number;
  rating: number;
  isAvailable: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  title,
  image,
  price,
  location,
  category,
  subcategory,
  fuelType,
  seatingCapacity,
  rating,
  isAvailable
}) => {
  // Map subcategory to display type for bikes
  const getVehicleTypeDisplay = () => {
    if (category === 'car') {
      return subcategory;
    } else if (category === 'bike') {
      // Map bike subcategories to user-friendly names
      switch (subcategory) {
        case 'sport':
          return 'Sport Bike';
        case 'cruiser':
          return 'Cruiser';
        case 'scooter':
          return 'Scooter';
        case 'electric-scooter':
          return 'Electric Scooter';
        default:
          return 'Bike';
      }
    }
    return subcategory;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 group">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 left-2">
          <Badge variant={isAvailable ? "default" : "secondary"} className="bg-accent animate-pulse">
            {isAvailable ? 'Available' : 'Booked'}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
            {getVehicleTypeDisplay()}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="h-3 w-3 text-yellow-500 mr-1" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-navy mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center text-sm text-steel mb-3">
          <MapPin className="h-4 w-4 mr-1 text-accent" />
          {location}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-steel mb-3">
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-1 text-accent" />
            {fuelType}
          </div>
          {seatingCapacity && seatingCapacity > 1 && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-accent" />
              {seatingCapacity} seats
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-right">
            <span className="text-2xl font-bold text-navy">₹{price}</span>
            <span className="text-sm text-steel">/day</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/vehicle/${id}`} className="w-full">
          <Button 
            className="w-full bg-accent hover:bg-accent/90 transition-all duration-300 hover:shadow-lg" 
            disabled={!isAvailable}
          >
            {isAvailable ? 'Book Now' : 'Not Available'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
