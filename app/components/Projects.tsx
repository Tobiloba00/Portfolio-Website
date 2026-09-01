'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

type Project = {
    id: string;
    name: string;
    type: string;
    description: string;
    stack: string[];
    status: string;
    link?: string;
};

const projects: Project[] = [
    {
        id: '01',
        name: 'BIUK Customer Operations Stack',
        type: 'Client Infrastructure',
        description: "Migrated a client's entire support system off Freshdesk and onto a self-hosted Chatwoot instance running on DigitalOcean. Built WhatsApp integration through Meta's Cloud API, an AI-powered order-tracking bot connected to Shopify, and automated response flows for a team handling daily customer operations end to end.",
        stack: ['AI Automation', 'Chatwoot', 'DigitalOcean', 'WhatsApp API', 'Shopify API', 'Meta Cloud API'],
        status: 'Past client work',
    },
    {
        id: '02',
        name: 'Mocha Properties Automation System',
        type: 'Client Automation',
        description: 'End-to-end property management automation. Maintenance requests triaged automatically, contractors matched and messaged, landlord reports generated — all without manual intervention. Built entirely with AI automation workflows, with an agent in the loop for classification and drafting.',
        stack: ['AI Automation', 'Notion', 'Google Drive', 'AI Agent', 'Gmail'],
        status: 'Past client work',
    },
    {
        id: '03',
        name: 'Apollo → AI → Gmail Lead Pipeline',
        type: 'Automation System',
        description: 'Full lead generation engine. Scrapes decision-maker contacts from Apollo via Apify, runs each lead through an AI agent for personalised outreach research, drafts custom emails, and sends through Gmail. Triggered from Telegram and logged back to a sheet.',
        stack: ['AI Automation', 'Apify', 'Apollo.io', 'OpenRouter', 'Gmail', 'Google Sheets', 'Telegram'],
        status: 'Shipped',
    },
    {
        id: '04',
        name: 'Telegram → Notion OCR Pipeline',
        type: 'AI Automation',
        description: 'Receives unstructured Telegram messages containing document data, runs OCR, passes the content through Mistral for interpretation, decides whether to create or update a Notion record, preserves existing fields, logs every action, and sends a structured summary back to Telegram.',
        stack: ['AI Automation', 'Telegram', 'Mistral AI', 'Notion API', 'OCR', 'Webhooks'],
        status: 'Shipped',
    },
    {
        id: '05',
        name: 'CampusLink',
        type: 'Startup / Marketplace Product',
        description: 'Peer-to-peer marketplace platform for university students. Students post tasks, request services, and connect with others on campus. Built from MVP with full branding, logo, UI/UX across dark and light modes, a Twitter-style comment and threading system, and a school verification role system.',
        stack: ['Next.js', 'Supabase', 'React', 'TypeScript', 'Tailwind CSS'],
        status: 'Near launch',
        link: 'https://campuslink-self.vercel.app',
    },
    {
        id: '06',
        name: 'Self-Hosted Clawdbot / OpenClaw',
        type: 'AI Infrastructure',
        description: 'Deployed and maintained a self-hosted AI assistant on a DigitalOcean VPS. Configured OAuth authentication, Telegram integration, rate limiting, model switching between providers (Anthropic, DeepSeek, OpenRouter), and maintained 24/7 uptime through multiple configuration challenges.',
        stack: ['DigitalOcean', 'Docker', 'OAuth', 'Telegram', 'OpenRouter', 'Anthropic API'],
        status: 'Shipped',
    },
    {
        id: '07',
        name: 'JP Math Path — AI Tutor',
        type: 'Client Product',
        description: 'Converted a Replit-based AI math tutoring web app into a fully packaged iOS and Android application. Handled Capacitor integration, Codemagic CI/CD pipeline, App Store Connect submission, and Google Play deployment from scratch.',
        stack: ['Replit', 'Capacitor', 'Codemagic', 'iOS', 'Android', 'App Store Connect'],
        status: 'Live on iOS & Android',
    },
    {
        id: '08',
        name: 'Lenticular Art Marketplace',
        type: 'Product / Client',
        description: 'React + Supabase marketplace for lenticular art. Solved sprite sheet thumbnail bugs, implemented bidirectional Notion sync, and shipped a dual-bucket image compression pipeline that reduced client bandwidth costs by roughly 95%.',
        stack: ['React', 'Supabase', 'Base44', 'Notion API', 'Cloudflare'],
        status: 'Shipped',
    },
    {
        id: '09',
        name: 'Fayvrs Mobile App',
        type: 'Product',
        description: 'Mobile application with full in-app purchase infrastructure. Integrated RevenueCat for subscription and purchase management, handled App Store Connect and TestFlight testing phases all the way through to launch.',
        stack: ['React Native', 'RevenueCat', 'App Store Connect', 'TestFlight'],
        status: 'Shipped',
    },
    {
        id: '10',
        name: 'Supabase → Notion Sync',
        type: 'Automation',
        description: 'One-way automated sync using Supabase Edge Functions and webhooks. Artist applications submitted on a web form flow automatically into a structured Notion workspace for review — zero manual export, zero dropped submissions.',
        stack: ['Supabase Edge Functions', 'Webhooks', 'Notion API'],
        status: 'Shipped',
    },
    {
        id: '11',
        name: 'FUOYE AI University Agent',
        type: 'AI System',
        description: 'AI assistant designed for university use at FUOYE. Built with AI automation workflows and LLM integration, handling student queries through a no-code architecture that non-engineers on staff can actually maintain.',
        stack: ['AI Automation', 'LLM Integration', 'AI Agent'],
        status: 'Built',
    },
    {
        id: '12',
        name: 'NEXUS Protocol',
        type: 'Web3 Dashboard',
        description: 'A production-grade Web3 dashboard shipped as a single static HTML file — markets, NFTs, staking, governance and analytics, wired to live on-chain data from public APIs with graceful fallbacks. Ships with a persistent light/dark/auto theme system and a hidden admin panel for live rebranding across three preset configs, fully responsive down to a mobile drawer and bottom-sheet modals.',
        stack: ['React', 'Tailwind CSS', 'CoinGecko API', 'Solana.fm'],
        status: 'Shipped',
        link: 'https://nexus-protocol-inky.vercel.app',
    },
    {
        id: '13',
        name: 'Salama',
        type: 'Product Concept',
        description: 'Ride-sharing app concept connecting urban commuters with vetted two-wheeler drivers. Covers instant rides, remote assistance, group transport and parcel delivery, with rider verification, in-app cashless payment, saved locations and booking history.',
        stack: ['Mobile UX', 'Product Design', 'Ride-hailing'],
        status: 'Concept / mockup',
        link: 'https://salama-app-mockup.vercel.app',
    },
    {
        id: '14',
        name: 'DeflecTech',
        type: 'Client Web Project',
        description: 'Marketing site for a vehicle safety and intelligent mobility technology company, positioning their safety systems and mobility solutions to automotive manufacturers, fleet operators and transportation organisations.',
        stack: ['HTML', 'CSS', 'JavaScript'],
        status: 'Shipped',
        link: 'https://deflectech-site.vercel.app',
    },
    {
        id: '15',
        name: 'Omniai',
        type: 'Startup / Company Site',
        description: 'Marketing site for Omniai, the AI automation company I co-founded. Covers starter automations, full workflow systems and custom AI builds for small-to-mid-size teams, built around a five-step delivery methodology from requirement analysis through deployment and training.',
        stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        status: 'Live',
        link: 'https://omniai-site.vercel.app',
    },
];

