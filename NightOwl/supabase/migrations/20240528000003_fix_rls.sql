-- Fix friends RLS policy to allow bidirectional inserts
DROP POLICY IF EXISTS "Users can manage their own friend list" ON public.friends;

CREATE POLICY "Users can manage their own friend list" ON public.friends
    FOR ALL USING (
        user_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()) OR
        friend_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    ) WITH CHECK (
        user_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()) OR
        friend_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    );

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
