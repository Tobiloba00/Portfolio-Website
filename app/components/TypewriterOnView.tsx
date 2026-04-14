'use client';

import { useEffect, useRef, useState } from 'react';

export type TypewriterSegment = { text: string; className?: string };

interface Props {
    segments: TypewriterSegment[];
    className?: string;
    speed?: number;
    threshold?: number;
}

export default function TypewriterOnView({
    segments,
    className,
    speed = 6,
    threshold = 0.25,
}: Props) {
    const ref = useRef<HTMLParagraphElement | null>(null);
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const total = segments.reduce((n, s) => n + s.text.length, 0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setStarted(true);
                    io.disconnect();
                }
            },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);

    useEffect(() => {
        if (!started || count >= total) return;
        const t = window.setTimeout(() => setCount(c => c + 1), speed);
        return () => window.clearTimeout(t);
    }, [started, count, total, speed]);

    let remaining = count;
    const children: React.ReactNode[] = [];
    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (remaining <= 0) break;
        const take = Math.min(remaining, seg.text.length);
        children.push(
            <span key={i} className={seg.className}>
                {seg.text.slice(0, take)}
            </span>
        );
        remaining -= take;
    }

    return (
        <p ref={ref} className={className}>
            {children}
            {started && count < total && (
                <span className="inline-block w-[2px] h-[0.9em] bg-amber ml-0.5 align-[-2px] animate-pulse" />
            )}
        </p>
    );
}
