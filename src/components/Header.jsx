import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-12">
      <Link
        to="/"
        className="text-xl font-bold tracking-wide text-[var(--cyan)]"
      >
        DynamicCodes
      </Link>

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

        <a href="/how-it-works" className="hover:text-white transition">
          How it works
        </a>
      </nav>

      <div className="flex items-center gap-3">
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
    </header>
  );
}
