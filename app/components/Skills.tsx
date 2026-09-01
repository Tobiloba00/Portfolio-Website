'use client';

import { useEffect, useRef, useState } from 'react';
import createGlobe, { type Marker } from 'cobe';
import SectionHeader from './SectionHeader';

export type CategoryKey =
    | 'AI & Automation'
    | 'Frontend'
    | 'Backend & Database'
    | 'Mobile'
    | 'Infrastructure'
    | 'Platforms & Tools';

export type Skill = {
    name: string;
    category: CategoryKey;
};

export const categoryColors: Record<CategoryKey, string> = {
    'AI & Automation': '#F5A623',
    'Frontend': '#00FF94',
    'Backend & Database': '#00D4FF',
    'Mobile': '#FF6B9D',
    'Infrastructure': '#A78BFA',
    'Platforms & Tools': '#F0F0F0',
};

export const skills: Skill[] = [
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

// Evenly scatter every skill across the sphere — one "continent" per
// skill — using a Fibonacci-sphere distribution instead of real geography.
const skillLocations: [number, number][] = (() => {
    const n = skills.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return skills.map((_, i) => {
        const y = 1 - (i / (n - 1)) * 2;
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = goldenAngle * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        const lat = (Math.asin(y) * 180) / Math.PI;
        const lng = (Math.atan2(z, x) * 180) / Math.PI;
        return [lat, lng];
    });
})();

function hexToRgb01(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    return [
        parseInt(clean.substring(0, 2), 16) / 255,
        parseInt(clean.substring(2, 4), 16) / 255,
        parseInt(clean.substring(4, 6), 16) / 255,
    ];
}

function buildMarkers(selected: CategoryKey | null): Marker[] {
    return skills.map((s, i) => ({
        location: skillLocations[i],
        size: selected === s.category ? 0.05 : 0.035,
        color: hexToRgb01(categoryColors[s.category]),
    }));
}

// Mirrors COBE's own lat/lng -> unit-sphere-vector conversion so our HTML
// labels can be projected in perfect sync with what the globe renders.
function toUnitVector(lat: number, lng: number): [number, number, number] {
    const phi = (lat * Math.PI) / 180;
    const lambda = (lng * Math.PI) / 180 - Math.PI;
    const cosPhi = Math.cos(phi);
    return [-cosPhi * Math.cos(lambda), Math.sin(phi), cosPhi * Math.sin(lambda)];
}

// Mirrors COBE's internal rotation + perspective projection (same phi/theta
// state we feed into globe.update()) to get each marker's screen position.
function projectToScreen(
    point: [number, number, number],
    rotationPhi: number,
    theta: number
): { x: number; y: number; visible: boolean } {
    const cosTheta = Math.cos(theta);
    const cosPhi = Math.cos(rotationPhi);
    const sinTheta = Math.sin(theta);
    const sinPhi = Math.sin(rotationPhi);
    const c = cosPhi * point[0] + sinPhi * point[2];
    const s = sinPhi * sinTheta * point[0] + cosTheta * point[1] - cosPhi * sinTheta * point[2];
    const x = (c + 1) / 2;
    const y = (-s + 1) / 2;
    const frontFacing = -sinPhi * cosTheta * point[0] + sinTheta * point[1] + cosPhi * cosTheta * point[2];
    const visible = frontFacing >= 0 || c * c + s * s >= 0.64;
    return { x, y, visible };
}

const MARKER_ELEVATION = 0.05;
const GLOBE_SURFACE_RADIUS = 0.8;
const skillUnitVectors = skillLocations.map(([lat, lng]) => {
    const v = toUnitVector(lat, lng);
    const r = GLOBE_SURFACE_RADIUS + MARKER_ELEVATION;
    return [v[0] * r, v[1] * r, v[2] * r] as [number, number, number];
});

export default function Skills() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
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
        const theta = 0.3;

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
            theta,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.96, 0.65, 0.14],
            glowColor: [0.15, 0.15, 0.15],
            markers: buildMarkers(selectedCategoryRef.current),
        });

        let animationFrameId: number;
        const render = () => {
            if (!prefersReducedMotion && pointerInteracting.current === null) {
                phiRef.current += 0.003;
            }
            const currentPhi = phiRef.current + pointerMovement.current;

            globe.update({
                phi: currentPhi,
                width: widthRef.current * devicePixelRatio,
                height: widthRef.current * devicePixelRatio,
                markers: buildMarkers(selectedCategoryRef.current),
            });

            const selected = selectedCategoryRef.current;
            for (let i = 0; i < skills.length; i++) {
                const label = labelRefs.current[i];
                if (!label) continue;
                const { x, y, visible } = projectToScreen(skillUnitVectors[i], currentPhi, theta);
                if (!visible || x < -0.05 || x > 1.05 || y < -0.05 || y > 1.05) {
                    label.style.display = 'none';
                    continue;
                }
                label.style.display = 'block';
                label.style.left = `${x * 100}%`;
                label.style.top = `${y * 100}%`;
                const dimmed = selected && skills[i].category !== selected;
                label.style.opacity = dimmed ? '0.12' : '';
            }

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
                            Interactable // 53 Skills, One World
                        </p>
                    </div>

                    <div className="flex justify-center px-6 md:px-10 pt-16 pb-10">
                        <div className="relative w-full max-w-[520px] aspect-square mx-auto">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full cursor-pointer touch-pan-y"
                            />
                            {skills.map((s, i) => (
                                <span
                                    key={s.name}
                                    ref={(el) => { labelRefs.current[i] = el; }}
                                    className="absolute font-body text-[8px] tracking-wide uppercase whitespace-nowrap pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
                                    style={{
                                        color: categoryColors[s.category],
                                        textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                                    }}
                                >
                                    {s.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Category legend — click to spotlight that category */}
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
