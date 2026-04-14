'use client';

import { useEffect, useState, useRef } from 'react';

interface ScrambleTextProps {
    text: string;
    className?: string;
    trigger?: boolean;
}

const chars = '!<>-_\\/[]{}—=+*^?#________';

export default function ScrambleText({ text, className, trigger = true }: ScrambleTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isScrambling, setIsScrambling] = useState(false);
    const frameRef = useRef(0);
    const iterationRef = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!trigger) return;

        let iteration = 0;
        setIsScrambling(true);

        const scramble = () => {
            const scrambled = text
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            setDisplayedText(scrambled);

            if (iteration < text.length) {
                iteration += 1 / 3;
                frameRef.current = requestAnimationFrame(scramble);
            } else {
                setDisplayedText(text);
                setIsScrambling(false);
            }
        };

        scramble();

        return () => cancelAnimationFrame(frameRef.current);
    }, [text, trigger]);

    return <span className={className}>{displayedText}</span>;
}
