
-- Create enhanced vehicles table with detailed categories and specifications
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('car', 'bike')),
  subcategory TEXT, -- e.g., '4-seater', '6-seater', 'sport-bike', 'cruiser'
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  price_per_day DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL DEFAULT 'Hyderabad',
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  transmission TEXT CHECK (transmission IN ('manual', 'automatic')),
  seating_capacity INTEGER,
  mileage DECIMAL(5,2), -- km/l or km/charge
  engine_capacity TEXT, -- e.g., '1200cc', '150cc'
  features TEXT[], -- array of features like ['AC', 'GPS', 'Bluetooth']
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 4.0,
  availability BOOLEAN DEFAULT true,
  pickup_locations TEXT[] DEFAULT '{"Hyderabad City Center", "Secunderabad", "Gachibowli", "Madhapur", "Kondapur"}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table for order management
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pickup_location TEXT NOT NULL,
  total_days INTEGER NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create contact_queries table for user queries
CREATE TABLE IF NOT EXISTS public.contact_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicles (public read access)
CREATE POLICY "Everyone can view vehicles" ON public.vehicles
  FOR SELECT USING (true);

-- RLS Policies for bookings (users can only see their own bookings)
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for contact queries (users can create, admins can view all)
CREATE POLICY "Anyone can create contact queries" ON public.contact_queries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own queries" ON public.contact_queries
  FOR SELECT USING (true);

-- Insert sample vehicle data with proper categories and realistic pricing
INSERT INTO public.vehicles (title, description, category, subcategory, brand, model, year, price_per_day, fuel_type, transmission, seating_capacity, mileage, engine_capacity, features, image_urls, rating) VALUES
-- 4-Seater Cars
('Maruti Swift', 'Compact and fuel-efficient hatchback perfect for city rides', 'car', '4-seater', 'Maruti Suzuki', 'Swift', 2023, 2500.00, 'petrol', 'manual', 4, 22.56, '1200cc', '{"AC", "Power Steering", "Central Locking", "ABS"}', '{"https://images.unsplash.com/photo-1494976688153-ca3ce29cd93b?w=600&h=400&fit=crop&crop=center"}', 4.3),
('Hyundai i20', 'Premium hatchback with advanced features', 'car', '4-seater', 'Hyundai', 'i20', 2023, 2800.00, 'petrol', 'automatic', 4, 20.35, '1200cc', '{"AC", "Touchscreen", "Reverse Camera", "Bluetooth"}', '{"https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop&crop=center"}', 4.4),
('Tata Nexon', 'Stylish compact SUV with safety features', 'car', '4-seater', 'Tata', 'Nexon', 2023, 3200.00, 'petrol', 'automatic', 4, 17.57, '1200cc', '{"AC", "Touchscreen", "Reverse Camera", "6 Airbags"}', '{"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop&crop=center"}', 4.5),
('Honda City', 'Premium sedan with comfort and style', 'car', '4-seater', 'Honda', 'City', 2023, 3500.00, 'petrol', 'automatic', 4, 17.80, '1500cc', '{"AC", "Sunroof", "Leather Seats", "Cruise Control"}', '{"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&crop=center"}', 4.6),
('Maruti Dzire', 'Reliable compact sedan for comfortable journeys', 'car', '4-seater', 'Maruti Suzuki', 'Dzire', 2023, 2700.00, 'petrol', 'manual', 4, 24.12, '1200cc', '{"AC", "Power Windows", "Central Locking", "ABS"}', '{"https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&crop=center"}', 4.2),

