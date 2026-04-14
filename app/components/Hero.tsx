'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ScrambleText from './ScrambleText';

const tickerItems = [
    'n8n', 'Next.js', 'Supabase', 'React', 'TypeScript', 'AI Agents',
    'Notion API', 'Firebase', 'Chatwoot', 'WhatsApp API', 'Mistral',
    'Apify', 'DigitalOcean', 'Vercel', 'Cloudflare', 'Lovable',
    'Bolt.new', 'Replit', 'Adalo', 'Stripe', 'RevenueCat', 'Capacitor',
];

const heroRoles = [
    'AI Systems Builder.',
    'Automation Engineer.',
    'Full-Stack Developer.',
    'Startup Founder.',
    'I build things that work.',
];

function HeroTypewriter() {
    const [text, setText] = useState('');
    const [lineIdx, setLineIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = heroRoles[lineIdx];
        let t: number;
        if (!deleting && text.length < current.length) {
            t = window.setTimeout(() => setText(current.slice(0, text.length + 1)), 55);
        } else if (!deleting && text.length === current.length) {
            t = window.setTimeout(() => setDeleting(true), 1800);
        } else if (deleting && text.length > 0) {
            t = window.setTimeout(() => setText(current.slice(0, text.length - 1)), 28);
        } else {
            t = window.setTimeout(() => {
                setDeleting(false);
                setLineIdx((i) => (i + 1) % heroRoles.length);
            }, 320);
        }
        return () => window.clearTimeout(t);
    }, [text, deleting, lineIdx]);

    return (
        <span className="inline-flex items-center">
            <span>{text}</span>
            <span className="inline-block w-[3px] h-[0.85em] bg-amber ml-1 animate-pulse align-middle" />
        </span>
    );
}

export default function Hero() {
    return (
        <section className="relative min-h-screen min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-5 sm:px-6 pt-28 pb-32">

            {/* Background Glow — reduced blur on mobile to avoid iOS GPU jank */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[60%] h-[60%] rounded-full bg-amber opacity-[0.03] blur-[40px] md:blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl w-full text-center">
                {/* Main Name with Glitch Resolving */}
                <div className="relative mb-6 md:mb-8">
                    <h1 className="font-display leading-[0.85] tracking-tight uppercase text-white overflow-hidden"
                        style={{ fontSize: 'clamp(3rem, 13vw, 10rem)' }}>
                        <div className="relative block">
                            <ScrambleText text="TOBILOBA" />
                        </div>
                        <div className="relative block text-amber">
                            <ScrambleText text="OLUJIMI" />
                        </div>
                    </h1>
                </div>

                {/* Rotating Typewriter Role */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="font-display text-amber tracking-widest uppercase min-h-[1.4em] flex items-center justify-center"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}
                >
                    <HeroTypewriter />
                </motion.div>

                {/* Sub-text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.6 }}
                    className="font-body text-sm md:text-base text-[#666] max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.2em] mt-6 md:mt-8 mb-4"
                >
                    Shipping automation, CRMs
                    <span className="text-[#999]"> and AI systems </span>
                    for UK brands and product teams.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 2 }}
                    className="mt-10 md:mt-12 flex items-center justify-center gap-4 sm:gap-8 flex-wrap"
                >
                    <a
                        href="#work"
                        className="group relative font-body text-[10px] tracking-[0.4em] uppercase px-8 sm:px-10 py-4 bg-amber text-black font-bold hover:shadow-[0_0_30px_rgba(245,166,35,0.4)] transition-all"
                    >
                        [ VIEW_SYSTEMS ]
                    </a>
                    <a
                        href="#contact"
                        className="font-body text-[10px] tracking-[0.4em] uppercase px-8 sm:px-10 py-4 border border-amber/30 text-amber hover:bg-amber hover:text-black transition-all"
                    >
                        SIGNAL_ENTRY
                    </a>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-24 sm:bottom-32 hidden sm:flex flex-col items-center gap-4"
            >
                <div className="w-px h-12 bg-gradient-to-b from-amber to-transparent animate-pulse" />
                <span className="font-body text-[8px] tracking-[0.5em] text-[#333] uppercase">Scroll</span>
            </motion.div>

            {/* Looping Ticker */}
            <div className="absolute bottom-0 w-full py-6 overflow-hidden bg-black/20 md:backdrop-blur-sm">
                <div className="flex animate-marquee whitespace-nowrap will-change-transform">
                    {Array(2).fill(tickerItems).flat().map((item, i) => (
                        <span key={i} className="font-body text-[9px] tracking-[0.4em] text-[#222] uppercase px-12 flex items-center">
                            {item} <span className="ml-12 w-1 h-1 bg-amber/20 rounded-full" />
                        </span>
                    ))}
                </div>
            </div>

            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
        </section>
    );
}
