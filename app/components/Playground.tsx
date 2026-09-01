'use client';

import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { X, RotateCcw } from 'lucide-react';

const MAX_ENEMIES = 5;
const MAX_PROJECTILES = 40;
const MAX_EXPLOSIONS = 8;
const ARENA_RADIUS = 24;
const PLAYER_SPEED = 10;
const PLAYER_FIRE_COOLDOWN = 0.16;
const PLAYER_MAX_HP = 5;
const ENEMY_MAX_HP = 2;
const UP = new THREE.Vector3(0, 1, 0);

type InputState = {
    keys: Record<string, boolean>;
    joystick: { x: number; y: number };
    firing: boolean;
};

type EnemySlot = {
    active: boolean;
    position: THREE.Vector3;
    hp: number;
    wanderSeed: number;
    nextFireAt: number;
    respawnAt: number;
};

type ProjectileSlot = {
    active: boolean;
    position: THREE.Vector3;
    direction: THREE.Vector3;
    owner: 'player' | 'enemy';
    ttl: number;
};

type ExplosionSlot = {
    active: boolean;
    position: THREE.Vector3;
    age: number;
};

function getMovementInput(input: InputState): { x: number; z: number } {
    let x = input.joystick.x;
    let z = input.joystick.y;
    if (input.keys['KeyW'] || input.keys['ArrowUp']) z -= 1;
    if (input.keys['KeyS'] || input.keys['ArrowDown']) z += 1;
    if (input.keys['KeyA'] || input.keys['ArrowLeft']) x -= 1;
    if (input.keys['KeyD'] || input.keys['ArrowRight']) x += 1;
    const len = Math.hypot(x, z);
    if (len > 1) {
        x /= len;
        z /= len;
    }
    return { x, z };
}

function RobotModel({ color, scale = 1 }: { color: string; scale?: number }) {
    return (
        <group scale={scale}>
            <mesh castShadow>
                <boxGeometry args={[0.9, 1.1, 1.2]} />
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.85, 0.1]} castShadow>
                <boxGeometry args={[0.5, 0.4, 0.5]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.85, 0.36]}>
                <boxGeometry args={[0.35, 0.12, 0.05]} />
                <meshStandardMaterial color="#000000" emissive={color} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
            <mesh position={[-0.65, 0.1, 0]} castShadow>
                <boxGeometry args={[0.3, 0.9, 0.3]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.65, 0.1, 0]} castShadow>
                <boxGeometry args={[0.3, 0.9, 0.3]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[-0.3, -0.25, -0.65]}>
                <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
                <meshStandardMaterial color="#000000" emissive={color} emissiveIntensity={3} toneMapped={false} />
            </mesh>
            <mesh position={[0.3, -0.25, -0.65]}>
                <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
                <meshStandardMaterial color="#000000" emissive={color} emissiveIntensity={3} toneMapped={false} />
            </mesh>
        </group>
    );
}

