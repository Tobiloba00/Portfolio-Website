'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier';
import { OrbitControls, Html } from '@react-three/drei';
import { X, RotateCcw } from 'lucide-react';
import { categoryColors, type CategoryKey } from './Skills';

type PlaygroundSkill = { name: string; category: CategoryKey };

// A curated slice of the full skill set — enough per category to feel
// representative without turning the physics scene into visual noise.
const playgroundSkills: PlaygroundSkill[] = [
    { name: 'Workflow Automation', category: 'AI & Automation' },
    { name: 'AI Agents', category: 'AI & Automation' },
    { name: 'Chatwoot', category: 'AI & Automation' },
    { name: 'React.js', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Supabase', category: 'Backend & Database' },
    { name: 'Node.js', category: 'Backend & Database' },
    { name: 'PostgreSQL', category: 'Backend & Database' },
    { name: 'React Native', category: 'Mobile' },
    { name: 'Capacitor', category: 'Mobile' },
    { name: 'TestFlight', category: 'Mobile' },
    { name: 'Vercel', category: 'Infrastructure' },
    { name: 'DigitalOcean', category: 'Infrastructure' },
    { name: 'Docker', category: 'Infrastructure' },
    { name: 'Cursor', category: 'Platforms & Tools' },
    { name: 'Stripe', category: 'Platforms & Tools' },
    { name: 'Shopify API', category: 'Platforms & Tools' },
];

function spawnPosition(i: number): [number, number, number] {
    const col = i % 6;
    const row = Math.floor(i / 6);
    return [
        (col - 2.5) * 1.6 + (Math.random() - 0.5) * 0.4,
        4 + row * 2.2 + Math.random() * 0.5,
        (Math.random() - 0.5) * 3,
    ];
}

function Ground() {
    return (
        <RigidBody type="fixed" position={[0, -0.5, 0]} friction={0.8}>
            <CuboidCollider args={[15, 0.5, 15]} />
            <mesh receiveShadow position={[0, 0.5, 0]}>
                <boxGeometry args={[30, 0.02, 30]} />
                <meshStandardMaterial color="#111111" />
            </mesh>
        </RigidBody>
    );
}

function SkillBox({ skill, color, position }: { skill: string; color: string; position: [number, number, number] }) {
    const rigidRef = useRef<RapierRigidBody>(null);

    const launch = () => {
        rigidRef.current?.applyImpulse(
            { x: (Math.random() - 0.5) * 5, y: 4.5 + Math.random() * 2, z: (Math.random() - 0.5) * 5 },
            true
        );
        rigidRef.current?.applyTorqueImpulse(
            { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 2 },
            true
        );
    };

    return (
        <RigidBody ref={rigidRef} position={position} colliders="cuboid" restitution={0.45} friction={0.5}>
            <mesh onClick={launch} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
                <span
                    className="font-body text-[9px] tracking-widest uppercase text-white whitespace-nowrap"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                >
                    {skill}
                </span>
            </Html>
        </RigidBody>
    );
}

export default function Playground({ onClose }: { onClose: () => void }) {
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[200] bg-black/95"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="absolute top-5 right-5 z-10 flex gap-3">
                <button
                    type="button"
                    onClick={() => setResetKey((k) => k + 1)}
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-white/10 bg-black/60 text-[#999] hover:text-amber hover:border-amber/40 transition-colors font-body text-[10px] tracking-widest uppercase"
                >
                    <RotateCcw size={12} /> Reset
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close playground"
                    className="cursor-pointer flex items-center justify-center w-9 h-9 border border-white/10 bg-black/60 text-[#999] hover:text-amber hover:border-amber/40 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="absolute top-5 left-5 z-10 pointer-events-none">
                <p className="font-body text-[9px] tracking-[0.3em] text-[#555] uppercase">
                    Drag to orbit — click a block to launch it
                </p>
            </div>

            <Canvas shadows camera={{ position: [8, 6, 8], fov: 45 }}>
                <color attach="background" args={['#080808']} />
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 10, 5]} intensity={1.3} castShadow />
                <Physics gravity={[0, -9.81, 0]} key={resetKey}>
                    <Ground />
                    {playgroundSkills.map((s, i) => (
                        <SkillBox
                            key={s.name}
                            skill={s.name}
                            color={categoryColors[s.category]}
                            position={spawnPosition(i)}
                        />
                    ))}
                </Physics>
                <OrbitControls
                    enablePan={false}
                    minPolarAngle={0.2}
                    maxPolarAngle={Math.PI / 2 - 0.05}
                    minDistance={5}
                    maxDistance={22}
                />
            </Canvas>
        </div>
    );
}
