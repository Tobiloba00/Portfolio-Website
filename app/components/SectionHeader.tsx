'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import ScrambleText from './ScrambleText';

interface SectionHeaderProps {
    label: string;
    title: string;
    accentTitle?: string;
    id?: string;
}

export default function SectionHeader({ label, title, accentTitle, id }: SectionHeaderProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} id={id} className="mb-14 md:mb-20">
            <p className="font-body text-[10px] tracking-[0.5em] sm:tracking-[0.6em] text-amber uppercase mb-5 flex items-center gap-4">
                <span className="w-8 h-px bg-amber/40" />
                {label}
            </p>

            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-white leading-[0.9]">
                <ScrambleText text={title} trigger={isInView} />
                {accentTitle && (
                    <span className="block text-amber mt-2">
                        <ScrambleText text={accentTitle} trigger={isInView} />
                    </span>
                )}
            </h2>
        </div>
    );
}
