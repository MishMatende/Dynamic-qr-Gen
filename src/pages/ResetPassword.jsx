import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import VantaBackground from "../components/VantaBackground";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    }

    setLoading(false);
  };

  return (
    <VantaBackground overlayOpacity={0.85}>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card w-full max-w-md p-8 fade-in">
          <h1 className="text-3xl font-extrabold mb-2">
            Reset <span className="text-[var(--cyan)]">Password</span>
          </h1>

          <p className="text-muted text-sm mb-6">
            Enter your new password below.
          </p>

          {message && (
            <div className="mb-4 text-sm text-[var(--cyan)] border border-cyan-500/30 bg-cyan-500/10 p-3 rounded-xl">
              {message}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
              />
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full"
              type="submit"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </VantaBackground>
  );
}
