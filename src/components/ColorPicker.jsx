import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColorPicker({ label, color, setColor }) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-sm font-semibold mb-2">{label}</label>

      {/* Color Preview Input */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-black border border-zinc-800 hover:border-[var(--cyan)] transition"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg border border-zinc-700"
            style={{ backgroundColor: color }}
          ></div>

          <span className="text-sm text-zinc-200 font-medium">{color}</span>
        </div>

        <span className="text-xs text-zinc-500">Click to pick</span>
      </button>

      {/* Popup Picker */}
      {open && (
        <div className="absolute z-50 mt-3 w-full rounded-2xl border border-zinc-800 bg-black/95 backdrop-blur-xl p-4 shadow-lg">
          <HexColorPicker color={color} onChange={setColor} />

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-muted">HEX</span>
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-28 text-sm rounded-lg bg-black border border-zinc-800 px-2 py-1 outline-none focus:border-[var(--cyan)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
