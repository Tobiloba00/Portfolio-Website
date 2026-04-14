'use client';

export default function Footer() {
    return (
        <footer className="bg-[#080808] px-5 md:px-6 py-14 md:py-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 font-body">

                <div className="flex flex-col gap-2">
                    <div className="font-display text-4xl text-white">TOBILOBA<span className="text-amber">.</span></div>
                    <p className="text-[10px] tracking-[0.4em] text-[#333] uppercase">Tobiloba Olujimi // Systems Builder</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left w-full md:w-auto">
                    <div className="space-y-4">
                        <span className="text-[8px] tracking-[0.4em] text-[#222] uppercase font-bold">Navigation</span>
                        <ul className="space-y-2">
                            <li><a href="#work" className="text-[10px] text-[#555] hover:text-amber transition-colors uppercase tracking-widest">Selected Work</a></li>
                            <li><a href="#about" className="text-[10px] text-[#555] hover:text-amber transition-colors uppercase tracking-widest">Identity</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <span className="text-[8px] tracking-[0.4em] text-[#222] uppercase font-bold">Signal</span>
                        <ul className="space-y-2">
                            <li><a href="https://www.linkedin.com/in/tobiloba-olujimi" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#555] hover:text-amber transition-colors uppercase tracking-widest">LinkedIn</a></li>
                            <li><a href="https://x.com/JimiToby" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#555] hover:text-amber transition-colors uppercase tracking-widest">Twitter</a></li>
                            <li><a href="https://github.com/Tobiloba00" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#555] hover:text-amber transition-colors uppercase tracking-widest">GitHub</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <span className="text-[8px] tracking-[0.4em] text-[#222] uppercase font-bold">Core</span>
                        <p className="text-[10px] text-[#333] uppercase tracking-widest leading-relaxed">
                            Designed with precision. Built with intent.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
