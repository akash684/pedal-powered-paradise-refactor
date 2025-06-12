
-- Insert Indian locations with proper addresses
INSERT INTO public.locations (name, city, state, address) 
SELECT 'Central Mumbai', 'Mumbai', 'Maharashtra', 'Fort District, Mumbai, Maharashtra 400001'
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE city = 'Mumbai' AND name = 'Central Mumbai');

INSERT INTO public.locations (name, city, state, address) 
SELECT 'Connaught Place', 'Delhi', 'Delhi', 'Connaught Place, New Delhi, Delhi 110001'
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE city = 'Delhi' AND name = 'Connaught Place');

INSERT INTO public.locations (name, city, state, address) 
SELECT 'MG Road', 'Bengaluru', 'Karnataka', 'Mahatma Gandhi Road, Bengaluru, Karnataka 560001'
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE city = 'Bengaluru' AND name = 'MG Road');

INSERT INTO public.locations (name, city, state, address) 
SELECT 'Banjara Hills', 'Hyderabad', 'Telangana', 'Banjara Hills, Hyderabad, Telangana 500034'
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE city = 'Hyderabad' AND name = 'Banjara Hills');

INSERT INTO public.locations (name, city, state, address) 
SELECT 'T. Nagar', 'Chennai', 'Tamil Nadu', 'T. Nagar, Chennai, Tamil Nadu 600017'
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE city = 'Chennai' AND name = 'T. Nagar');

INSERT INTO public.locations (name, city, state, address) 
SELECT 'Koregaon Park', 'Pune', 'Maharashtra', 'Koregaon Park, Pune, Maharashtra 411001'
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE city = 'Pune' AND name = 'Koregaon Park');

INSERT INTO public.locations (name, city, state, address) 
SELECT 'Satellite', 'Ahmedabad', 'Gujarat', 'Satellite Road, Ahmedabad, Gujarat 380015'
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE city = 'Ahmedabad' AND name = 'Satellite');

INSERT INTO public.locations (name, city, state, address) 
SELECT 'Marine Drive', 'Kochi', 'Kerala', 'Marine Drive, Ernakulam, Kochi, Kerala 682031'
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE city = 'Kochi' AND name = 'Marine Drive');

-- Insert Indian bikes data
WITH location_ids AS (
  SELECT id, city FROM public.locations
)
INSERT INTO public.bikes (name, type, description, price_per_hour, image_url, available, location_id, features, battery_level) 
SELECT * FROM (VALUES
  (
    'Hero Splendor Plus',
    'commuter',
    'India''s most trusted commuter bike with excellent fuel efficiency and reliable performance.',
    35,
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
    true,
    (SELECT id FROM location_ids WHERE city = 'Delhi'),
    ARRAY['Fuel Efficient', 'Low Maintenance', 'Reliable', 'Comfortable Seat'],
    null
  ),
  (
    'Bajaj Pulsar 150',
    'sports',
    'Sporty performance bike with twin spark engine and aggressive styling.',
    55,
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
    true,
    (SELECT id FROM location_ids WHERE city = 'Mumbai'),
    ARRAY['Sporty Design', 'Twin Spark Engine', 'ExhausTEC', 'Digital Console'],
    null
  ),
  (
    'TVS Apache RTR 160',
    'sports',
    'Performance-oriented bike with racing DNA and advanced features.',
    60,
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
    true,
    (SELECT id FROM location_ids WHERE city = 'Bengaluru'),
    ARRAY['Performance Engine', 'Digital Console', 'Racing DNA', 'ABS'],
    null
  ),
  (
    'Royal Enfield Classic 350',
    'cruiser',
    'Iconic vintage-style cruiser with classic design and comfortable long rides.',
    90,
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
    true,
    (SELECT id FROM location_ids WHERE city = 'Chennai'),
    ARRAY['Vintage Style', 'Long Range', 'Comfortable Ride', 'Classic Design'],
    null
  ),
  (
    'Honda Activa 6G',
    'scooter',
    'India''s favorite scooter with enhanced performance and fuel efficiency.',
    40,
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300',
    true,
    (SELECT id FROM location_ids WHERE city = 'Pune'),
    ARRAY['Electric Start', 'LED Headlight', 'Under Seat Storage', 'Fuel Efficient'],
    null
  ),
  (
    'Yamaha FZ-S V3',
    'street',
    'Stylish street bike with fuel injection and muscular design.',
    65,
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
    true,
    (SELECT id FROM location_ids WHERE city = 'Hyderabad'),
    ARRAY['Fuel Injection', 'LED Lighting', 'Single Channel ABS', 'Muscular Design'],
    null
  ),
  (
    'KTM Duke 200',
    'sports',
    'Ready to race street naked with liquid cooling and premium features.',
    85,
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300',
    true,
    (SELECT id FROM location_ids WHERE city = 'Ahmedabad'),
    ARRAY['Ready to Race', 'Liquid Cooling', 'WP Suspension', 'Slipper Clutch'],
    null
  ),
  (
    'Ather 450X',
    'electric',
    'Premium electric scooter with smart features and fast charging.',
    80,
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300',
    true,
    (SELECT id FROM location_ids WHERE city = 'Kochi'),
    ARRAY['Fast Charging', 'Smart Dashboard', 'Long Range', 'Premium Build'],
    92
  )
) AS bike_data(name, type, description, price_per_hour, image_url, available, location_id, features, battery_level)
WHERE NOT EXISTS (
  SELECT 1 FROM public.bikes WHERE name = bike_data.name
);
