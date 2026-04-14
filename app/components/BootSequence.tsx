'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootLines = [
    '> INITIALIZING SYSTEM...            [OK]',
    '> LOADING OLUJIMI.OS v2.0           [OK]',
    '> AI_MODULES........................[OK]',
    '> AUTOMATION_CORE...................[OK]',
    '> PROJECTS_DATABASE.................[OK]',
    '> IDENTITY CONFIRMED: OLUJIMI TOBILOBA',
    '> STATUS: BUILDER. FOUNDER. ENGINEER.',
    '> WELCOME.',
];

export default function BootSequence() {
    const [lines, setLines] = useState<string[]>([]);
    const [isBooting, setIsBooting] = useState(true);
    const [glitching, setGlitching] = useState(false);

    useEffect(() => {
        // Check if we already booted this session
        if (sessionStorage.getItem('booted_v2')) {
            setIsBooting(false);
            return;
        }

        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < bootLines.length) {
                setLines(prev => [...prev, bootLines[currentIndex]]);
                currentIndex++;
            } else {
                clearInterval(interval);
                // Start glitch sequence
                setTimeout(() => setGlitching(true), 400);
                // End boot sequence
                setTimeout(() => {
                    setIsBooting(false);
                    sessionStorage.setItem('booted_v2', 'true');
                }, 1200);
            }
        }, 250); // Speed of line appearance

        return () => clearInterval(interval);
    }, []);

    const skipBoot = () => {
        setIsBooting(false);
        sessionStorage.setItem('booted_v2', 'true');
    };

    if (!isBooting) return null;

    return (
        <AnimatePresence>
            <motion.div
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className={`fixed inset-0 z-[100] bg-black text-[#00FF94] font-body text-sm md:text-base p-8 md:p-12 flex flex-col justify-end overflow-hidden
          ${glitching ? 'animate-glitch-extreme' : ''}
        `}
            >
                <div className="max-w-3xl w-full">
                    {lines.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-2 tracking-wider"
                        >
                            {line}
                        </motion.div>
                    ))}
                    {lines.length < bootLines.length && (
                        <motion.div
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-3 h-5 bg-[#00FF94] mt-2 inline-block"
                        />
                    )}
                </div>

                {/* Skip button */}
                <button
                    onClick={skipBoot}
                    className="absolute bottom-8 right-8 text-[#555] hover:text-[#00FF94] text-xs font-body tracking-[0.2em] uppercase transition-colors"
                >
                    [ Skip ]
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
