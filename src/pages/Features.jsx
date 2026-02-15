import React from "react";
import VantaBackground from "../components/VantaBackground";

export default function Features() {
  return (
    <VantaBackground overlayOpacity={0.78}>
      <div className="px-6 py-2 md:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Title */}
          <div className="text-center fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Powerful <span className="text-[var(--cyan)]">Features</span>
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-muted text-base md:text-lg leading-relaxed">
              Everything you need to generate dynamic QR codes, update
              destinations anytime, and track scan analytics in real-time.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-3 fade-in-delay">
            <div className="card">
              <h3 className="text-xl font-bold">Dynamic Redirect</h3>
              <p className="mt-3 text-muted text-sm leading-relaxed">
                Update the destination URL anytime without changing the QR code.
                Perfect for menus, promotions, events, and marketing campaigns.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold">Scan Analytics</h3>
              <p className="mt-3 text-muted text-sm leading-relaxed">
                Track every scan with timestamp, device details, and scan count.
                Know which QR codes perform best.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold">Fast Edge Redirect</h3>
              <p className="mt-3 text-muted text-sm leading-relaxed">
                Redirects happen instantly through Supabase Edge Functions,
                ensuring low latency and high reliability.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold">QR Code Generator</h3>
              <p className="mt-3 text-muted text-sm leading-relaxed">
                Generate QR codes instantly from your dashboard. Download and
                share them for print, stickers, posters, and digital use.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold">Secure by Design</h3>
              <p className="mt-3 text-muted text-sm leading-relaxed">
                Built with Supabase Postgres + Row Level Security (RLS) to
                ensure your analytics and QR data stays protected.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold">Modern Dashboard</h3>
              <p className="mt-3 text-muted text-sm leading-relaxed">
                A clean, minimal dashboard designed for speed and productivity.
                Manage QR codes and analytics with ease.
              </p>
            </div>
          </div>

          {/* Extra Section */}
          <div className="mt-20 card p-10 fade-in-delay">
            <h2 className="text-3xl font-bold">
              Built for <span className="text-[var(--cyan)]">Businesses</span> &
              Creators
            </h2>

            <p className="mt-4 text-muted leading-relaxed">
              Whether you run a restaurant, manage events, sell products, or
              promote online services, DynamicCodes helps you connect your
              audience to the right destination instantly — while giving you
              valuable insights.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="card">
                <h3 className="text-lg font-semibold">🍽 Restaurants</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  QR menus, WiFi QR codes, review links, promotions, and online
                  ordering.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold">🎉 Events</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  Event tickets, registration pages, social links, or donation
                  pages.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold">🛍 Businesses</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  Product pages, WhatsApp contact links, or digital business
                  cards.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold">📢 Marketing</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  Campaign tracking, flyers, posters, billboards, and QR-based
                  promotions.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-20 text-center text-zinc-500 text-sm fade-in-delay">
            <p>
              More features coming soon: custom domains, geo analytics, campaign
              tagging, and QR customization.
            </p>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
