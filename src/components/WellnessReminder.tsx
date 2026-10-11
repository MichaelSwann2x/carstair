"use client";

import { useEffect, useState } from "react";

export function WellnessReminder() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 25 * 60 * 1000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm glass rounded-xl p-4 shadow-2xl animate-fade">
      <p className="text-sm font-medium">Take a moment.</p>
      <p className="text-xs text-[#888] mt-1 leading-relaxed">
        You’ve been here a while. Stand up, drink some water, or walk for a few
        minutes. Markets will still be here.
      </p>
      <button
        onClick={() => setShow(false)}
        className="mt-3 text-xs text-[#888] hover:text-white"
      >
        Dismiss
      </button>
    </div>
  );
}
