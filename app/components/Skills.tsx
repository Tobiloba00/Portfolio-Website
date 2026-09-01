'use client';

import { useEffect, useRef, useState } from 'react';
import TagCloud from 'TagCloud';
import SectionHeader from './SectionHeader';

export type CategoryKey =
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

export const categoryColors: Record<CategoryKey, string> = {
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

export default function Skills() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

    // Only run the tag cloud while the section is actually on screen.
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
        const container = containerRef.current;
        if (!container) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const radius = window.innerWidth < 640 ? 135 : window.innerWidth < 1024 ? 175 : 220;

        const texts = skills.map(
            (s) => `<span style="color:${categoryColors[s.category]}">${s.name}</span>`
        );

        const cloud = TagCloud(container, texts, {
            radius,
            maxSpeed: 'fast',
            initSpeed: 'slow',
            keep: true,
            useHTML: true,
        });

        if (prefersReducedMotion) cloud.pause();

        return () => {
            cloud.destroy();
        };
    }, [inView]);

    // Dim everything outside the selected category without touching the
    // inline transform/opacity the library animates every frame.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const items = container.querySelectorAll<HTMLElement>('.tagcloud--item');
        items.forEach((item, i) => {
            const cat = skills[i]?.category;
            item.style.filter = !selectedCategory || cat === selectedCategory
                ? ''
                : 'brightness(0.25) saturate(0.4)';
        });
    }, [selectedCategory, inView]);

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
                            Interactable // Every Skill, All At Once
                        </p>
                    </div>

                    <div className="flex justify-center px-6 md:px-10 pt-16 pb-10">
                        <div
                            ref={containerRef}
                            className="relative w-full max-w-[720px] mx-auto"
                            style={{ height: 480 }}
                        />
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
