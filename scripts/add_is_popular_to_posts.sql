-- Add 'is_popular' column to 'posts' table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;

-- Optional: Index for performance if filtering by popular often
CREATE INDEX IF NOT EXISTS idx_posts_is_popular ON public.posts(is_popular);
