'use client';

import { useEffect, useRef, useState } from 'react';
import createGlobe, { type Marker } from 'cobe';
import SectionHeader from './SectionHeader';

type CategoryKey =
    | 'AI & Automation'
    | 'Frontend'
    | 'Backend & Database'
    | 'Mobile'
    | 'Infrastructure'
    | 'Platforms & Tools';

type Skill = {
    name: string;
    category: CategoryKey;
};

const categoryColors: Record<CategoryKey, string> = {
    'AI & Automation': '#F5A623',
    'Frontend': '#00FF94',
    'Backend & Database': '#00D4FF',
    'Mobile': '#FF6B9D',
    'Infrastructure': '#A78BFA',
    'Platforms & Tools': '#F0F0F0',
};

const skills: Skill[] = [
    // AI & Automation
    { name: 'Workflow Automation', category: 'AI & Automation' },
    { name: 'LLM Prompt Eng', category: 'AI & Automation' },
    { name: 'AI Agents', category: 'AI & Automation' },
    { name: 'Mistral', category: 'AI & Automation' },
    { name: 'OpenRouter', category: 'AI & Automation' },
    { name: 'Apify', category: 'AI & Automation' },
    { name: 'OCR Processing', category: 'AI & Automation' },
    { name: 'Telegram Bots', category: 'AI & Automation' },
    { name: 'Zapier', category: 'AI & Automation' },
    { name: 'Chatwoot', category: 'AI & Automation' },

    // Frontend
    { name: 'React.js', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'HTML/CSS', category: 'Frontend' },
    { name: 'Framer Motion', category: 'Frontend' },

    // Backend & Database
    { name: 'Supabase', category: 'Backend & Database' },
    { name: 'Firebase', category: 'Backend & Database' },
    { name: 'Appwrite', category: 'Backend & Database' },
    { name: 'Node.js', category: 'Backend & Database' },
    { name: 'Python', category: 'Backend & Database' },
    { name: 'Notion API', category: 'Backend & Database' },
    { name: 'PostgreSQL', category: 'Backend & Database' },
    { name: 'Edge Functions', category: 'Backend & Database' },
    { name: 'Webhooks', category: 'Backend & Database' },

    // Mobile
    { name: 'Capacitor', category: 'Mobile' },
    { name: 'React Native', category: 'Mobile' },
    { name: 'Adalo', category: 'Mobile' },
    { name: 'App Store Connect', category: 'Mobile' },
    { name: 'TestFlight', category: 'Mobile' },
    { name: 'Codemagic', category: 'Mobile' },
    { name: 'RevenueCat', category: 'Mobile' },
    { name: 'Google Play', category: 'Mobile' },

    // Infrastructure
    { name: 'DigitalOcean', category: 'Infrastructure' },
    { name: 'Vercel', category: 'Infrastructure' },
    { name: 'Cloudflare', category: 'Infrastructure' },
    { name: 'GitHub', category: 'Infrastructure' },
    { name: 'Hostinger', category: 'Infrastructure' },
    { name: 'Docker', category: 'Infrastructure' },
    { name: 'DNS / SSL', category: 'Infrastructure' },
    { name: 'Netlify', category: 'Infrastructure' },

    // Platforms & Tools
    { name: 'Lovable.dev', category: 'Platforms & Tools' },
    { name: 'Bolt.new', category: 'Platforms & Tools' },
    { name: 'Replit', category: 'Platforms & Tools' },
    { name: 'Firebase Studio', category: 'Platforms & Tools' },
    { name: 'Base44', category: 'Platforms & Tools' },
    { name: 'Cursor', category: 'Platforms & Tools' },
    { name: 'Shopify API', category: 'Platforms & Tools' },
    { name: 'WhatsApp Cloud API', category: 'Platforms & Tools' },
    { name: 'Meta Business Suite', category: 'Platforms & Tools' },
    { name: 'Stripe', category: 'Platforms & Tools' },
    { name: 'Apollo.io', category: 'Platforms & Tools' },
];

const categoryList: CategoryKey[] = [
    'AI & Automation',
    'Frontend',
    'Backend & Database',
    'Mobile',
    'Infrastructure',
    'Platforms & Tools',
];

// One pin per category — arbitrary but spread-out coordinates, not literal locations.
const categoryMarkers: { category: CategoryKey; location: [number, number] }[] = [
    { category: 'AI & Automation', location: [6.5244, 3.3792] }, // Lagos
    { category: 'Frontend', location: [37.7749, -122.4194] }, // San Francisco
    { category: 'Backend & Database', location: [51.5074, -0.1278] }, // London
    { category: 'Mobile', location: [1.3521, 103.8198] }, // Singapore
    { category: 'Infrastructure', location: [52.3676, 4.9041] }, // Amsterdam
    { category: 'Platforms & Tools', location: [-33.8688, 151.2093] }, // Sydney
];

function hexToRgb01(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    return [
        parseInt(clean.substring(0, 2), 16) / 255,
        parseInt(clean.substring(2, 4), 16) / 255,
        parseInt(clean.substring(4, 6), 16) / 255,
    ];
}

