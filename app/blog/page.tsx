import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { posts } from './posts';
import Footer from '../components/Footer';

export const metadata: Metadata = {
    title: 'Blog — Tobiloba Olujimi',
    description: 'Writings on automation, client work and building production systems.',
};

export default function BlogIndexPage() {
    return (
        <>
            <main className="relative pt-40 md:pt-48 pb-24 px-5 md:px-6 min-h-screen">
                <div className="max-w-6xl mx-auto">

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 font-body text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#555] hover:text-amber transition-colors mb-12"
                    >
                        <ArrowLeft size={14} /> Back Home
                    </Link>

                    <p className="font-body text-[10px] tracking-[0.6em] text-amber uppercase mb-5 flex items-center gap-4">
                        <span className="w-8 h-px bg-amber/40" />
                        05 // INTELLIGENCE
                    </p>

                    <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-white leading-[0.9] mb-6">
                        THOUGHTS &
                        <span className="block text-amber mt-2">WRITINGS.</span>
                    </h1>

                    <p className="font-body text-[#777] text-base md:text-lg max-w-2xl leading-relaxed mb-20">
                        Essays on building automation that survives real users, working across
                        borders, and the projects that taught me the most.
                    </p>

                    <div className="grid gap-1">
                        {posts.map((post, i) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group block bg-[#0a0a0a] border border-white/5 hover:bg-[#0e0e0e] hover:border-amber/20 transition-all duration-500 p-7 md:p-12"
                            >
                                <div className="grid md:grid-cols-[auto,1fr,auto] gap-6 md:gap-12 items-start">

                                    <div className="font-body text-[9px] md:text-[10px] tracking-[0.4em] text-[#333] group-hover:text-amber/40 uppercase flex items-center gap-4">
                                        <span>FILE_{String(i + 1).padStart(2, '0')}</span>
                                        <span className="w-6 h-px bg-[#222]" />
                                        <span>{post.category}</span>
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl text-white group-hover:text-amber transition-colors uppercase leading-[1] tracking-tight">
                                            {post.title}
                                        </h2>
                                        <p className="font-body text-sm md:text-base text-[#777] leading-relaxed max-w-3xl">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 pt-2">
                                            <span className="font-body text-[10px] tracking-[0.4em] text-amber uppercase">Read</span>
                                            <span className="w-8 h-px bg-amber/30 group-hover:w-16 transition-all duration-500" />
                                            <span className="font-body text-[10px] tracking-[0.3em] text-[#444] uppercase">{post.readTime}</span>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex w-12 h-12 border border-white/10 items-center justify-center rounded-full group-hover:border-amber group-hover:bg-amber transition-all flex-shrink-0 mt-2">
                                        <ArrowRight size={18} className="text-white group-hover:text-black transition-colors" />
                                    </div>

                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
