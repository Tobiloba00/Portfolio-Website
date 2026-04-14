'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SectionHeader from './SectionHeader';
import { TypewriterSegment } from './TypewriterOnView';

function renderSegments(segments: TypewriterSegment[]) {
    return segments.map((seg, i) => (
        <span key={i} className={seg.className}>{seg.text}</span>
    ));
}

type Stat = { value: number; suffix: string; label: string };

const stats: Stat[] = [
    { value: 12, suffix: '+', label: 'AUTOMATION SYSTEMS BUILT' },
    { value: 2, suffix: '', label: 'ACTIVE UK CLIENTS' },
    { value: 10, suffix: '+', label: 'PRODUCTS SHIPPED' },
    { value: 2000, suffix: '+', label: 'YOUTUBE VIEWS // FIRST MONTH' },
    { value: 1, suffix: '', label: 'STARTUP CO-FOUNDED' },
    { value: 95, suffix: '%', label: 'BANDWIDTH REDUCTION // CLIENT INFRA' },
];

const bioP1: TypewriterSegment[] = [
    { text: "I'm Olujimi — I build systems that work when real people are using them on a bad day." },
];

const bioP2: TypewriterSegment[] = [
    { text: "Right now I'm running the customer operations backend for two UK brands: " },
    { text: "Mocha Properties", className: "text-amber" },
    { text: " (real estate) and " },
    { text: "BIUK", className: "text-amber" },
    { text: ", the team behind ProFoam. That means n8n workflows moving live data between their tools, custom support infrastructure built on Chatwoot and DigitalOcean, and integrations with WhatsApp, Monday.com, Notion and Shopify — so their teams stop copy-pasting between tabs and actually close tickets." },
];

const bioP3: TypewriterSegment[] = [
    { text: "Alongside that I co-founded " },
    { text: "Omniai", className: "text-amber" },
    { text: ", an AI automation company helping businesses ship the internal systems they never had time to build. I've shipped a Telegram-to-Notion OCR pipeline running on Mistral, a lead generation system pulling from Apollo via Apify with AI-personalised Gmail outreach, a university AI agent, and a self-hosted support stack built from scratch on DigitalOcean." },
];

const bioP4: TypewriterSegment[] = [
    { text: "On the product side: a peer-to-peer university marketplace, a mobile employee tracking app, an AI math tutoring app live on iOS and Android, a lenticular art marketplace with a " },
    { text: "95% bandwidth reduction", className: "text-white" },
    { text: " via dual-bucket image compression, and a mobile app (Fayvrs) with RevenueCat in-app purchases shipped through TestFlight and App Store Connect." },
];

const bioP5: TypewriterSegment[] = [
    { text: "I built a full lenticular art marketplace for a UK client — custom sprite sheet generation, a canvas-based interactive viewer that responds to mouse, touch and gyroscope, and a dual-bucket image pipeline that cut their Supabase bandwidth costs by " },
    { text: "95%", className: "text-white" },
    { text: "." },
];

const bioP6: TypewriterSegment[] = [
    { text: "The thing I care about more than the stack: " },
    { text: "does it still work when a real person is using it on a bad day?", className: "text-white" },
];

function CountUp({ value, suffix, duration = 1400 }: { value: number; suffix: string; duration?: number }) {
    const [n, setN] = useState(0);
    const ref = useRef<HTMLSpanElement | null>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && !started.current) {
                    started.current = true;
                    const start = performance.now();
                    const tick = (t: number) => {
                        const p = Math.min(1, (t - start) / duration);
                        const eased = 1 - Math.pow(1 - p, 3);
                        setN(Math.round(value * eased));
                        if (p < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                    io.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [value, duration]);

    return (
        <span ref={ref}>
            {n.toLocaleString()}{suffix}
        </span>
    );
}

export default function About() {
    return (
        <section id="about" className="relative py-24 md:py-32 px-5 md:px-6 bg-[#080808]">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    label="01 // IDENTITY"
                    title="BUILDER AT THE"
                    accentTitle="INTERSECTION."
                />

                <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start">
                    {/* Left — Bio */}
                    <div className="space-y-6 md:space-y-7">
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6 }}
                            className="font-body text-[#eaeaea] text-base md:text-lg leading-relaxed"
                        >
                            {renderSegments(bioP1)}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                            className="font-body text-[#aaa] text-sm md:text-base leading-relaxed"
                        >
                            {renderSegments(bioP2)}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="font-body text-[#aaa] text-sm md:text-base leading-relaxed"
                        >
                            {renderSegments(bioP3)}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="font-body text-[#aaa] text-sm md:text-base leading-relaxed"
                        >
                            {renderSegments(bioP4)}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="font-body text-[#aaa] text-sm md:text-base leading-relaxed"
                        >
                            {renderSegments(bioP5)}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="font-body text-[#888] text-sm md:text-base leading-relaxed"
                        >
                            {renderSegments(bioP6)}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="flex items-center gap-4 pt-6 mt-2 border-t border-white/5"
                        >
                            <div className="flex flex-col">
                                <span className="font-body text-[10px] tracking-[0.4em] text-[#444] uppercase mb-1">Status</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-body text-xs text-green-neon tracking-widest uppercase">
                                        Available for projects
                                    </span>
                                    <motion.span
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="w-2 h-2 rounded-full bg-green-neon"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:sticky lg:top-28">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.08 }}
                                className="p-5 sm:p-6 md:p-7 border border-white/5 bg-[#0a0a0a] group hover:border-amber/40 transition-all duration-500"
                            >
                                <div className="font-display text-4xl sm:text-5xl md:text-6xl text-white group-hover:text-amber transition-colors duration-300 mb-3 md:mb-4 tabular-nums">
                                    <CountUp value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="font-body text-[9px] md:text-[10px] tracking-[0.25em] text-[#555] uppercase leading-tight group-hover:text-[#888]">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
