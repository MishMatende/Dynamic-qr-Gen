import React from "react";
import VantaBackground from "../components/VantaBackground";

export default function About() {
  return (
    <VantaBackground overlayOpacity={0.75}>
      <div className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-5xl">
          {/* About Card */}
          <div className="p-10">
            <h2 className="text-4xl font-extrabold mb-4">
              About <span className="text-[var(--cyan)]">DynamicQR</span>
            </h2>

            <p className="text-muted leading-relaxed text-lg">
              DynamicQR is a modern QR code platform designed to help
              businesses, creators, and marketers generate QR codes that are{" "}
              <span className="text-white font-semibold">
                dynamic, trackable, and easy to manage
              </span>
              .
            </p>

            <p className="text-muted leading-relaxed mt-5">
              Unlike traditional static QR codes, DynamicQR allows you to change
              the destination URL at any time without needing to reprint your QR
              codes. Every scan is logged so you can track performance and make
              smarter decisions.
            </p>

            {/* Features */}
            <div className="grid gap-6 mt-10 md:grid-cols-2">
              <div className="card">
                <h3 className="text-lg font-semibold text-white">
                  🚀 Fast Redirects
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  Powered by Supabase Edge Functions to ensure quick redirection
                  and reliable uptime.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-white">
                  📊 Analytics Tracking
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  Track scans, devices, and timestamps to measure your QR
                  campaign performance.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-white">
                  🔒 Secure by Design
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  Built with Supabase Postgres and Row Level Security (RLS) to
                  keep your data protected.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-white">
                  🧠 Simple & Modern UI
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  A clean black + cyan theme dashboard designed for speed,
                  simplicity, and productivity.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted leading-relaxed">
                To provide a simple and powerful QR platform that helps
                businesses and individuals connect the physical world to the
                digital world — with full control and measurable insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
