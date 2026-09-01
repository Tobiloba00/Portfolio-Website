import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { posts, getPostBySlug } from '../posts';
import Footer from '../../components/Footer';

export function generateStaticParams() {
    return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: 'Post not found — Tobiloba Olujimi' };
    return {
        title: `${post.title} — Tobiloba Olujimi`,
        description: post.excerpt,
        alternates: {
            canonical: `/blog/${slug}`,
        },
    };
}

function renderInline(text: string, baseKey: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*\n]+\*)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let idx = 0;
    while ((m = regex.exec(text)) !== null) {
        if (m.index > last) parts.push(text.slice(last, m.index));
        const match = m[0];
        if (match.startsWith('**')) {
            parts.push(
                <strong key={`${baseKey}-${idx++}`} className="text-white font-semibold">
                    {match.slice(2, -2)}
                </strong>
            );
        } else {
            parts.push(
                <em key={`${baseKey}-${idx++}`} className="text-[#888] italic">
                    {match.slice(1, -1)}
                </em>
            );
        }
        last = m.index + match.length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

function renderMarkdown(md: string): React.ReactNode {
    const lines = md.split('\n');
    const blocks: React.ReactNode[] = [];
    let para: string[] = [];

    const flush = () => {
        if (para.length === 0) return;
        const text = para.join(' ');
        blocks.push(
            <p
                key={`p-${blocks.length}`}
                className="font-body text-[#bbb] text-base md:text-lg leading-[1.85] tracking-wide mb-6"
            >
                {renderInline(text, `b${blocks.length}`)}
            </p>
        );
        para = [];
    };

    for (const raw of lines) {
        const line = raw.trim();
        if (line === '') { flush(); continue; }
        if (line === '---') {
            flush();
            blocks.push(
                <hr
                    key={`hr-${blocks.length}`}
                    className="border-0 border-t border-white/10 my-12 md:my-14 max-w-xs mx-auto"
                />
            );
            continue;
        }
        if (line.startsWith('## ')) {
            flush();
            blocks.push(
                <h2
                    key={`h2-${blocks.length}`}
                    className="font-display text-3xl md:text-5xl text-white uppercase tracking-wide mt-14 md:mt-16 mb-6 md:mb-8 leading-tight"
                >
                    {line.slice(3)}
                </h2>
            );
            continue;
        }
        if (line.startsWith('### ')) {
            flush();
            blocks.push(
                <h3
                    key={`h3-${blocks.length}`}
                    className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mt-10 mb-4"
                >
                    {line.slice(4)}
                </h3>
            );
            continue;
        }
        para.push(line);
    }
    flush();
    return blocks;
}

export default async function BlogPostPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const currentIdx = posts.findIndex(p => p.slug === slug);
    const prev = currentIdx > 0 ? posts[currentIdx - 1] : null;
    const next = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;

    return (
        <>
            <article className="relative pt-40 md:pt-48 pb-20 px-5 md:px-6 min-h-screen">
                <div className="max-w-3xl mx-auto">

                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 font-body text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#555] hover:text-amber transition-colors mb-12"
                    >
                        <ArrowLeft size={14} /> All Posts
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 font-body text-[10px] tracking-[0.4em] uppercase mb-8">
                        <span className="text-amber">{post.category}</span>
                        <span className="w-6 h-px bg-[#333]" />
                        <span className="text-[#555]">{post.year}</span>
                        <span className="w-6 h-px bg-[#333]" />
                        <span className="text-[#555]">{post.readTime}</span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase leading-[0.95] mb-10 md:mb-14">
                        {post.title}
                    </h1>

                    <div className="h-px w-full bg-gradient-to-r from-amber/30 via-white/10 to-transparent mb-14" />

                    <div className="font-body">
                        {renderMarkdown(post.content)}
                    </div>

                    {/* Prev / Next */}
                    <div className="mt-20 pt-10 border-t border-white/10 grid sm:grid-cols-2 gap-6">
                        {prev ? (
                            <Link
                                href={`/blog/${prev.slug}`}
                                className="group flex flex-col items-start gap-2 p-6 border border-white/5 bg-[#0a0a0a] hover:border-amber/30 transition-all"
                            >
                                <span className="font-body text-[9px] tracking-[0.4em] uppercase text-[#444] flex items-center gap-2">
                                    <ArrowLeft size={12} /> Previous
                                </span>
                                <span className="font-display text-lg md:text-xl text-white group-hover:text-amber transition-colors uppercase leading-tight">
                                    {prev.title}
                                </span>
                            </Link>
                        ) : <div className="hidden sm:block" />}
                        {next ? (
                            <Link
                                href={`/blog/${next.slug}`}
                                className="group flex flex-col items-end text-right gap-2 p-6 border border-white/5 bg-[#0a0a0a] hover:border-amber/30 transition-all sm:col-start-2"
                            >
                                <span className="font-body text-[9px] tracking-[0.4em] uppercase text-[#444] flex items-center gap-2">
                                    Next <ArrowRight size={12} />
                                </span>
                                <span className="font-display text-lg md:text-xl text-white group-hover:text-amber transition-colors uppercase leading-tight">
                                    {next.title}
                                </span>
                            </Link>
                        ) : null}
                    </div>
                </div>
            </article>

            <Footer />
        </>
    );
}
