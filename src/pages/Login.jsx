import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import VantaBackground from "../components/VantaBackground";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <VantaBackground overlayOpacity={0.85}>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card w-full max-w-md p-8 fade-in">
          <h1 className="text-3xl font-extrabold mb-2">
            Login to <span className="text-[var(--cyan)]">DynamicCodes</span>
          </h1>

          <p className="text-muted text-sm mb-6">
            Access your dashboard and manage QR codes.
          </p>

          {message && (
            <div className="mb-4 text-sm text-red-400 border border-red-500/30 bg-red-500/10 p-3 rounded-xl">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)] pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full"
              type="submit"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-sm text-muted flex justify-between">
            <Link
              to="/forgot-password"
              className="hover:text-[var(--cyan)] transition"
            >
              Forgot Password?
            </Link>

            <Link to="/signup" className="hover:text-[var(--cyan)] transition">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
