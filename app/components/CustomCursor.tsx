'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Ripple = { id: number; x: number; y: number };

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });
    const isHovering = useRef(false);
    const isClicking = useRef(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const fine = window.matchMedia('(pointer: fine)').matches;
        if (!fine) return;
        setEnabled(true);

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;

            const target = e.target as HTMLElement | null;
            isHovering.current = !!(
                target && (
                    target.tagName === 'A' ||
                    target.tagName === 'BUTTON' ||
                    target.closest('a') ||
                    target.closest('button') ||
                    target.classList.contains('cursor-pointer')
                )
            );
        };

        const handleMouseDown = (e: MouseEvent) => {
            isClicking.current = true;
            const newRipple: Ripple = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
            setRipples(prev => [...prev, newRipple]);
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== newRipple.id));
            }, 900);
        };

        const handleMouseUp = () => { isClicking.current = false; };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        document.body.style.cursor = 'none';

        let rafId = 0;
        const loop = () => {
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.22;
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.22;

            const dot = dotRef.current;
            const ring = ringRef.current;
            if (dot) {
                dot.style.transform = `translate3d(${mousePos.current.x - 2}px, ${mousePos.current.y - 2}px, 0)`;
            }
            if (ring) {
                const hover = isHovering.current;
                const click = isClicking.current;
                const size = hover ? 40 : 24;
                const offset = size / 2;
                const scale = click ? 0.8 : 1;
                ring.style.width = `${size}px`;
                ring.style.height = `${size}px`;
                ring.style.borderWidth = hover ? '1.5px' : '1px';
                ring.style.backgroundColor = hover ? 'rgba(245, 166, 35, 0.1)' : 'transparent';
                ring.style.transform = `translate3d(${ringPos.current.x - offset}px, ${ringPos.current.y - offset}px, 0) scale(${scale})`;
            }

            rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(rafId);
            document.body.style.cursor = 'auto';
        };
    }, []);

    if (!enabled) return null;

    return (
        <>
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.div
                        key={ripple.id}
                        initial={{ opacity: 0.8, scale: 0 }}
                        animate={{ opacity: 0, scale: 3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="fixed top-0 left-0 border border-[#F5A623] rounded-full pointer-events-none z-[9999]"
                        style={{
                            width: 40,
                            height: 40,
                            x: ripple.x - 20,
                            y: ripple.y - 20,
                        }}
                    />
                ))}
            </AnimatePresence>

            <div
                ref={ringRef}
                className="fixed top-0 left-0 border border-[#F5A623] rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    width: 24,
                    height: 24,
                    transition: 'width 0.15s ease-out, height 0.15s ease-out, border-width 0.15s ease-out, background-color 0.15s ease-out',
                    willChange: 'transform, width, height',
                }}
            />

            <div
                ref={dotRef}
                className="fixed top-0 left-0 bg-[#F5A623] rounded-full pointer-events-none z-[9999] mix-blend-difference shadow-[0_0_10px_rgba(245,166,35,0.8)]"
                style={{
                    width: 4,
                    height: 4,
                    willChange: 'transform',
                }}
            />
        </>
    );
}
