-- Migration to simplify 'talks' table (One-to-Many instead of Many-to-Many)
-- 1. Add topic_id column to talks table
ALTER TABLE talks 
ADD COLUMN topic_id UUID REFERENCES topics(id);

-- 2. Migrate existing data (take the first topic found for each talk)
-- This assumes you want to preserve at least one relationship.
UPDATE talks
SET topic_id = (
    SELECT topic_id 
    FROM talks_topics 
    WHERE talks_topics.talks_id = talks.id 
    LIMIT 1
);

-- 3. Drop the pivot table
DROP TABLE talks_topics;

-- 4. Optional: Add index for performance
CREATE INDEX idx_talks_topic_id ON talks(topic_id);
