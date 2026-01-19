-- Social Features Schema Migration

-- 1. SOCIAL LIKES TABLE
CREATE TABLE IF NOT EXISTS public.social_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('post', 'service', 'event', 'podcast')),
    content_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

-- RLS for social_likes
ALTER TABLE public.social_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes" 
    ON public.social_likes FOR SELECT 
    USING (true);

CREATE POLICY "Users can like content" 
    ON public.social_likes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike content" 
    ON public.social_likes FOR DELETE 
    USING (auth.uid() = user_id);

-- 2. SOCIAL COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.social_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('post', 'service', 'event', 'podcast')),
    content_id UUID NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) > 0),
    parent_id UUID REFERENCES public.social_comments(id) ON DELETE CASCADE, -- For replies
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for social_comments
ALTER TABLE public.social_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all comments" 
    ON public.social_comments FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can comment" 
    ON public.social_comments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their own comments" 
    ON public.social_comments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
    ON public.social_comments FOR DELETE 
    USING (auth.uid() = user_id);

-- 3. SOCIAL CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.social_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- RLS for social_connections
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can see connections" 
    ON public.social_connections FOR SELECT 
    USING (true);

CREATE POLICY "Users can follow others" 
    ON public.social_connections FOR INSERT 
    WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" 
    ON public.social_connections FOR DELETE 
    USING (auth.uid() = follower_id);

-- 4. AUTOMATIC COUNTERS (TRIGGERS)

-- Function to handle likes count
CREATE OR REPLACE FUNCTION handle_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.content_type = 'post') THEN
            UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.content_type = 'post') THEN
            UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for likes
DROP TRIGGER IF EXISTS on_social_like_change ON public.social_likes;
CREATE TRIGGER on_social_like_change
AFTER INSERT OR DELETE ON public.social_likes
FOR EACH ROW EXECUTE FUNCTION handle_likes_count();

-- Function to handle comments count
CREATE OR REPLACE FUNCTION handle_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.content_type = 'post') THEN
            UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.content_type = 'post') THEN
            UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.content_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for comments
DROP TRIGGER IF EXISTS on_social_comment_change ON public.social_comments;
CREATE TRIGGER on_social_comment_change
AFTER INSERT OR DELETE ON public.social_comments
FOR EACH ROW EXECUTE FUNCTION handle_comments_count();

-- Function to handle followers count (Optional: requires adding followers_count/following_count to profiles)
-- We will skip this for now to avoid altering profiles table heavily, can be computed or added later.

