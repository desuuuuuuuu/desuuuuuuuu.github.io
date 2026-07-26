import { useEffect, useRef, useState } from 'react';
import { FaSun } from 'react-icons/fa';

const STORAGE_KEY = 'portrait-brightness';
const DEFAULT = 15;
const MAX = 60;

const readSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), MAX) : DEFAULT;
  } catch {
    return DEFAULT;
  }
};

// Floating bottom-right control that adjusts ONLY the hero background
// portrait, via the --portrait-opacity CSS variable it writes on <html>.
const BrightnessControl = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(readSaved);
  const rootRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--portrait-opacity', String(value / 100));
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // storage unavailable (private mode) — adjustment still works for this visit
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="glass rounded-xl px-4 py-3 shadow-xl shadow-black/50">
          <label
            htmlFor="portrait-brightness"
            className="block text-muted text-[10px] uppercase tracking-[0.15em] mb-2"
          >
            Portrait brightness
          </label>
          <div className="flex items-center gap-3">
            <input
              id="portrait-brightness"
              type="range"
              min="0"
              max={MAX}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-36 accent-silver cursor-pointer"
            />
            <span className="text-silver text-xs font-medium w-9 text-right tabular-nums">
              {value}%
            </span>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Adjust background portrait brightness"
        className="w-11 h-11 rounded-full glass flex items-center justify-center text-silver/70 hover:text-silver hover:border-silver/40 transition-colors duration-300 shadow-lg shadow-black/40"
      >
        <FaSun size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

export default BrightnessControl;
