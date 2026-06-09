import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testSupabase() {
  console.log("Testing connection to:", process.env.VITE_SUPABASE_URL);

  const { data: posts, error: dbError } = await supabase.from('posts').select('id').limit(1);
  if (dbError) {
    console.log("Database Error:", dbError);
  } else {
    console.log("Database Connection OK. Posts table exists.");
  }

  const uniqueEmail = `test_${Date.now()}@example.com`;
  console.log(`Testing SignUp with ${uniqueEmail}...`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: uniqueEmail,
    password: 'Password123!',
    options: {
      data: { username: 'testuser' }
    }
  });

  if (authError) {
    console.log("Auth Error:", authError);
  } else {
    console.log("Auth OK. Session:", authData.session ? "Active" : "Null (Email confirm still required?)");
  }
}

testSupabase();