export default function Projects() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <section id="work" className="relative py-24 md:py-32 px-5 md:px-6 bg-[#080808]">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    label="02 // WORK"
                    title="SELECTED"
                    accentTitle="SYSTEMS."
                />

                <div className="mt-20 relative">
                    {/* Projects List */}
                    <div className="border-t border-white/10">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                onMouseEnter={() => setHoveredId(project.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => setSelectedProject(project)}
                                className="group relative flex items-center justify-between py-6 md:py-9 border-b border-white/10 md:hover:px-8 transition-all duration-500 cursor-pointer overflow-hidden"
                            >
                                {/* Hover Amber Border */}
                                <div className="absolute left-0 top-0 bottom-0 w-0 bg-amber transition-all duration-500 group-hover:w-1.5" />

                                <div className="flex items-center gap-5 sm:gap-10 md:gap-16 relative z-10 min-w-0 flex-1">
                                    <span className="font-body text-xs sm:text-sm text-[#444] group-hover:text-amber transition-colors flex-shrink-0">
                                        {project.id}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-white group-hover:translate-x-3 transition-transform duration-500 truncate">
                                            {project.name}
                                        </h3>
                                        <p className="font-body text-[9px] md:text-[10px] tracking-[0.25em] text-[#555] uppercase mt-1 md:mt-2 group-hover:text-amber/60 transition-colors">
                                            {project.type}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center gap-8 lg:gap-12 relative z-10 flex-shrink-0">
                                    <div className="font-body text-[10px] tracking-[0.2em] text-[#555] uppercase hidden lg:block">
                                        {project.stack.slice(0, 2).join(' · ')}
                                    </div>
                                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center rounded-full group-hover:border-amber group-hover:bg-amber transition-all">
                                        <ArrowRight size={18} className="text-white group-hover:text-black transition-colors" />
                                    </div>
                                </div>

                                {/* Ghost Preview (Desktop only) */}
                                <AnimatePresence>
                                    {hoveredId === project.id && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 0.15, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="absolute right-[10%] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
                                        >
                                            <div className="w-[380px] h-[220px] bg-amber/20 border border-amber/40 flex items-center justify-center font-display text-8xl text-amber/20">
                                                {project.id}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Project Modal */}
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-start md:items-center justify-center p-5 md:p-12 overflow-y-auto"
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="fixed top-5 right-5 md:top-8 md:right-8 text-white hover:text-amber transition-colors p-2 z-10"
                                aria-label="Close"
                            >
                                <X size={28} className="md:w-8 md:h-8" />
                            </button>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: 0.05 }}
                                onClick={(e) => e.stopPropagation()}
                                className="max-w-4xl w-full my-12 md:my-0"
                            >
                                <div className="space-y-6 md:space-y-8">
                                    <div className="flex items-center gap-4 font-body text-[10px] sm:text-xs tracking-[0.4em] uppercase">
                                        <span className="text-amber">Project // {selectedProject.id}</span>
                                        <span className="w-8 h-px bg-[#333]" />
                                        <span className="text-[#666]">{selectedProject.type}</span>
                                    </div>

                                    <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white uppercase leading-[0.95]">
                                        {selectedProject.name}
                                    </h2>

                                    <p className="font-body text-[#bbb] text-base md:text-lg leading-relaxed max-w-3xl">
                                        {selectedProject.description}
                                    </p>

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {selectedProject.stack.map(tag => (
                                            <span key={tag} className="font-body text-[10px] tracking-widest uppercase px-4 py-2 bg-white/5 border border-white/10 text-white">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-4">
                                            <span className="font-body text-[10px] tracking-[0.4em] text-[#444] uppercase">Status</span>
                                            <span className="flex items-center gap-3 font-body text-xs tracking-widest uppercase text-green-neon">
                                                <span className="w-2 h-2 rounded-full bg-green-neon animate-pulse" />
                                                {selectedProject.status}
                                            </span>
                                        </div>
                                        {selectedProject.link && (
                                            <a
                                                href={selectedProject.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="group flex items-center gap-2 font-body text-xs tracking-widest uppercase text-amber hover:text-white transition-colors"
                                            >
                                                Visit Live Site
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
