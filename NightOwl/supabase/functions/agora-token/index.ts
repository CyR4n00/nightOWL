import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Instead of the node module which requires building/polyfills in Deno,
// we use a Deno-compatible port or we can construct the token manually.
// Actually, supabase edge functions support npm modules now via esm.sh or npm:
import pkg from "npm:agora-access-token@2.0.4";
const { RtcTokenBuilder, RtcRole } = pkg;

// 🛡️ Sentinel: Generate dynamic CORS headers to restrict allowed origins instead of using wildcard '*'
const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("Origin");
  const allowedOriginsStr = Deno.env.get("ALLOWED_ORIGINS");
  let allowOrigin = "null"; // Default safe fallback

  if (allowedOriginsStr) {
    const allowedOrigins = allowedOriginsStr.split(",").map((o) => o.trim());
    if (origin && allowedOrigins.includes(origin)) {
      allowOrigin = origin;
    } else if (allowedOrigins.length > 0) {
      allowOrigin = allowedOrigins[0];
    }
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { channelName, uid } = await req.json();

    if (!channelName) {
      throw new Error("channelName is required");
    }

    // Get environment variables set in Supabase
    const appId = Deno.env.get("AGORA_APP_ID");
    const appCertificate = Deno.env.get("AGORA_APP_CERTIFICATE");

    if (!appId || !appCertificate) {
      throw new Error("AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in Supabase Secrets");
    }

    // Role: Publisher (can send and receive audio)
    const role = RtcRole.PUBLISHER;

    // Token valid for 24 hours
    const expirationTimeInSeconds = 3600 * 24;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // The UID needs to be an integer for RtcTokenBuilder.buildTokenWithUid
    // If frontend passes a string UID, we might need to use buildTokenWithUserAccount
    // Agora generally prefers integer UIDs for simplicity. Let's assume integer or 0 for random.
    const numericUid = uid ? parseInt(uid, 10) : 0;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      numericUid,
      role,
      privilegeExpiredTs
    );

    return new Response(
      JSON.stringify({ token, uid: numericUid }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
