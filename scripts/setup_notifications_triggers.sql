-- 1. Create Notifications Table (if not exists)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'system', 'connection_request')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" 
    ON public.notifications FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" 
    ON public.notifications FOR INSERT 
    WITH CHECK (true); 

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" 
    ON public.notifications FOR UPDATE 
    USING (auth.uid() = user_id);

-- 3. TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_notification()
RETURNS TRIGGER AS $$
DECLARE
    recipient_id UUID;
    content_title TEXT;
    notification_title TEXT;
    notification_message TEXT;
    target_link TEXT;
    post_slug TEXT;
    actor_name TEXT;
BEGIN
    -- A. HANDLE LIKES
    IF (TG_TABLE_NAME = 'social_likes' AND TG_OP = 'INSERT') THEN
        -- Get Actor Name (Fallback to username)
        SELECT COALESCE(full_name, username, 'Someone') INTO actor_name 
        FROM public.profiles 
        WHERE id = NEW.user_id;
        
        actor_name := COALESCE(actor_name, 'Someone');

        -- 1. Identify Recipient based on Content Type
        IF (NEW.content_type = 'post') THEN
            SELECT author_id, title, slug INTO recipient_id, content_title, post_slug FROM public.posts WHERE id = NEW.content_id;
            target_link := '/post/' || post_slug;
        ELSIF (NEW.content_type = 'podcast') THEN
            SELECT author_id, title, slug INTO recipient_id, content_title, post_slug FROM public.podcasts WHERE id = NEW.content_id;
            target_link := '/podcast/' || post_slug;
        ELSIF (NEW.content_type = 'service') THEN
            SELECT author_id, title INTO recipient_id, content_title FROM public.services WHERE id = NEW.content_id;
            target_link := '/services/' || NEW.content_id;
        ELSIF (NEW.content_type = 'event') THEN
            SELECT author_id, title INTO recipient_id, content_title FROM public.events WHERE id = NEW.content_id;
            target_link := '/events/' || NEW.content_id;
        END IF;

        notification_title := 'New Like';
        notification_message := actor_name || ' liked your post: ' || COALESCE(substring(content_title from 1 for 30), 'Content') || '...';
        
        -- Prevent self-notification
        IF (recipient_id IS NOT NULL AND recipient_id != NEW.user_id) THEN
            INSERT INTO public.notifications (user_id, actor_id, type, title, message, link_url)
            VALUES (recipient_id, NEW.user_id, 'like', notification_title, notification_message, target_link);
        END IF;
    
    -- B. HANDLE COMMENTS
    ELSIF (TG_TABLE_NAME = 'social_comments' AND TG_OP = 'INSERT') THEN
        -- Get Actor Name (Fallback to username)
        SELECT COALESCE(full_name, username, 'Someone') INTO actor_name 
        FROM public.profiles 
        WHERE id = NEW.user_id;
        
        actor_name := COALESCE(actor_name, 'Someone');

         IF (NEW.content_type = 'post') THEN
            SELECT author_id, title, slug INTO recipient_id, content_title, post_slug FROM public.posts WHERE id = NEW.content_id;
            target_link := '/post/' || post_slug;
         END IF;

        notification_title := 'New Comment';
        notification_message := actor_name || ' commented on: ' || COALESCE(substring(content_title from 1 for 30), 'Content') || '...';

        IF (recipient_id IS NOT NULL AND recipient_id != NEW.user_id) THEN
            INSERT INTO public.notifications (user_id, actor_id, type, title, message, link_url)
            VALUES (recipient_id, NEW.user_id, 'comment', notification_title, notification_message, target_link);
        END IF;

    -- C. HANDLE FOLLOWS (Social Connections)
    ELSIF (TG_TABLE_NAME = 'social_connections' AND TG_OP = 'INSERT') THEN
        -- Get Actor Name (Fallback to username)
        SELECT COALESCE(full_name, username, 'Someone') INTO actor_name 
        FROM public.profiles 
        WHERE id = NEW.follower_id;
        
        actor_name := COALESCE(actor_name, 'Someone');

        recipient_id := NEW.following_id;
        notification_title := 'New Follower';
        notification_message := actor_name || ' started following you!';
        target_link := '/network'; 
        
        IF (recipient_id != NEW.follower_id) THEN
            INSERT INTO public.notifications (user_id, actor_id, type, title, message, link_url)
            VALUES (recipient_id, NEW.follower_id, 'follow', notification_title, notification_message, target_link);
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ATTACH TRIGGERS
DROP TRIGGER IF EXISTS trigger_notify_on_like ON public.social_likes;
CREATE TRIGGER trigger_notify_on_like
AFTER INSERT ON public.social_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_new_notification();

DROP TRIGGER IF EXISTS trigger_notify_on_comment ON public.social_comments;
CREATE TRIGGER trigger_notify_on_comment
AFTER INSERT ON public.social_comments
FOR EACH ROW EXECUTE FUNCTION public.handle_new_notification();

DROP TRIGGER IF EXISTS trigger_notify_on_follow ON public.social_connections;
CREATE TRIGGER trigger_notify_on_follow
AFTER INSERT ON public.social_connections
FOR EACH ROW EXECUTE FUNCTION public.handle_new_notification();
