"use client";

import { useEffect, useState } from "react";

export default function WellnessReminder() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 45 * 60 * 1000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 glass rounded-xl p-4 text-sm animate-fade">
      <p className="font-medium">Take a short break</p>
      <p className="text-xs text-[#8a8a96] mt-1 leading-relaxed">
        You've been here a while. Water, stretch, or a quick walk helps more than
        another chart refresh.
      </p>
      <button
        onClick={() => setShow(false)}
        className="mt-3 text-xs gloss-btn px-3 py-1.5 rounded-lg"
      >
        Got it
      </button>
    </div>
  );
}
