'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'WORK', href: '/#work' },
    { label: 'ABOUT', href: '/#about' },
    { label: 'SKILLS', href: '/#skills' },
    { label: 'SERVICES', href: '/#services' },
    { label: 'BLOG', href: '/blog' },
    { label: 'CONTACT', href: '/#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const lastY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        lastY.current = window.scrollY;

        const update = () => {
            const y = window.scrollY;
            const delta = y - lastY.current;

            setScrolled(y > 50);

            // Always show near the top
            if (y < 80) {
                setHidden(false);
            } else if (Math.abs(delta) > 6) {
                // Hide on scroll down, show on scroll up
                setHidden(delta > 0);
            }

            lastY.current = y;
            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(update);
                ticking.current = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (menuOpen) {
            setHidden(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <>
            <motion.nav
                animate={{ y: hidden && !menuOpen ? '-120%' : '0%' }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="fixed top-0 left-0 right-0 z-[90] px-5 md:px-8 py-5 md:py-6 font-body">
                <div className="max-w-[1800px] mx-auto flex items-center justify-between">

                    {/* Logo */}
                    <a href="/" className="font-display text-3xl md:text-4xl lg:text-5xl text-white hover:text-amber transition-colors">
                        OT<span className="text-amber">.</span>
                    </a>

                    {/* Desktop Center Bar */}
                    <motion.div
                        animate={{
                            backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.8)' : 'rgba(10, 10, 10, 0)',
                            backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
                            borderColor: scrolled ? 'rgba(245, 166, 35, 0.15)' : 'rgba(255, 255, 255, 0)',
                            padding: scrolled ? '14px 36px' : '0px',
                        }}
                        className="hidden md:flex items-center gap-8 lg:gap-12 border rounded-full transition-all duration-500"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-[11px] lg:text-xs tracking-[0.35em] text-[#888] hover:text-amber transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </motion.div>

                    {/* Desktop Right — Status & CTA */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] tracking-[0.3em] text-[#444] uppercase">Status</span>
                            <span className="text-[11px] text-[#777] flex items-center gap-2">
                                SYSTEM_ACTIVE <div className="w-1.5 h-1.5 bg-green-neon rounded-full animate-pulse" />
                            </span>
                        </div>
                        <div className="w-[1px] h-9 bg-white/5" />
                        <a
                            href="/#contact"
                            className="text-[11px] tracking-[0.4em] px-8 py-3.5 border border-amber/40 text-amber hover:bg-amber hover:text-black transition-all"
                        >
                            INIT_COMMS
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        type="button"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(v => !v)}
                        className="md:hidden text-white hover:text-amber transition-colors p-2 -mr-2 relative z-[95]"
                    >
                        {menuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[88] bg-black/95 backdrop-blur-xl md:hidden flex flex-col"
                    >
                        <div className="flex-1 flex flex-col items-center justify-center gap-7 px-6">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                                    className="font-display text-5xl sm:text-6xl tracking-wider text-white hover:text-amber transition-colors"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.a
                                href="/#contact"
                                onClick={() => setMenuOpen(false)}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 + navLinks.length * 0.05, duration: 0.3 }}
                                className="mt-6 text-[11px] tracking-[0.4em] px-10 py-4 border border-amber/40 text-amber font-body"
                            >
                                INIT_COMMS
                            </motion.a>

                            <div className="absolute bottom-10 flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#555] font-body">
                                SYSTEM_ACTIVE <div className="w-1.5 h-1.5 bg-green-neon rounded-full animate-pulse" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
