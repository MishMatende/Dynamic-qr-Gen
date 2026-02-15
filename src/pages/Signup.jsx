import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import VantaBackground from "../components/VantaBackground";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Password checks
  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    Object.values(passwordChecks).forEach((check) => {
      if (check) score += 1;
    });
    return score;
  }, [passwordChecks]);

  const strengthLabel = useMemo(() => {
    if (password.length === 0) return "";
    if (strengthScore <= 2) return "Weak";
    if (strengthScore === 3 || strengthScore === 4) return "Medium";
    return "Strong";
  }, [strengthScore, password.length]);

  const strengthColor = useMemo(() => {
    if (strengthLabel === "Weak") return "bg-red-500";
    if (strengthLabel === "Medium") return "bg-yellow-500";
    if (strengthLabel === "Strong") return "bg-green-500";
    return "bg-zinc-700";
  }, [strengthLabel]);

  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0
      ? password === confirmPassword
      : true;

  const canSubmit =
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    password.length >= 8 &&
    strengthScore >= 3;

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (strengthScore < 3) {
      setMessage("Password is too weak. Please make it stronger.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Account created! Please check your email to confirm your account.",
      );
    }

    setLoading(false);
  };

  return (
    <VantaBackground overlayOpacity={0.85}>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card w-full max-w-md p-8 fade-in">
          <h1 className="text-3xl font-extrabold mb-2">
            Sign Up for <span className="text-[var(--cyan)]">DynamicCodes</span>
          </h1>

          <p className="text-muted text-sm mb-6">
            Create an account to generate dynamic QR codes.
          </p>

          {message && (
            <div className="mb-4 text-sm text-[var(--cyan)] border border-cyan-500/30 bg-cyan-500/10 p-3 rounded-xl">
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
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
                  placeholder="Minimum 8 characters"
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

              {/* Strength Meter */}
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-400">Password strength</span>
                    <span
                      className={`font-semibold ${
                        strengthLabel === "Weak"
                          ? "text-red-400"
                          : strengthLabel === "Medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    >
                      {strengthLabel}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-2 ${strengthColor}`}
                      style={{
                        width: `${(strengthScore / 5) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Rules */}
                  <div className="mt-3 space-y-1 text-xs text-zinc-400">
                    <p
                      className={passwordChecks.length ? "text-green-400" : ""}
                    >
                      • At least 8 characters
                    </p>
                    <p
                      className={
                        passwordChecks.uppercase ? "text-green-400" : ""
                      }
                    >
                      • Contains an uppercase letter
                    </p>
                    <p
                      className={
                        passwordChecks.lowercase ? "text-green-400" : ""
                      }
                    >
                      • Contains a lowercase letter
                    </p>
                    <p
                      className={passwordChecks.number ? "text-green-400" : ""}
                    >
                      • Contains a number
                    </p>
                    <p
                      className={passwordChecks.special ? "text-green-400" : ""}
                    >
                      • Contains a special character
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full rounded-xl bg-black border px-4 py-3 text-sm outline-none pr-12 focus:border-[var(--cyan)]
                    ${!passwordsMatch ? "border-red-500" : "border-zinc-800"}
                  `}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {!passwordsMatch && (
                <p className="text-xs text-red-400 mt-2">
                  Passwords do not match.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={loading || !canSubmit}
              className={`btn-primary w-full ${
                loading || !canSubmit ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-sm text-muted text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--cyan)] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
