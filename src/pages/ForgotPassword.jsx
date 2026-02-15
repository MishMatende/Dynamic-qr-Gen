import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import VantaBackground from "../components/VantaBackground";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset email sent! Check your inbox.");
    }

    setLoading(false);
  };

  return (
    <VantaBackground overlayOpacity={0.85}>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card w-full max-w-md p-8 fade-in">
          <h1 className="text-3xl font-extrabold mb-2">
            Forgot <span className="text-[var(--cyan)]">Password</span>
          </h1>

          <p className="text-muted text-sm mb-6">
            Enter your email and we’ll send you a reset link.
          </p>

          {message && (
            <div className="mb-4 text-sm text-[var(--cyan)] border border-cyan-500/30 bg-cyan-500/10 p-3 rounded-xl">
              {message}
            </div>
          )}

          <form onSubmit={handleResetRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full"
              type="submit"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-sm text-muted text-center">
            <Link to="/login" className="text-[var(--cyan)] hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
