import React from "react";
import VantaBackground from "../components/VantaBackground";

export default function HowItWorks() {
  const steps = [
    {
      step: "Step 1",
      title: "Create a QR Code",
      desc: "Enter your destination URL, customize the QR design (colors, gradient, corners, logo, frames), then save it to your account.",
      icon: "🛠️",
    },
    {
      step: "Step 2",
      title: "Download & Share",
      desc: "Download your QR code as PNG or SVG and place it anywhere — flyers, menus, posters, business cards, product packaging, etc.",
      icon: "📥",
    },
    {
      step: "Step 3",
      title: "Users Scan the QR",
      desc: "When someone scans, they don’t go directly to the destination URL. They go through DynamicCodes’s redirect engine.",
      icon: "📱",
    },
    {
      step: "Step 4",
      title: "Dynamic Redirect Happens",
      desc: "Our Supabase Edge Function checks your short code, logs the scan, then redirects instantly to the correct destination URL.",
      icon: "⚡",
    },
    {
      step: "Step 5",
      title: "Analytics are Logged",
      desc: "Each scan is stored with useful details like timestamp, user agent, referrer, and device data (for performance tracking).",
      icon: "📊",
    },
    {
      step: "Step 6",
      title: "Edit Anytime",
      desc: "You can update your destination URL anytime without reprinting your QR code. The same QR keeps working forever.",
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
              DynamicCodes is built to make QR codes smarter, trackable, and
              easy to manage. Here’s exactly what happens behind the scenes.
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
              changed. If the URL changes, your QR becomes useless.
            </p>

            <p className="text-muted leading-relaxed mt-4">
              DynamicCodes solves this by using a short code redirect system
              powered by{" "}
              <span className="text-white font-semibold">
                Supabase Postgres + Edge Functions
              </span>
              . Your QR code always points to the same redirect endpoint, while
              you can update the destination anytime.
            </p>

            <div className="mt-6 border border-zinc-800 rounded-2xl p-6 bg-black">
              <p className="text-sm font-semibold text-white mb-2">
                Example Flow:
              </p>

              <p className="text-sm text-muted leading-relaxed">
                User scans →
                <span className="text-[var(--cyan)] font-semibold">
                  {" "}
                  /qr-redirect/abc123{" "}
                </span>
                → Scan gets logged →
                <span className="text-white font-semibold">
                  {" "}
                  Redirect to destination URL{" "}
                </span>
                (like your website, Instagram, menu, product page, etc.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