-- 6-Seater Cars
('Maruti Ertiga', 'Spacious MPV perfect for family trips', 'car', '6-seater', 'Maruti Suzuki', 'Ertiga', 2023, 4000.00, 'petrol', 'manual', 6, 19.34, '1500cc', '{"AC", "Captain Seats", "Touchscreen", "6 Airbags"}', '{"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center"}', 4.3),
('Toyota Innova Crysta', 'Premium MPV with luxury features', 'car', '6-seater', 'Toyota', 'Innova Crysta', 2023, 5500.00, 'diesel', 'automatic', 6, 15.60, '2400cc', '{"AC", "Leather Seats", "Touchscreen", "Premium Audio"}', '{"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center"}', 4.7),
('Mahindra XUV700', 'Feature-loaded SUV for adventure', 'car', '6-seater', 'Mahindra', 'XUV700', 2023, 5000.00, 'diesel', 'automatic', 6, 16.50, '2000cc', '{"AC", "Panoramic Sunroof", "ADAS", "Premium Sound"}', '{"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&crop=center"}', 4.6),
('Kia Carens', 'Modern MPV with advanced technology', 'car', '6-seater', 'Kia', 'Carens', 2023, 4500.00, 'petrol', 'automatic', 6, 16.20, '1500cc', '{"AC", "Touchscreen", "Wireless Charging", "ISOFIX"}', '{"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&crop=center"}', 4.4),
('Hyundai Alcazar', 'Premium 6-seater SUV with comfort', 'car', '6-seater', 'Hyundai', 'Alcazar', 2023, 4800.00, 'petrol', 'automatic', 6, 14.20, '1500cc', '{"AC", "Ventilated Seats", "Touchscreen", "BlueLink"}', '{"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&crop=center"}', 4.5),

-- Sport Bikes
('Royal Enfield Classic 350', 'Classic cruiser bike with retro styling', 'bike', 'cruiser', 'Royal Enfield', 'Classic 350', 2023, 1500.00, 'petrol', 'manual', 1, 35.00, '349cc', '{"Electric Start", "Dual Channel ABS", "LED Lights"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.4),
('KTM Duke 200', 'Sporty naked bike for thrill seekers', 'bike', 'sport', 'KTM', 'Duke 200', 2023, 1800.00, 'petrol', 'manual', 1, 35.00, '199cc', '{"Digital Display", "ABS", "LED Headlight", "Split Seat"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.5),
('Bajaj Pulsar NS200', 'Performance bike with aggressive styling', 'bike', 'sport', 'Bajaj', 'Pulsar NS200', 2023, 1600.00, 'petrol', 'manual', 1, 35.00, '199cc', '{"Digital Console", "ABS", "LED DRL", "Split Grab Rail"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.3),
('Yamaha FZ-S', 'Stylish street bike with great handling', 'bike', 'street', 'Yamaha', 'FZ-S', 2023, 1400.00, 'petrol', 'manual', 1, 45.00, '149cc', '{"LED Headlight", "Digital Display", "ABS", "Side Stand Engine Cut-off"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.2),
('Honda CB Hornet 2.0', 'Aggressive naked bike with power', 'bike', 'sport', 'Honda', 'CB Hornet 2.0', 2023, 1700.00, 'petrol', 'manual', 1, 40.00, '184cc', '{"LED Headlight", "Digital Display", "ABS", "USB Charging"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.4),

-- Scooters
('Honda Activa 6G', 'Most trusted scooter for daily commute', 'bike', 'scooter', 'Honda', 'Activa 6G', 2023, 800.00, 'petrol', 'automatic', 1, 60.00, '109cc', '{"LED Headlight", "Digital Display", "Mobile Charging", "Under Seat Storage"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.3),
('TVS Jupiter', 'Feature-rich scooter with comfort', 'bike', 'scooter', 'TVS', 'Jupiter', 2023, 750.00, 'petrol', 'automatic', 1, 62.00, '109cc', '{"LED Headlight", "Digital Display", "USB Charging", "External Fuel Fill"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.2),
('Suzuki Access 125', 'Premium scooter with spacious storage', 'bike', 'scooter', 'Suzuki', 'Access 125', 2023, 900.00, 'petrol', 'automatic', 1, 64.00, '124cc', '{"LED Headlight", "Digital Display", "USB Charging", "Bluetooth Connectivity"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.4),
('Ola S1 Pro', 'Electric scooter with smart features', 'bike', 'electric-scooter', 'Ola', 'S1 Pro', 2023, 1200.00, 'electric', 'automatic', 1, 181.00, 'Electric', '{"Touchscreen", "App Connectivity", "Reverse Mode", "Hill Hold"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.5),
('Ather 450X', 'Smart electric scooter with performance', 'bike', 'electric-scooter', 'Ather', '450X', 2023, 1300.00, 'electric', 'automatic', 1, 146.00, 'Electric', '{"Touchscreen Dashboard", "Google Maps", "OTA Updates", "Fast Charging"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center"}', 4.6);
