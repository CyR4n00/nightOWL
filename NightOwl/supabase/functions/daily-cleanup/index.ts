import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Edge Function to logically delete posts and direct messages at 6:00 AM JST
// Expected to be triggered by a pg_cron job or Supabase Scheduler

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    // 🛡️ Sentinel: Enforce authentication for internal/scheduled tasks
    const authHeader = req.headers.get('Authorization')
    if (authHeader !== `Bearer ${supabaseServiceKey}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { "Content-Type": "application/json" }, status: 401 }
      )
    }

    // 1. Logically delete all active posts
    const { error: postsError } = await supabase
      .from('posts')
      .update({ is_deleted: true })
      .eq('is_deleted', false)

    if (postsError) {
      throw postsError
    }

    // 2. Logically delete all active direct messages
    const { error: dmError } = await supabase
      .from('direct_messages')
      .update({ is_deleted: true })
      .eq('is_deleted', false)

    if (dmError) {
      throw dmError
    }

    // 3. Close active Voice Rooms
    const { error: roomsError } = await supabase
      .from('voice_rooms')
      .update({ is_active: false })
      .eq('is_active', true)

    if (roomsError) {
      throw roomsError
    }

    return new Response(
      JSON.stringify({ message: "Daily cleanup successful. Posts, DMs marked as deleted, and Voice Rooms closed." }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    )
  }
})