function buildMarkers(selected: CategoryKey | null): Marker[] {
    return categoryMarkers.map((m) => ({
        location: m.location,
        size: selected === m.category ? 0.14 : 0.08,
        color: hexToRgb01(categoryColors[m.category]),
    }));
}

export default function Skills() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const widthRef = useRef(0);
    const phiRef = useRef(0);
    const pointerInteracting = useRef<number | null>(null);
    const pointerMovement = useRef(0);
    const selectedCategoryRef = useRef<CategoryKey | null>(null);

    const [inView, setInView] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

    useEffect(() => {
        selectedCategoryRef.current = selectedCategory;
    }, [selectedCategory]);

    // Only run the globe while the section is actually on screen.
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        const onResize = () => {
            widthRef.current = canvas.offsetWidth;
        };
        window.addEventListener('resize', onResize);
        onResize();

        const globe = createGlobe(canvas, {
            devicePixelRatio,
            width: widthRef.current * devicePixelRatio,
            height: widthRef.current * devicePixelRatio,
            phi: phiRef.current,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 12000,
            mapBrightness: 6,
            baseColor: [0.25, 0.25, 0.25],
            markerColor: [0.96, 0.65, 0.14],
            glowColor: [0.15, 0.15, 0.15],
            markers: buildMarkers(selectedCategoryRef.current),
        });

        let animationFrameId: number;
        const render = () => {
            if (!prefersReducedMotion && pointerInteracting.current === null) {
                phiRef.current += 0.004;
            }
            globe.update({
                phi: phiRef.current + pointerMovement.current,
                width: widthRef.current * devicePixelRatio,
                height: widthRef.current * devicePixelRatio,
                markers: buildMarkers(selectedCategoryRef.current),
            });
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        const onPointerDown = (e: PointerEvent) => {
            pointerInteracting.current = e.clientX - pointerMovement.current * 200;
            canvas.style.cursor = 'grabbing';
        };
        const onPointerUp = () => {
            pointerInteracting.current = null;
            canvas.style.cursor = 'grab';
        };
        const onPointerMove = (e: PointerEvent) => {
            if (pointerInteracting.current !== null) {
                const delta = e.clientX - pointerInteracting.current;
                pointerMovement.current = delta / 200;
            }
        };

        canvas.style.cursor = 'grab';
        canvas.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointermove', onPointerMove);

        return () => {
            window.removeEventListener('resize', onResize);
            canvas.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointermove', onPointerMove);
            cancelAnimationFrame(animationFrameId);
            globe.destroy();
        };
    }, [inView]);

    return (
        <section id="skills" className="relative py-24 md:py-32 px-5 md:px-6 bg-[#080808]">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    label="03 // STACK"
                    title="TECHNICAL"
                    accentTitle="ATLAS."
                />

                <div ref={wrapperRef} className="relative mt-12 bg-[#0a0a0a] border border-white/5 overflow-hidden">
                    <div className="absolute top-4 left-6 z-10 pointer-events-none">
                        <p className="font-body text-[8px] tracking-[0.4em] text-[#333] uppercase">
                            Interactable // Global Atlas v3.0
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 px-6 md:px-10 pt-16 pb-10">
                        {/* Globe */}
                        <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square mx-auto lg:mx-0 flex-shrink-0">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full cursor-pointer touch-none"
                                style={{ contain: 'layout paint size' }}
                            />
                        </div>

                        {/* Selected category skill panel */}
                        <div className="w-full lg:flex-1 min-h-[140px] flex flex-col justify-center">
                            {selectedCategory ? (
                                <>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: categoryColors[selectedCategory] }}
                                        />
                                        <span className="font-body text-xs tracking-[0.35em] uppercase text-white">
                                            {selectedCategory}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {skills
                                            .filter((s) => s.category === selectedCategory)
                                            .map((s) => (
                                                <span
                                                    key={s.name}
                                                    className="font-body text-[10px] tracking-widest uppercase px-3.5 py-2 border border-white/10 bg-white/[0.02] text-[#ccc]"
                                                >
                                                    {s.name}
                                                </span>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <p className="font-body text-xs text-[#555] tracking-widest uppercase leading-relaxed max-w-sm">
                                    Drag the globe to turn it. Select a location below to explore the skills that live there.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category legend — also the category selector */}
                    <div className="px-4 py-4 md:p-6 border-t border-white/5 bg-black/50 backdrop-blur-sm flex gap-5 md:gap-10 overflow-x-auto no-scrollbar">
                        {categoryList.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory((c) => (c === cat ? null : cat))}
                                className="group flex items-center gap-2.5 flex-shrink-0 cursor-pointer"
                            >
                                <div
                                    className="w-1.5 h-1.5 rounded-full transition-transform duration-300"
                                    style={{
                                        backgroundColor: categoryColors[cat],
                                        transform: selectedCategory === cat ? 'scale(1.8)' : 'scale(1)',
                                    }}
                                />
                                <span
                                    className={`font-body text-[9px] md:text-[10px] tracking-widest uppercase whitespace-nowrap transition-colors ${selectedCategory === cat ? 'text-white' : 'text-[#666] group-hover:text-[#999]'
                                        }`}
                                >
                                    {cat}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
