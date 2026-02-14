import React from "react";
import { Link } from "react-router-dom";
import VantaBackground from "../components/VantaBackground";

export default function Home() {
  return (
    <VantaBackground overlayOpacity={0.7}>
      <div>
        {/* Hero */}
        <main className="mx-auto max-w-6xl px-6 pt-14 pb-20 md:px-12">
          <section className="text-center fade-in">
            <div className="inline-block cyan-glow">
              <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">
                Generate{" "}
                <span className="text-[var(--cyan)]">Dynamic QR Codes</span>{" "}
                with Analytics
              </h2>
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-base text-muted md:text-lg leading-relaxed fade-in-delay">
              Create QR codes that you can update anytime without reprinting.
              Track scans, devices, and performance with a clean analytics
              dashboard.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row fade-in-delay">
              <Link to="/create" className="btn-primary w-full sm:w-auto">
                Create QR Code
              </Link>

              <Link to="/dashboard" className="btn-outline w-full sm:w-auto">
                View Analytics
              </Link>
            </div>

            <p className="mt-5 text-sm text-zinc-500 fade-in-delay">
              Powered by Supabase Edge Functions ⚡
            </p>
          </section>

          {/* Features */}
          <section
            id="features"
            className="mt-20 grid gap-6 md:grid-cols-3 fade-in-delay"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-white">
                Dynamic Redirect
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Change the destination URL anytime without generating a new QR
                code. Perfect for menus, events, promos, and review links.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white">
                Scan Analytics
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Track total scans, timestamps, and user devices. Understand
                which campaigns are performing best.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white">
                Secure & Fast
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Runs on Supabase Postgres + Edge Functions for fast redirects
                and scalable analytics.
              </p>
            </div>
          </section>

          {/* How it works */}
          <section
            id="how-it-works"
            className="mt-24 card p-8 md:p-10 fade-in-delay"
          >
            <h3 className="text-2xl font-bold text-white">How it works</h3>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div>
                <p className="text-[var(--cyan)] font-bold text-sm">STEP 1</p>
                <h4 className="mt-2 font-semibold">Create a QR Code</h4>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Enter the URL you want to redirect to, and we generate a QR
                  code instantly.
                </p>
              </div>

              <div>
                <p className="text-[var(--cyan)] font-bold text-sm">STEP 2</p>
                <h4 className="mt-2 font-semibold">Users Scan It</h4>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  The QR points to a dynamic redirect link handled by Supabase
                  Edge Functions.
                </p>
              </div>

              <div>
                <p className="text-[var(--cyan)] font-bold text-sm">STEP 3</p>
                <h4 className="mt-2 font-semibold">Track Analytics</h4>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Every scan is logged, so you can view performance inside your
                  dashboard.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </VantaBackground>
  );
}
