import React from "react";
import VantaBackground from "../components/VantaBackground";

export default function HowItWorks() {
  const steps = [
    {
      step: "Step 1",
      title: "Sign Up & Log In",
      desc: "Create an account so your QR codes are saved securely under your profile. Only authenticated users can create and manage QR codes.",
      icon: "🔐",
    },
    {
      step: "Step 2",
      title: "Create & Customize Your QR",
      desc: "Enter your destination URL and fully customize your QR code — dot styles, colors, gradients, corners, logo upload, and even frames with text.",
      icon: "🎨",
    },
    {
      step: "Step 3",
      title: "Save to Your Account",
      desc: "Once you're happy with the design, save it. Your QR is stored in the database with all its settings, and a unique short code is generated automatically.",
      icon: "💾",
    },
    {
      step: "Step 4",
      title: "Download & Use Anywhere",
      desc: "Download your QR code as PNG (with frames) or SVG (perfect for printing). Add it to menus, posters, flyers, packaging, business cards, and more.",
      icon: "📥",
    },
    {
      step: "Step 5",
      title: "Users Scan the QR Code",
      desc: "When someone scans your QR, they don’t go directly to your destination URL. They first hit the DynamicCodes redirect endpoint.",
      icon: "📱",
    },
    {
      step: "Step 6",
      title: "Redirect + Analytics Tracking",
      desc: "Our redirect engine logs the scan details (timestamp, referrer, user agent, etc.) and instantly redirects the user to the correct destination URL.",
      icon: "⚡",
    },
    {
      step: "Step 7",
      title: "View Analytics Anytime",
      desc: "From your dashboard, you can view scan history and performance insights, helping you understand how well your QR campaigns are performing.",
      icon: "📊",
    },
    {
      step: "Step 8",
      title: "Update Destination Anytime",
      desc: "Change where your QR points without reprinting. The same QR code keeps working while the destination can be updated whenever you want.",
      icon: "🔁",
    },
  ];

  return (
    <VantaBackground overlayOpacity={0.84}>
      <div className="min-h-screen px-6 py-14 md:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Title */}
          <div className="text-center mb-14 fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              How It <span className="text-[var(--cyan)]">Works</span>
            </h1>

            <p className="mt-4 text-muted max-w-2xl mx-auto leading-relaxed">
              DynamicCodes is built to make QR codes smarter, customizable, and
              trackable. Here’s exactly what happens from creation to scanning.
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((s, index) => (
              <div
                key={index}
                className="card hover:shadow-[0_0_25px_rgba(34,211,238,0.18)] transition duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{s.icon}</div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--cyan)] font-semibold">
                      {s.step}
                    </p>

                    <h2 className="text-xl font-bold mt-1">{s.title}</h2>

                    <p className="text-sm text-muted mt-2 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Extra Explanation */}
          <div className="mt-14 card fade-in-delay">
            <h2 className="text-2xl font-bold mb-4">
              Why Dynamic QR Codes Matter
            </h2>

            <p className="text-muted leading-relaxed">
              Traditional QR codes are static — once printed, they can never be
              changed. If the link changes, the QR becomes useless and you must
              reprint everything.
            </p>

            <p className="text-muted leading-relaxed mt-4">
              DynamicCodes solves this by using a secure redirect system powered
              by{" "}
              <span className="text-white font-semibold">
                Supabase Postgres + Edge Functions
              </span>
              . Your QR code always points to a short redirect link, while the
              destination can be updated anytime from your dashboard.
            </p>

            <div className="mt-6 border border-zinc-800 rounded-2xl p-6 bg-black">
              <p className="text-sm font-semibold text-white mb-2">
                Example Scan Flow:
              </p>

              <p className="text-sm text-muted leading-relaxed">
                User scans →
                <span className="text-[var(--cyan)] font-semibold">
                  {" "}
                  /qr-redirect/abc123{" "}
                </span>
                → scan gets logged →
                <span className="text-white font-semibold">
                  {" "}
                  instant redirect{" "}
                </span>
                → user lands on your website / menu / Instagram / product page.
              </p>
            </div>

            <p className="text-muted leading-relaxed mt-6">
              This gives you full control over your QR campaigns while also
              providing analytics that help you measure real-world performance.
            </p>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
