-- RLS Policies for Friends
CREATE POLICY "Users can view their own friends" ON public.friends
    FOR SELECT USING (
        user_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()) OR
        friend_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    );

CREATE POLICY "Users can manage their own friend list" ON public.friends
    FOR ALL USING (
        user_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    );

-- RLS Policies for Direct Messages
CREATE POLICY "Users can view messages they sent or received" ON public.direct_messages
    FOR SELECT USING (
        sender_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()) OR
        receiver_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    );

CREATE POLICY "Users can insert messages they send" ON public.direct_messages
    FOR INSERT WITH CHECK (
        sender_id IN (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    );

-- Enable Realtime for Posts and Direct Messages
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table posts;
alter publication supabase_realtime add table direct_messages;
