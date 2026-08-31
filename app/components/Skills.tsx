'use client';

import { useEffect, useRef } from 'react';
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

class NodeObj {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    name: string;
    color: string;
    category: CategoryKey;

    constructor(canvas: HTMLCanvasElement, skill: Skill) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = 2.5;
        this.name = skill.name;
        this.color = categoryColors[skill.category];
        this.category = skill.category;
    }

    update(canvas: HTMLCanvasElement) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw(ctx: CanvasRenderingContext2D, isHovered: boolean) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, isHovered ? 5 : this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        if (isHovered) {
            ctx.shadowBlur = 18;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.font = isHovered ? 'bold 11px JetBrains Mono' : '10px JetBrains Mono';
        ctx.fillStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.45)';
        ctx.fillText(this.name, this.x + 10, this.y + 4);
    }
}

const CONNECT_DIST = 120;

export default function Skills() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodesRef = useRef<NodeObj[]>([]);
    const hoveredRef = useRef<NodeObj | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = window.innerWidth < 640 ? 460 : window.innerWidth < 1024 ? 560 : 640;
        };

        resize();
        window.addEventListener('resize', resize);

        nodesRef.current = skills.map(skill => new NodeObj(canvas, skill));

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Lines
            const nodes = nodesRef.current;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        ctx.beginPath();
                        if (a.category === b.category) {
                            ctx.strokeStyle = a.color + '33';
                            ctx.lineWidth = 0.7;
                        } else {
                            ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / CONNECT_DIST)})`;
                            ctx.lineWidth = 0.5;
                        }
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // Nodes
            const hovered = hoveredRef.current;
            for (const node of nodes) {
                node.update(canvas);
                node.draw(ctx, node === hovered);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let found: NodeObj | null = null;
        for (const node of nodesRef.current) {
            const dx = x - node.x;
            const dy = y - node.y;
            if (Math.sqrt(dx * dx + dy * dy) < 18) {
                found = node;
                break;
            }
        }
        hoveredRef.current = found;
    };

    const handleMouseLeave = () => {
        hoveredRef.current = null;
    };

    const categoryList: CategoryKey[] = [
        'AI & Automation',
        'Frontend',
        'Backend & Database',
        'Mobile',
        'Infrastructure',
        'Platforms & Tools',
    ];

    return (
        <section id="skills" className="relative py-24 md:py-32 px-5 md:px-6 bg-[#080808]">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    label="03 // STACK"
                    title="TECHNICAL"
                    accentTitle="CONSTELLATION."
                />

                <div className="relative mt-12 bg-[#0a0a0a] border border-white/5 overflow-hidden group">
                    <div className="absolute top-4 left-6 z-10 pointer-events-none">
                        <p className="font-body text-[8px] tracking-[0.4em] text-[#333] uppercase">
                            Interactable // Node Graph v2.1
                        </p>
                    </div>

                    <canvas
                        ref={canvasRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="w-full cursor-none"
                    />

                    {/* Stats Bar */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-4 md:p-6 border-t border-white/5 bg-black/50 backdrop-blur-sm flex gap-5 md:gap-10 overflow-x-auto no-scrollbar">
                        {categoryList.map(cat => (
                            <div key={cat} className="flex items-center gap-2.5 flex-shrink-0">
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: categoryColors[cat] }}
                                />
                                <span className="font-body text-[9px] md:text-[10px] tracking-widest text-[#666] uppercase whitespace-nowrap">{cat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
