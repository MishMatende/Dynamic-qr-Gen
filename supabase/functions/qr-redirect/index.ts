import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);

    const parts = url.pathname.split("/").filter(Boolean);
    const code = parts[parts.length - 1];

    if (!code) {
      return new Response("Missing QR code", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({
          error: "Missing env variables",
          SUPABASE_URL: !!supabaseUrl,
          SUPABASE_ANON_KEY: !!supabaseAnonKey,
        }),
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    const userAgent = req.headers.get("user-agent");
    const referer = req.headers.get("referer");

    await supabase.from("qr_scans").insert([
      {
        qr_code_id: qr.id,
        user_agent: userAgent,
        referer: referer,
      },
    ]);

    return new Response(null, {
      status: 302,
      headers: {
        Location: qr.destination_url,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal error", message: String(err) }, null, 2),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
