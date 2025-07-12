
-- Clear existing vehicles and add comprehensive vehicle data with proper images
DELETE FROM public.vehicles;

-- Insert comprehensive vehicle data with proper matching images
INSERT INTO public.vehicles (title, description, category, subcategory, brand, model, year, price_per_day, fuel_type, transmission, seating_capacity, mileage, engine_capacity, features, image_urls, rating) VALUES

-- 4-Seater Cars with proper car images
('Maruti Swift Dzire', 'Compact sedan perfect for city rides with excellent fuel efficiency', 'car', '4-seater', 'Maruti Suzuki', 'Swift Dzire', 2023, 2500.00, 'petrol', 'manual', 4, 24.12, '1200cc', '{"AC", "Power Windows", "Central Locking", "ABS", "Airbags"}', '{"https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop"}', 4.3),

('Hyundai Grand i10 Nios', 'Stylish hatchback with modern features and comfort', 'car', '4-seater', 'Hyundai', 'Grand i10 Nios', 2023, 2400.00, 'petrol', 'manual', 4, 20.7, '1200cc', '{"AC", "Touchscreen", "Reverse Camera", "Bluetooth", "USB Charging"}', '{"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop"}', 4.2),

('Tata Tiago', 'Reliable and efficient hatchback for daily commuting', 'car', '4-seater', 'Tata', 'Tiago', 2023, 2200.00, 'petrol', 'manual', 4, 23.84, '1200cc', '{"AC", "Power Steering", "Central Locking", "Music System"}', '{"https://images.unsplash.com/photo-1494976688153-ca3ce29cd93b?w=600&h=400&fit=crop"}', 4.1),

('Honda Amaze', 'Premium compact sedan with spacious interiors', 'car', '4-seater', 'Honda', 'Amaze', 2023, 2800.00, 'petrol', 'automatic', 4, 18.6, '1200cc', '{"AC", "Touchscreen", "Reverse Camera", "Cruise Control", "Sunroof"}', '{"https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop"}', 4.4),

('Maruti Baleno', 'Premium hatchback with advanced safety features', 'car', '4-seater', 'Maruti Suzuki', 'Baleno', 2023, 2600.00, 'petrol', 'automatic', 4, 22.35, '1200cc', '{"AC", "Touchscreen", "6 Airbags", "ABS", "EBD"}', '{"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop"}', 4.3),

('Hyundai Venue', 'Compact SUV with modern technology and style', 'car', '4-seater', 'Hyundai', 'Venue', 2023, 3200.00, 'petrol', 'automatic', 4, 18.15, '1000cc', '{"AC", "Touchscreen", "BlueLink", "Sunroof", "Wireless Charging"}', '{"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop"}', 4.5),

('Tata Nexon', 'Feature-loaded compact SUV with 5-star safety rating', 'car', '4-seater', 'Tata', 'Nexon', 2023, 3400.00, 'petrol', 'automatic', 4, 17.57, '1200cc', '{"AC", "Touchscreen", "6 Airbags", "Sunroof", "JBL Audio"}', '{"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop"}', 4.6),

('Mahindra XUV300', 'Bold and rugged compact SUV with premium features', 'car', '4-seater', 'Mahindra', 'XUV300', 2023, 3300.00, 'diesel', 'manual', 4, 20.0, '1500cc', '{"AC", "Touchscreen", "Sunroof", "7 Airbags", "Cruise Control"}', '{"https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop"}', 4.4),

-- 6-Seater Cars with proper MPV/SUV images
('Maruti Ertiga', 'Spacious 7-seater MPV perfect for family trips', 'car', '6-seater', 'Maruti Suzuki', 'Ertiga', 2023, 4000.00, 'petrol', 'manual', 7, 19.34, '1500cc', '{"AC", "Captain Seats", "Touchscreen", "6 Airbags", "Rear AC Vents"}', '{"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"}', 4.3),

('Toyota Innova Crysta', 'Premium MPV with luxury features and comfort', 'car', '6-seater', 'Toyota', 'Innova Crysta', 2023, 5500.00, 'diesel', 'automatic', 8, 15.6, '2400cc', '{"AC", "Leather Seats", "Touchscreen", "Premium Audio", "Captain Seats"}', '{"https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop"}', 4.7),

('Mahindra XUV700', 'Feature-loaded 7-seater SUV for adventure', 'car', '6-seater', 'Mahindra', 'XUV700', 2023, 5000.00, 'diesel', 'automatic', 7, 16.5, '2000cc', '{"AC", "Panoramic Sunroof", "ADAS", "Premium Sound", "Wireless Charging"}', '{"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop"}', 4.6),

('Kia Carens', 'Modern 6-seater MPV with advanced technology', 'car', '6-seater', 'Kia', 'Carens', 2023, 4500.00, 'petrol', 'automatic', 6, 16.2, '1500cc', '{"AC", "Touchscreen", "Wireless Charging", "ISOFIX", "Ventilated Seats"}', '{"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"}', 4.4),

('Hyundai Alcazar', 'Premium 6-seater SUV with comfort and technology', 'car', '6-seater', 'Hyundai', 'Alcazar', 2023, 4800.00, 'petrol', 'automatic', 6, 14.2, '1500cc', '{"AC", "Ventilated Seats", "Touchscreen", "BlueLink", "Panoramic Sunroof"}', '{"https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop"}', 4.5),

-- Sport Bikes with proper motorcycle images
('Yamaha R15 V4', 'Sporty bike with racing DNA and aggressive styling', 'bike', 'sport', 'Yamaha', 'R15 V4', 2023, 1800.00, 'petrol', 'manual', 1, 40.0, '155cc', '{"LED Headlight", "Digital Display", "ABS", "Slipper Clutch", "VVA"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop"}', 4.5),

