'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Github, Linkedin, Twitter, Send, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import SectionHeader from './SectionHeader';

const socials = [
    { icon: Github, label: 'GITHUB', href: 'https://github.com/Tobiloba00' },
    { icon: Linkedin, label: 'LINKEDIN', href: 'https://www.linkedin.com/in/tobiloba-olujimi' },
    { icon: Twitter, label: 'TWITTER', href: 'https://x.com/JimiToby' },
];

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (field: 'name' | 'email' | 'message') =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
            if (status === 'error' || status === 'success') setStatus('idle');
        };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === 'sending') return;

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setErrorMessage('Please fill in every field before sending.');
            setStatus('error');
            return;
        }

        setStatus('sending');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setErrorMessage(data?.error || 'Something went wrong. Please try again.');
                setStatus('error');
                return;
            }

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch {
            setErrorMessage('Network error. Please check your connection and try again.');
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="relative py-24 md:py-32 px-5 md:px-6 bg-[#080808]">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-14 md:gap-20 items-end">

                    <div className="space-y-12">
                        <SectionHeader
                            label="06 // CONNECTION"
                            title="INITIATE"
                            accentTitle="COLLABORATION."
                        />

                        <p className="font-body text-[#777] text-base md:text-lg leading-relaxed max-w-md">
                            Have a high-scale project or an interesting inquiry?
                            <span className="text-white"> Reach out to initiate system connection.</span>
                        </p>

                        <div className="flex flex-col gap-6">
                            <a href="mailto:olujimitobilobaa@gmail.com" className="group flex flex-col items-start w-fit">
                                <span className="font-body text-[10px] tracking-[0.4em] text-[#333] uppercase mb-2">Direct Mailbox</span>
                                <span className="font-body text-base sm:text-xl md:text-2xl text-white group-hover:text-amber transition-colors flex items-center gap-3 md:gap-4 break-all sm:break-normal">
                                    olujimitobilobaa@gmail.com <ArrowRight size={18} className="text-amber opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all flex-shrink-0" />
                                </span>
                            </a>

                            <div className="flex gap-8 pt-6 border-t border-white/5">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col items-start"
                                    >
                                        <span className="font-body text-[10px] tracking-[0.4em] text-[#333] uppercase mb-2">{s.label}</span>
                                        <s.icon size={20} className="text-white group-hover:text-amber transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0a0a0a] border border-white/5 p-7 md:p-12 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-3xl pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <label htmlFor="contact-name" className="font-body text-[10px] tracking-[0.4em] text-[#555] uppercase block">Sender Identity</label>
                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    disabled={status === 'sending'}
                                    required
                                    maxLength={120}
                                    placeholder="Full Name // System Name"
                                    className="w-full bg-transparent border-b border-white/10 py-4 font-body text-sm text-white focus:outline-none focus:border-amber transition-colors placeholder:text-[#222] disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="contact-email" className="font-body text-[10px] tracking-[0.4em] text-[#555] uppercase block">Signal Endpoint</label>
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    disabled={status === 'sending'}
                                    required
                                    maxLength={200}
                                    placeholder="name@endpoint.com"
                                    className="w-full bg-transparent border-b border-white/10 py-4 font-body text-sm text-white focus:outline-none focus:border-amber transition-colors placeholder:text-[#222] disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="contact-message" className="font-body text-[10px] tracking-[0.4em] text-[#555] uppercase block">Transmission Data</label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange('message')}
                                    disabled={status === 'sending'}
                                    required
                                    maxLength={5000}
                                    placeholder="Type your message here..."
                                    className="w-full bg-transparent border-b border-white/10 py-4 font-body text-sm text-white focus:outline-none focus:border-amber transition-colors placeholder:text-[#222] resize-none disabled:opacity-50"
                                />
                            </div>

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3 font-body text-xs text-red-400/90 border border-red-500/20 bg-red-500/5 p-3"
                                >
                                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                                    <span>{errorMessage}</span>
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3 font-body text-xs text-green-neon border border-green-neon/20 bg-green-neon/5 p-3"
                                >
                                    <Check size={14} className="flex-shrink-0 mt-0.5" />
                                    <span>Signal received. I&apos;ll get back to you shortly.</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full font-body text-xs tracking-[0.6em] uppercase py-5 border border-amber/30 text-amber hover:bg-amber hover:text-black disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-amber disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4"
                            >
                                {status === 'sending' ? (
                                    <>TRANSMITTING <Loader2 size={14} className="animate-spin" /></>
                                ) : (
                                    <>SEND_SIGNAL <Send size={14} /></>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
