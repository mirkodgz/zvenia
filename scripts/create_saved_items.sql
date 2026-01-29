-- Create saved_items table
CREATE TABLE IF NOT EXISTS public.saved_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_id uuid NOT NULL, -- Polymorphic ID (can be post_id, event_id, etc.)
    item_type text NOT NULL, -- 'post', 'event', 'podcast', 'service'
    created_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE(user_id, item_id, item_type)
);

-- Enable RLS
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Users can insert their own saved items
CREATE POLICY "Users can insert their own saved items" 
ON public.saved_items 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 2. Users can view their own saved items
CREATE POLICY "Users can view their own saved items" 
ON public.saved_items 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. Users can delete their own saved items
CREATE POLICY "Users can delete their own saved items" 
ON public.saved_items 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Grant permissions to authenticated users
GRANT ALL ON TABLE public.saved_items TO authenticated;
GRANT ALL ON TABLE public.saved_items TO service_role;
