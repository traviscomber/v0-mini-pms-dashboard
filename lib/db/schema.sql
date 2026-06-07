-- PMS Database Schema for Hotel Management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room Types table
CREATE TABLE room_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  base_rate DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  number VARCHAR(50) NOT NULL,
  floor INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'clean' CHECK (status IN ('clean', 'dirty', 'inspected', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, number)
);

-- Guests table
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  doc_number VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'checked_in', 'checked_out', 'cancelled')),
  channel VARCHAR(20) NOT NULL DEFAULT 'direct' CHECK (channel IN ('direct', 'booking', 'airbnb', 'expedia', 'other')),
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charges table (add-on charges to reservations)
CREATE TABLE charges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate Seasons table (for seasonal pricing)
CREATE TABLE rate_seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  multiplier DECIMAL(5, 2) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_reservations_check_in ON reservations(check_in);
CREATE INDEX idx_reservations_check_out ON reservations(check_out);
CREATE INDEX idx_reservations_room_id ON reservations(room_id);
CREATE INDEX idx_reservations_property_id ON reservations(property_id);
CREATE INDEX idx_rooms_property_id ON rooms(property_id);
CREATE INDEX idx_room_types_property_id ON room_types(property_id);
CREATE INDEX idx_guests_property_id ON guests(property_id);
CREATE INDEX idx_charges_reservation_id ON charges(reservation_id);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_seasons ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - adjust auth.uid() based on your auth setup)
-- For now, allow all authenticated users to access their property data
-- In production, add proper tenant isolation logic

CREATE POLICY "Enable read access to properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Enable read access to room_types" ON room_types
  FOR SELECT USING (true);

CREATE POLICY "Enable read access to rooms" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Enable read access to guests" ON guests
  FOR SELECT USING (true);

CREATE POLICY "Enable read access to reservations" ON reservations
  FOR SELECT USING (true);

CREATE POLICY "Enable read access to charges" ON charges
  FOR SELECT USING (true);

CREATE POLICY "Enable read access to rate_seasons" ON rate_seasons
  FOR SELECT USING (true);

-- Insert default property for demo
INSERT INTO properties (name, timezone, currency) VALUES
  ('Demo Hotel', 'America/New_York', 'USD');
