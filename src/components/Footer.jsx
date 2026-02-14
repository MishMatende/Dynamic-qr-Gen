import React from "react";

export default function Footer() {
  return (
    <footer
      id="about"
      className="mt-20 border-t border-zinc-800 pt-10 text-center text-sm text-zinc-500"
    >
      <p>Built with ❤️ using React, TailwindCSS & Supabase.</p>
      <p className="mt-2">
        © {new Date().getFullYear()} DynamicQR. All rights reserved.
      </p>
    </footer>
  );
}
