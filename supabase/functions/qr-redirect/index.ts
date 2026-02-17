import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function detectDeviceType(userAgent: string) {
  const ua = userAgent.toLowerCase();

  if (ua.includes("ipad") || ua.includes("tablet")) return "Tablet";
  if (ua.includes("mobi") || ua.includes("android")) return "Mobile";
  return "Desktop";
}

function detectBrowser(userAgent: string) {
  const ua = userAgent.toLowerCase();

  if (ua.includes("edg")) return "Edge";
  if (ua.includes("opr") || ua.includes("opera")) return "Opera";
  if (ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr"))
    return "Chrome";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  return "Unknown";
}

function detectOS(userAgent: string) {
  const ua = userAgent.toLowerCase();

  if (ua.includes("windows")) return "Windows";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  if (ua.includes("mac os") || ua.includes("macintosh")) return "MacOS";
  if (ua.includes("linux")) return "Linux";

  return "Unknown";
}

serve(async (req) => {
  try {
    const url = new URL(req.url);

    // Extract short_code from URL path
    const parts = url.pathname.split("/").filter(Boolean);
    const code = parts[parts.length - 1];

    if (!code) {
      return new Response("Missing QR code", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          error: "Missing env variables",
          SUPABASE_URL: !!supabaseUrl,
          SUPABASE_SERVICE_ROLE_KEY: !!serviceRoleKey,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // IMPORTANT: use Service Role Key for insert
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch QR Code
    const { data: qr, error } = await supabase
      .from("qr_codes")
      .select("id, destination_url")
      .eq("short_code", code.trim())
      .maybeSingle();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message, details: error }, null, 2),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!qr) {
      return new Response("QR code not found", { status: 404 });
    }

    // Collect scan info
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const referer = req.headers.get("referer") || null;

    const deviceType = detectDeviceType(userAgent);
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);

    // Insert scan log
    const { error: scanError } = await supabase.from("qr_scans").insert([
  {
    qr_code_id: qr.id,
    short_code: code.trim(),   // ✅ ADD THIS
    scanned_at: new Date().toISOString(),
    user_agent: userAgent,
    referer: referer,
    device_type: deviceType,
    browser: browser,
    os: os,
    country: null,
    city: null,
    ip_address: null,
  },
]);


    if (scanError) {
      console.error("Scan insert error:", scanError);
    }

    // Redirect user
    return new Response(null, {
      status: 302,
      headers: {
        Location: qr.destination_url,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify(
        { error: "Internal error", message: String(err) },
        null,
        2
      ),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
