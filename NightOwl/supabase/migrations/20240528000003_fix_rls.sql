-- Fix friends RLS policy to allow bidirectional inserts
-- Fix friends RLS policy to allow bidirectional inserts securely
DROP POLICY IF EXISTS "Users can manage their own friend list" ON public.friends;

-- Users can only see friend records involving them
CREATE POLICY "Users can view their own friends" ON public.friends
    FOR SELECT USING (
        user_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()) OR
        friend_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    );

-- Users can only delete their own connections
CREATE POLICY "Users can delete their friends" ON public.friends
    FOR DELETE USING (
        user_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()) OR
        friend_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    );

-- SECURE FUNCTION to allow inserting bidirectional friend relationships without exposing standard RLS INSERT
CREATE OR REPLACE FUNCTION public.add_friend(target_user_id UUID)
RETURNS void AS $$
DECLARE
    caller_id UUID;
BEGIN
    -- Get caller's public user ID
    SELECT id INTO caller_id FROM public.users WHERE supabase_auth_id = auth.uid();

    IF caller_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF caller_id = target_user_id THEN
        RAISE EXCEPTION 'Cannot add yourself as a friend';
    END IF;

    -- Insert bidirectional records bypassing RLS
    INSERT INTO public.friends (user_id, friend_id, status)
    VALUES
        (caller_id, target_user_id, 'accepted'),
        (target_user_id, caller_id, 'accepted')
    ON CONFLICT (user_id, friend_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RLS Policies for Voice Rooms
CREATE POLICY "Voice rooms are viewable by everyone" ON public.voice_rooms
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own voice rooms" ON public.voice_rooms
    FOR INSERT WITH CHECK (
        host_id IN (
            SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()
        )
    );

CREATE POLICY "Host can update their voice rooms" ON public.voice_rooms
    FOR UPDATE USING (
        host_id IN (
            SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()
        )
    );

CREATE POLICY "Host can delete their voice rooms" ON public.voice_rooms
    FOR DELETE USING (
        host_id IN (
            SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()
        )
    );

-- RLS Policies for Voice Room Participants
CREATE POLICY "Participants are viewable by everyone" ON public.voice_room_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can insert themselves into rooms" ON public.voice_room_participants
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own participant status" ON public.voice_room_participants
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete themselves from rooms" ON public.voice_room_participants
    FOR DELETE USING (
        user_id IN (
            SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()
        )
    );
