-- Add is_popular column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;

-- Add is_popular column to podcasts table
ALTER TABLE podcasts 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;

-- Add is_popular column to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;

-- Optional: Create an index for performance if we filter by this column often
CREATE INDEX IF NOT EXISTS idx_events_is_popular ON events(is_popular);
CREATE INDEX IF NOT EXISTS idx_podcasts_is_popular ON podcasts(is_popular);
CREATE INDEX IF NOT EXISTS idx_services_is_popular ON services(is_popular);
