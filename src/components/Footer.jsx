import React from "react";

export default function Footer() {
  return (
    <footer
      id="about"
      className="mt-20 border-t border-zinc-800 pt-10 text-center text-sm text-zinc-500"
    >
      <p>
        Built with ❤️ using{" "}
        <span className="text-[var(--cyan)] font-semibold">
          {" "}
          React, TailwindCSS & Supabase.
        </span>
      </p>
      <p className="mt-2">
        © {new Date().getFullYear()} DynamicCodes. All rights reserved.
      </p>
    </footer>
  );
}
