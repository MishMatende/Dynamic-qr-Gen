import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-12">
      <h1 className="text-xl font-bold tracking-wide text-[var(--cyan)]">
        DynamicQR
      </h1>

      <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
        <a href="/" className="hover:text-white transition">
          Home
        </a>
        <a href="/about" className="hover:text-white transition">
          About
        </a>
        <a href="/features" className="hover:text-white transition">
          Features
        </a>
        <a href="#how-it-works" className="hover:text-white transition">
          How it works
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <Link to="/login" className="btn-outline text-sm">
          Login
        </Link>

        <Link to="/dashboard" className="btn-primary text-sm">
          Dashboard
        </Link>
      </div>
    </header>
  );
}
