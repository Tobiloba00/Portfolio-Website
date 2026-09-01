'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Boxes } from 'lucide-react';

// Only fetched once a visitor actually clicks — three.js + rapier's WASM
// physics add real weight, so this must cost nothing on first load.
const Playground = dynamic(() => import('./Playground'), { ssr: false });

export default function PlaygroundLauncher() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {!open && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="cursor-pointer fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-4 py-3 bg-[#0a0a0a] border border-amber/30 text-amber font-body text-[10px] tracking-[0.25em] uppercase hover:bg-amber hover:text-black transition-colors duration-300"
                >
                    <Boxes size={14} />
                    Playground
                </button>
            )}
            {open && <Playground onClose={() => setOpen(false)} />}
        </>
    );
}
