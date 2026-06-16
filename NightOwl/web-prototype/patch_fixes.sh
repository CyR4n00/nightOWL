#!/bin/bash
# Fix Voice Room timer
sed -i 's/if (now.getHours() >= 6 && now.getHours() < 18) { \/\/ 6 AM to 6 PM/if (false) { \/\/ Disabled daylight check for development/g' src/views/VoiceRoomView.tsx

# Fix Chat posts RLS
# Assuming posts RLS needs auth.uid() == supabase_auth_id on the joined users table, but since the user_id on posts references users.id, we just need to fix the RLS rule in supabase.
