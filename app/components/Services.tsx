'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionHeader from './SectionHeader';

const services = [
    {
        id: '01',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="6" width="12" height="12" stroke="#F5A623" strokeWidth="1.5" />
                <circle cx="28" cy="28" r="6" stroke="#F5A623" strokeWidth="1.5" />
                <line x1="18" y1="12" x2="22" y2="12" stroke="#F5A623" strokeWidth="1.5" />
                <line x1="12" y1="18" x2="12" y2="22" stroke="#F5A623" strokeWidth="1.5" />
            </svg>
        ),
        title: 'AI Workflow Automation',
        description: 'I build n8n pipelines that connect your tools and remove manual work permanently. Lead gen, customer support automation, document processing, CRM syncing, AI-powered triage — if it can be automated, I\'ll build it so it runs without you touching it.',
    },
    {
        id: '02',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <polyline points="6,28 14,18 20,24 34,10" stroke="#F5A623" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                <rect x="4" y="30" width="32" height="3" rx="1" fill="#F5A623" opacity="0.3" />
            </svg>
        ),
        title: 'Full-Stack Web Development',
        description: 'React and Next.js web apps, SaaS products, marketplace platforms, internal dashboards and landing pages. Stack of choice: Next.js + Supabase + Tailwind. I focus on things that are fast, clean, and actually maintainable.',
    },
    {
        id: '03',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M6 8 h28 v20 h-14 l-6 6 v-6 h-8 z" stroke="#F5A623" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="14" cy="18" r="1.5" fill="#F5A623" />
                <circle cx="20" cy="18" r="1.5" fill="#F5A623" />
                <circle cx="26" cy="18" r="1.5" fill="#F5A623" />
            </svg>
        ),
        title: 'Customer Support Infrastructure',
        description: 'Self-hosted Chatwoot deployments, WhatsApp Business API integration, support workflow automation, multi-channel inbox setup. I build the backend of customer operations — so your team stops switching tabs and starts actually closing tickets.',
    },
    {
        id: '04',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="12" y="4" width="16" height="32" rx="3" stroke="#F5A623" strokeWidth="1.5" />
                <circle cx="20" cy="32" r="1.5" fill="#F5A623" />
            </svg>
        ),
        title: 'Mobile App Development',
        description: 'Cross-platform mobile apps via Capacitor, no-code apps via Adalo, App Store and Google Play submission end-to-end. I\'ve handled the full pipeline — build, test, submit, ship — more than once.',
    },
];

function TiltCard({ service, index }: { service: typeof services[0], index: number }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.12 }}
            className="relative h-full bg-[#0a0a0a] border border-white/5 p-7 md:p-9 group cursor-none overflow-hidden"
        >
            <div
                style={{ transform: "translateZ(50px)" }}
                className="absolute -top-20 -left-20 w-40 h-40 bg-amber/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div style={{ transform: "translateZ(75px)" }} className="relative z-10">
                <div className="flex items-center gap-3 mb-5 md:mb-7">
                    <span className="font-body text-[10px] tracking-[0.3em] text-amber/60 uppercase">
                        {service.id}
                    </span>
                    <span className="w-6 h-px bg-amber/30" />
                </div>
                <div className="mb-5 md:mb-6">{service.icon}</div>
                <h3 className="font-display text-xl md:text-2xl tracking-widest uppercase text-white mb-4 md:mb-5 group-hover:text-amber transition-colors leading-tight">
                    {service.title}
                </h3>
                <p className="font-body text-[13px] md:text-sm text-[#888] leading-relaxed">
                    {service.description}
                </p>
            </div>

            <div className="absolute bottom-0 left-0 h-0.5 bg-amber w-0 group-hover:w-full transition-all duration-700" />
        </motion.div>
    );
}

export default function Services() {
    return (
        <section id="services" className="relative py-24 md:py-32 px-5 md:px-6 bg-[#080808]">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    label="04 // WHAT I BUILD"
                    title="CORE"
                    accentTitle="OFFERINGS."
                />

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-12" style={{ perspective: "1000px" }}>
                    {services.map((service, i) => (
                        <TiltCard key={service.title} service={service} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