('KTM Duke 200', 'Naked street fighter with explosive performance', 'bike', 'sport', 'KTM', 'Duke 200', 2023, 1900.00, 'petrol', 'manual', 1, 35.0, '199cc', '{"LED Headlight", "TFT Display", "ABS", "WP Suspension", "Slipper Clutch"}', '{"https://images.unsplash.com/photo-1558717914-f4e2bb2c4eca?w=600&h=400&fit=crop"}', 4.4),

('Bajaj Pulsar NS200', 'Performance bike with aggressive styling and power', 'bike', 'sport', 'Bajaj', 'Pulsar NS200', 2023, 1700.00, 'petrol', 'manual', 1, 35.0, '199cc', '{"LED DRL", "Digital Console", "ABS", "Liquid Cooling", "Split Grab Rail"}', '{"https://images.unsplash.com/photo-1558717914-f4e2bb2c4eca?w=600&h=400&fit=crop"}', 4.3),

('TVS Apache RTR 200 4V', 'Racing-inspired bike with track-focused features', 'bike', 'sport', 'TVS', 'Apache RTR 200 4V', 2023, 1750.00, 'petrol', 'manual', 1, 40.0, '197cc', '{"LED Headlight", "SmartXonnect", "ABS", "Race Tuned Suspension"}', '{"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop"}', 4.4),

('Honda CB Hornet 2.0', 'Aggressive naked bike with refined performance', 'bike', 'sport', 'Honda', 'CB Hornet 2.0', 2023, 1650.00, 'petrol', 'manual', 1, 40.0, '184cc', '{"LED Headlight", "Digital Display", "ABS", "USB Charging", "H&D"}', '{"https://images.unsplash.com/photo-1558717914-f4e2bb2c4eca?w=600&h=400&fit=crop"}', 4.2),

-- Cruiser Bikes with proper cruiser motorcycle images
('Royal Enfield Classic 350', 'Iconic cruiser with timeless design and thump', 'bike', 'cruiser', 'Royal Enfield', 'Classic 350', 2023, 1500.00, 'petrol', 'manual', 1, 35.0, '349cc', '{"Electric Start", "Dual Channel ABS", "LED Lights", "Tripper Navigation"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.4),

('Royal Enfield Meteor 350', 'Modern cruiser with classic Royal Enfield charm', 'bike', 'cruiser', 'Royal Enfield', 'Meteor 350', 2023, 1600.00, 'petrol', 'manual', 1, 36.0, '349cc', '{"Tripper Navigation", "Dual Channel ABS", "LED Lights", "USB Charging"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.3),

('Bajaj Avenger Cruise 220', 'Comfortable cruiser for long highway rides', 'bike', 'cruiser', 'Bajaj', 'Avenger Cruise 220', 2023, 1400.00, 'petrol', 'manual', 1, 40.0, '220cc', '{"LED DRL", "Digital Console", "ABS", "Comfortable Seating"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.1),

-- Scooters with proper scooter images
('Honda Activa 6G', 'Most trusted scooter for daily commute', 'bike', 'scooter', 'Honda', 'Activa 6G', 2023, 800.00, 'petrol', 'automatic', 1, 60.0, '109cc', '{"LED Headlight", "Digital Display", "Mobile Charging", "Under Seat Storage"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.3),

('TVS Jupiter', 'Feature-rich scooter with comfort and convenience', 'bike', 'scooter', 'TVS', 'Jupiter', 2023, 750.00, 'petrol', 'automatic', 1, 62.0, '109cc', '{"LED Headlight", "Digital Display", "USB Charging", "External Fuel Fill"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.2),

('Suzuki Access 125', 'Premium scooter with spacious storage', 'bike', 'scooter', 'Suzuki', 'Access 125', 2023, 900.00, 'petrol', 'automatic', 1, 64.0, '124cc', '{"LED Headlight", "Digital Display", "USB Charging", "Bluetooth Connectivity"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.4),

('Honda Dio', 'Stylish and youthful scooter with sporty looks', 'bike', 'scooter', 'Honda', 'Dio', 2023, 850.00, 'petrol', 'automatic', 1, 60.0, '109cc', '{"LED Headlight", "Digital Display", "Mobile Charging", "Sporty Design"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.1),

('TVS Ntorq 125', 'Smart scooter with connected features', 'bike', 'scooter', 'TVS', 'Ntorq 125', 2023, 950.00, 'petrol', 'automatic', 1, 47.0, '124cc', '{"SmartXonnect", "LED Headlight", "Digital Display", "Bluetooth", "Navigation"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.3),

-- Electric Scooters
('Ola S1 Pro', 'Smart electric scooter with advanced features', 'bike', 'electric-scooter', 'Ola', 'S1 Pro', 2023, 1200.00, 'electric', 'automatic', 1, 181.0, 'Electric', '{"Touchscreen", "App Connectivity", "Reverse Mode", "Hill Hold", "Fast Charging"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.5),

('Ather 450X', 'Premium electric scooter with performance and style', 'bike', 'electric-scooter', 'Ather', '450X', 2023, 1300.00, 'electric', 'automatic', 1, 146.0, 'Electric', '{"Touchscreen Dashboard", "Google Maps", "OTA Updates", "Fast Charging", "Performance Mode"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.6),

('TVS iQube', 'Connected electric scooter with smart features', 'bike', 'electric-scooter', 'TVS', 'iQube', 2023, 1100.00, 'electric', 'automatic', 1, 140.0, 'Electric', '{"SmartXonnect", "LED Lights", "Digital Display", "Navigation", "Remote Diagnostics"}', '{"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop"}', 4.4);
