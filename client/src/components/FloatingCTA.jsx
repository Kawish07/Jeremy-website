import React from 'react';
import { createPortal } from 'react-dom';

export default function FloatingCTA({ onClick }) {
    if (typeof document === 'undefined') return null;

    const handleClick = (e) => {
        // ensure clicks aren't swallowed by capture listeners or overlays
        e.stopPropagation();
        e.preventDefault && e.preventDefault();
        if (typeof onClick === 'function') onClick(e);
    };

    return createPortal(
        <div className="fixed bottom-6 left-6 md:left-8 z-[110000] pointer-events-auto">
            <button
                onClick={handleClick}
                aria-label="Lets connect"
                className="bg-[#d8a24a] px-6 py-3 rounded-full shadow-[0_12px_30px_rgba(216,162,74,0.3)] text-sm tracking-wide hover:bg-[#f5c15c] transition-all duration-200 flex items-center space-x-2 border-2 border-[#d8a24a] text-[#0f1f2e] font-semibold"
            >
                <span>LET'S CONNECT</span>
                <span className="text-xs">↑</span>
            </button>
        </div>,
        document.body
    );
}
