'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import { posts } from '../blog/posts';

export default function Blog() {
    return (
        <section id="blog" className="relative py-24 md:py-32 px-5 md:px-6 bg-[#080808]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-20 gap-6 md:gap-8">
                    <SectionHeader
                        label="05 // INTELLIGENCE"
                        title="THOUGHTS &"
                        accentTitle="WRITINGS."
                    />

                    <Link
                        href="/blog"
                        className="font-body text-[10px] tracking-[0.4em] uppercase text-[#555] hover:text-amber transition-colors flex items-center gap-4 mb-2"
                    >
                        Access Full Archive <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-1">
                    {posts.map((post, i) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                            <Link
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col h-full bg-[#0a0a0a] border border-white/5 p-7 md:p-10 hover:bg-[#0e0e0e] hover:border-amber/20 transition-all duration-500"
                            >
                                <div className="font-body text-[8px] tracking-[0.4em] text-[#333] group-hover:text-amber/40 transition-colors uppercase mb-6 md:mb-8 flex items-center gap-3">
                                    FILE_{String(i + 1).padStart(2, '0')}
                                    <span className="w-4 h-px bg-[#222]" />
                                    {post.category}
                                </div>

                                <h3 className="font-sub text-lg md:text-xl font-bold text-white group-hover:text-amber transition-colors mb-4 md:mb-6 leading-snug">
                                    {post.title}
                                </h3>

                                <p className="font-body text-xs text-[#666] leading-relaxed mb-6 md:mb-8 group-hover:text-[#888] flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center gap-4 mt-auto">
                                    <span className="font-body text-[10px] tracking-[0.4em] uppercase text-amber">READ_POST</span>
                                    <div className="w-8 h-px bg-amber/30 group-hover:w-16 transition-all duration-500" />
                                    <span className="font-body text-[9px] tracking-[0.3em] text-[#444] uppercase ml-auto">{post.readTime}</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