function SpaceArena({
    inputRef,
    setScore,
    setPlayerHp,
}: {
    inputRef: React.MutableRefObject<InputState>;
    setScore: Dispatch<SetStateAction<number>>;
    setPlayerHp: Dispatch<SetStateAction<number>>;
}) {
    const playerGroupRef = useRef<THREE.Group>(null);
    const playerFacing = useRef(new THREE.Vector3(0, 0, 1));
    const nextPlayerFireAt = useRef(0);
    const invulnerableUntil = useRef(0);
    const respawnScheduled = useRef(false);

    const enemyGroupRefs = useRef<(THREE.Group | null)[]>(Array(MAX_ENEMIES).fill(null));
    // wanderSeed/hp start at deterministic placeholders — spawnEnemy() (called
    // imperatively from the frame loop, not during render) assigns the real
    // randomized values the moment each slot actually spawns.
    const enemyData = useRef<EnemySlot[]>(
        Array.from({ length: MAX_ENEMIES }, () => ({
            active: false,
            position: new THREE.Vector3(),
            hp: 0,
            wanderSeed: 0,
            nextFireAt: 0,
            respawnAt: 0,
        }))
    );

    const projectileMeshRefs = useRef<(THREE.Mesh | null)[]>(Array(MAX_PROJECTILES).fill(null));
    const projectileData = useRef<ProjectileSlot[]>(
        Array.from({ length: MAX_PROJECTILES }, () => ({
            active: false,
            position: new THREE.Vector3(),
            direction: new THREE.Vector3(0, 0, 1),
            owner: 'player' as const,
            ttl: 0,
        }))
    );

    const explosionGroupRefs = useRef<(THREE.Group | null)[]>(Array(MAX_EXPLOSIONS).fill(null));
    const explosionData = useRef<ExplosionSlot[]>(
        Array.from({ length: MAX_EXPLOSIONS }, () => ({
            active: false,
            position: new THREE.Vector3(),
            age: 0,
        }))
    );

    function spawnEnemy(slot: EnemySlot, now: number) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 10 + Math.random() * 10;
        slot.position.set(Math.cos(angle) * dist, (Math.random() - 0.5) * 6 + 2.5, Math.sin(angle) * dist);
        slot.hp = ENEMY_MAX_HP;
        slot.active = true;
        slot.wanderSeed = Math.random() * 1000;
        slot.nextFireAt = now + 1 + Math.random() * 2;
    }

    function fireProjectile(origin: THREE.Vector3, direction: THREE.Vector3, owner: 'player' | 'enemy') {
        const idx = projectileData.current.findIndex((p) => !p.active);
        if (idx === -1) return;
        const slot = projectileData.current[idx];
        slot.active = true;
        slot.position.copy(origin);
        slot.direction.copy(direction).normalize();
        slot.owner = owner;
        slot.ttl = 2.2;
        const mesh = projectileMeshRefs.current[idx];
        if (mesh) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            const color = owner === 'player' ? '#22E5FF' : '#FF3B3B';
            // Base color stays black — only the (unlit) emissive channel
            // should carry the saturated color, otherwise scene lighting
            // washes it toward pink/white.
            mat.emissive.set(color);
        }
    }

    function spawnExplosion(position: THREE.Vector3) {
        const slot = explosionData.current.find((e) => !e.active);
        if (!slot) return;
        slot.active = true;
        slot.position.copy(position);
        slot.age = 0;
    }

    useFrame((state, rawDelta) => {
        const delta = Math.min(rawDelta, 0.05);
        const now = state.clock.elapsedTime;
        const input = inputRef.current;
        const player = playerGroupRef.current;

        if (player) {
            const isRespawning = respawnScheduled.current;
            if (!isRespawning) {
                const { x, z } = getMovementInput(input);
                player.position.x += x * PLAYER_SPEED * delta;
                player.position.z += z * PLAYER_SPEED * delta;

                const distFromCenter = Math.hypot(player.position.x, player.position.z);
                if (distFromCenter > ARENA_RADIUS) {
                    const scale = ARENA_RADIUS / distFromCenter;
                    player.position.x *= scale;
                    player.position.z *= scale;
                }
                player.position.y = 1.5 + Math.sin(now * 1.4) * 0.25;

                if (Math.abs(x) > 0.01 || Math.abs(z) > 0.01) {
                    const targetAngle = Math.atan2(x, z);
                    playerFacing.current.set(Math.sin(targetAngle), 0, Math.cos(targetAngle));
                    const targetQuat = new THREE.Quaternion().setFromAxisAngle(UP, targetAngle);
                    player.quaternion.slerp(targetQuat, 0.14);
                }

                if (input.firing && now >= nextPlayerFireAt.current) {
                    nextPlayerFireAt.current = now + PLAYER_FIRE_COOLDOWN;
                    const origin = player.position
                        .clone()
                        .add(playerFacing.current.clone().multiplyScalar(1.1))
                        .add(new THREE.Vector3(0, 0.15, 0));
                    fireProjectile(origin, playerFacing.current, 'player');
                }
            }

            // Chase camera — stays behind the player relative to facing.
            const behind = playerFacing.current.clone().multiplyScalar(-8.5);
            const desiredCamPos = player.position.clone().add(behind).add(new THREE.Vector3(0, 4.2, 0));
            state.camera.position.lerp(desiredCamPos, 0.07);
            state.camera.lookAt(player.position.clone().add(new THREE.Vector3(0, 1, 0)));
        }

        // --- Enemies ---
        for (let i = 0; i < MAX_ENEMIES; i++) {
            const d = enemyData.current[i];
            const g = enemyGroupRefs.current[i];
            if (!d.active) {
                if (g) g.visible = false;
                if (now >= d.respawnAt) spawnEnemy(d, now);
                continue;
            }
            if (!g) continue;
            g.visible = true;

            const wobble = now * 0.4 + d.wanderSeed;
            d.position.x += Math.sin(wobble) * 0.7 * delta;
            d.position.z += Math.cos(wobble * 0.7) * 0.7 * delta;
            d.position.y += Math.sin(wobble * 0.5) * 0.35 * delta;
            const dist = Math.hypot(d.position.x, d.position.z);
            if (dist > ARENA_RADIUS) {
                d.position.x *= ARENA_RADIUS / dist;
                d.position.z *= ARENA_RADIUS / dist;
            }
            g.position.copy(d.position);
            if (player) {
                // Yaw-only facing — a full lookAt() also pitches/rolls the
                // model when the player is above/below, tipping it over.
                const dx = player.position.x - d.position.x;
                const dz = player.position.z - d.position.z;
                g.rotation.set(0, Math.atan2(dx, dz), 0);
            }

            if (player && now >= d.nextFireAt) {
                d.nextFireAt = now + 1.4 + Math.random() * 2.4;
                const dir = player.position.clone().sub(d.position).normalize();
                fireProjectile(d.position.clone(), dir, 'enemy');
            }
        }

        // --- Projectiles ---
        for (let i = 0; i < MAX_PROJECTILES; i++) {
            const p = projectileData.current[i];
            const mesh = projectileMeshRefs.current[i];
            if (!p.active) {
                if (mesh) mesh.visible = false;
                continue;
            }
            if (!mesh) continue;
            mesh.visible = true;

            const speed = p.owner === 'player' ? 36 : 20;
            p.position.addScaledVector(p.direction, speed * delta);
            p.ttl -= delta;
            mesh.position.copy(p.position);
            mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.direction);

            let hit = false;
            if (p.owner === 'player') {
                for (let j = 0; j < MAX_ENEMIES; j++) {
                    const ed = enemyData.current[j];
                    if (!ed.active) continue;
                    if (p.position.distanceTo(ed.position) < 1.15) {
                        ed.hp -= 1;
                        hit = true;
                        if (ed.hp <= 0) {
                            ed.active = false;
                            ed.respawnAt = now + 1.5;
                            spawnExplosion(ed.position.clone());
                            setScore((s) => s + 1);
                        }
                        break;
                    }
                }
            } else if (player && now >= invulnerableUntil.current && !respawnScheduled.current) {
                if (p.position.distanceTo(player.position) < 1.0) {
                    hit = true;
                    invulnerableUntil.current = now + 0.6;
                    spawnExplosion(player.position.clone());
                    setPlayerHp((hp) => {
                        const next = Math.max(0, hp - 1);
                        if (next === 0 && !respawnScheduled.current) {
                            respawnScheduled.current = true;
                            setTimeout(() => {
                                setPlayerHp(PLAYER_MAX_HP);
                                if (playerGroupRef.current) {
                                    playerGroupRef.current.position.set(0, 1.5, 0);
                                }
                                respawnScheduled.current = false;
                            }, 1800);
                        }
                        return next;
                    });
                }
            }

            if (hit || p.ttl <= 0 || p.position.length() > ARENA_RADIUS * 1.6) {
                p.active = false;
            }
        }

        // --- Explosions ---
        for (let i = 0; i < MAX_EXPLOSIONS; i++) {
            const e = explosionData.current[i];
            const g = explosionGroupRefs.current[i];
            if (!e.active) {
                if (g) g.visible = false;
                continue;
            }
            if (!g) continue;
            e.age += delta;
            if (e.age > 0.7) {
                e.active = false;
                g.visible = false;
                continue;
            }
            g.visible = true;
            g.position.copy(e.position);
            const t = e.age / 0.7;
            g.scale.setScalar(1 + t * 3);
            g.children.forEach((child) => {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
                if (mat) mat.opacity = 1 - t;
            });
        }
    });

    const debrisAngles = useMemo(() => Array.from({ length: 6 }, (_, j) => (j / 6) * Math.PI * 2), []);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 15, 8]} intensity={1.1} />
            <pointLight position={[0, 6, 0]} intensity={0.6} color="#F5A623" />
            <Stars radius={80} depth={40} count={3000} factor={3} saturation={0} fade speed={0.5} />

            <group ref={playerGroupRef} position={[0, 1.5, 0]}>
                <RobotModel color="#F5A623" />
            </group>

            {Array.from({ length: MAX_ENEMIES }).map((_, i) => (
                <group
                    key={`enemy-${i}`}
                    ref={(el) => {
                        enemyGroupRefs.current[i] = el;
                    }}
                    visible={false}
                >
                    <RobotModel color="#FF3B3B" scale={0.95} />
                </group>
            ))}

            {Array.from({ length: MAX_PROJECTILES }).map((_, i) => (
                <mesh
                    key={`proj-${i}`}
                    ref={(el) => {
                        projectileMeshRefs.current[i] = el;
                    }}
                    visible={false}
                >
                    <boxGeometry args={[0.08, 0.08, 0.7]} />
                    <meshStandardMaterial color="#000000" emissive="#22E5FF" emissiveIntensity={4} toneMapped={false} />
                </mesh>
            ))}

            {Array.from({ length: MAX_EXPLOSIONS }).map((_, i) => (
                <group
                    key={`exp-${i}`}
                    ref={(el) => {
                        explosionGroupRefs.current[i] = el;
                    }}
                    visible={false}
                >
                    <mesh>
                        <sphereGeometry args={[0.5, 12, 12]} />
                        <meshStandardMaterial color="#000000" emissive="#FFAA33" emissiveIntensity={3} transparent opacity={1} toneMapped={false} />
                    </mesh>
                    {debrisAngles.map((angle, j) => (
                        <mesh key={j} position={[Math.cos(angle) * 0.5, (j % 2 === 0 ? 1 : -1) * 0.2, Math.sin(angle) * 0.5]}>
                            <boxGeometry args={[0.15, 0.15, 0.15]} />
                            <meshStandardMaterial color="#000000" emissive="#FF6633" emissiveIntensity={2} transparent opacity={1} toneMapped={false} />
                        </mesh>
                    ))}
                </group>
            ))}
        </>
    );
}

