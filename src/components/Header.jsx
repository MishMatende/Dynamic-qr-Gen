import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    setMobileOpen(false);
  };

  return (
    <header className="relative px-6 py-5 md:px-12">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/Dynamiccodeslogo.svg"
            alt="DynamicCodes Logo"
            className="h-10 w-auto object-contain"
          />
          <p className="text-xl font-bold tracking-wide text-white">
            Dynamic<span className="text-[var(--cyan)]">Codes</span>
          </p>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>

          <Link to="/about" className="hover:text-white transition">
            About
          </Link>

          <Link to="/features" className="hover:text-white transition">
            Features
          </Link>

          <Link to="/how-it-works" className="hover:text-white transition">
            How it works
          </Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="btn-outline text-sm">
                Login
              </Link>

              <Link to="/signup" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn-primary text-sm">
                Dashboard
              </Link>

              <button onClick={handleLogout} className="btn-outline text-sm">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[var(--cyan)] hover:opacity-80 transition"
        >
          {mobileOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="mt-5 md:hidden card border border-zinc-800 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block text-zinc-300 hover:text-white transition"
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileOpen(false)}
            className="block text-zinc-300 hover:text-white transition"
          >
            About
          </Link>

          <Link
            to="/features"
            onClick={() => setMobileOpen(false)}
            className="block text-zinc-300 hover:text-white transition"
          >
            Features
          </Link>

          <Link
            to="/how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block text-zinc-300 hover:text-white transition"
          >
            How it works
          </Link>

          <hr className="border-zinc-800 my-3" />

          {!user ? (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-outline text-sm w-full text-center"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-sm w-full text-center"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-sm w-full text-center"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="btn-outline text-sm w-full"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
