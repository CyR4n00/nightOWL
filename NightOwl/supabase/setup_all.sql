-- Create extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_auth_id UUID UNIQUE, -- Link to Supabase Auth
    username TEXT NOT NULL,
    display_name TEXT,
    profile_icon_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    theme_preference TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friends Table (Many-to-Many)
CREATE TABLE public.friends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- Posts Table (Open Chat)
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE, -- Logical deletion flag for 6:00 AM
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Direct Messages Table
CREATE TABLE public.direct_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Rooms Table
CREATE TABLE public.voice_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    speaker_permission TEXT CHECK (speaker_permission IN ('open', 'request_only', 'invite_only')) DEFAULT 'open',
    bgm_track TEXT,
    closes_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Room Participants
CREATE TABLE public.voice_room_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.voice_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('host', 'speaker', 'listener')) DEFAULT 'listener',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- Row Level Security (RLS) Policies (Basic setup, needs refinement based on specific app rules)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_room_participants ENABLE ROW LEVEL SECURITY;

-- Allow users to read all public profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
    FOR SELECT USING (true);

-- Allow authenticated users to read posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts
    FOR SELECT USING (is_deleted = false);

-- Allow authenticated users to insert posts
CREATE POLICY "Users can insert their own posts" ON public.posts
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.users WHERE supabase_auth_id = auth.uid()
        )
    );
-- Function to automatically create a user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (supabase_auth_id, username, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', new.email, 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'User')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
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