function VirtualJoystick({ inputRef }: { inputRef: React.MutableRefObject<InputState> }) {
    const baseRef = useRef<HTMLDivElement>(null);
    const [knob, setKnob] = useState({ x: 0, y: 0 });
    const activePointer = useRef<number | null>(null);

    const updateFromEvent = (clientX: number, clientY: number) => {
        const base = baseRef.current;
        if (!base) return;
        const rect = base.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = (clientX - cx) / (rect.width / 2);
        let dy = (clientY - cy) / (rect.height / 2);
        const len = Math.hypot(dx, dy);
        if (len > 1) {
            dx /= len;
            dy /= len;
        }
        setKnob({ x: dx, y: dy });
        inputRef.current.joystick = { x: dx, y: dy };
    };

    return (
        <div
            ref={baseRef}
            onPointerDown={(e) => {
                activePointer.current = e.pointerId;
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
                updateFromEvent(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
                if (activePointer.current !== e.pointerId) return;
                updateFromEvent(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
                activePointer.current = null;
                setKnob({ x: 0, y: 0 });
                inputRef.current.joystick = { x: 0, y: 0 };
            }}
            onPointerCancel={() => {
                activePointer.current = null;
                setKnob({ x: 0, y: 0 });
                inputRef.current.joystick = { x: 0, y: 0 };
            }}
            className="relative w-24 h-24 rounded-full bg-white/5 border border-white/15 touch-none select-none"
        >
            <div
                className="absolute w-10 h-10 rounded-full bg-amber/80 border border-amber pointer-events-none"
                style={{
                    left: `calc(50% + ${knob.x * 28}px - 20px)`,
                    top: `calc(50% + ${knob.y * 28}px - 20px)`,
                }}
            />
        </div>
    );
}

export default function Playground({ onClose }: { onClose: () => void }) {
    const [resetKey, setResetKey] = useState(0);
    const [score, setScore] = useState(0);
    const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
    // Playground is dynamically imported with ssr:false, so `window` is
    // always available here — a lazy initializer avoids a setState-in-effect.
    const [isTouch] = useState(() => window.matchMedia('(pointer: coarse)').matches);

    const inputRef = useRef<InputState>({ keys: {}, joystick: { x: 0, y: 0 }, firing: false });

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e: KeyboardEvent) => {
            inputRef.current.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                inputRef.current.firing = true;
            }
            if (e.key === 'Escape') onClose();
        };
        const onKeyUp = (e: KeyboardEvent) => {
            inputRef.current.keys[e.code] = false;
            if (e.code === 'Space') inputRef.current.firing = false;
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [onClose]);

    const handleReset = () => {
        setResetKey((k) => k + 1);
        setScore(0);
        setPlayerHp(PLAYER_MAX_HP);
    };

    return (
        <div
            className="fixed inset-0 z-[200] bg-black"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="absolute top-5 right-5 z-10 flex gap-3">
                <button
                    type="button"
                    onClick={handleReset}
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

            <div className="absolute top-5 left-5 z-10 pointer-events-none font-body">
                <p className="text-[9px] tracking-[0.3em] text-[#555] uppercase mb-2">
                    {isTouch ? 'Drag to move — tap fire to shoot' : 'WASD to move — Space or Click to fire'}
                </p>
                <p className="text-2xl text-amber tracking-widest">
                    SCORE <span className="text-white">{score.toString().padStart(3, '0')}</span>
                </p>
                <div className="flex gap-1 mt-2">
                    {Array.from({ length: PLAYER_MAX_HP }).map((_, i) => (
                        <div
                            key={i}
                            className="w-5 h-2"
                            style={{ backgroundColor: i < playerHp ? '#F5A623' : 'rgba(255,255,255,0.1)' }}
                        />
                    ))}
                </div>
            </div>

            <Canvas
                shadows
                camera={{ position: [0, 4, -9], fov: 62 }}
                onPointerDown={() => {
                    inputRef.current.firing = true;
                }}
                onPointerUp={() => {
                    inputRef.current.firing = false;
                }}
            >
                <color attach="background" args={['#05050a']} />
                <fog attach="fog" args={['#05050a', 20, 55]} />
                <SpaceArena key={resetKey} inputRef={inputRef} setScore={setScore} setPlayerHp={setPlayerHp} />
            </Canvas>

            {isTouch && (
                <div className="absolute bottom-8 left-0 right-0 z-10 flex items-end justify-between px-8 pointer-events-none">
                    <div className="pointer-events-auto">
                        <VirtualJoystick inputRef={inputRef} />
                    </div>
                    <button
                        type="button"
                        onPointerDown={() => {
                            inputRef.current.firing = true;
                        }}
                        onPointerUp={() => {
                            inputRef.current.firing = false;
                        }}
                        onPointerCancel={() => {
                            inputRef.current.firing = false;
                        }}
                        className="pointer-events-auto cursor-pointer w-20 h-20 rounded-full bg-amber/20 border-2 border-amber text-amber font-body text-[10px] tracking-widest uppercase touch-none select-none"
                    >
                        Fire
                    </button>
                </div>
            )}
        </div>
    );
}
