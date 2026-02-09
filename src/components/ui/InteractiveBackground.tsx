'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAuth } from '@/lib/auth';

export function InteractiveBackground() {
    const { theme } = useAuth();
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Smooth physics for the mouse movements
    const springConfig = { damping: 40, stiffness: 120 };
    const smoothedX = useSpring(mouseX, springConfig);
    const smoothedY = useSpring(mouseY, springConfig);

    // Transforms for different layers
    const gridX = useTransform(smoothedX, [0, 1], [-20, 20]);
    const gridY = useTransform(smoothedY, [0, 1], [-20, 20]);

    const orb1X = useTransform(smoothedX, [0, 1], [-300, 300]);
    const orb1Y = useTransform(smoothedY, [0, 1], [-300, 300]);

    const orb2X = useTransform(smoothedX, [0, 1], [200, -200]);
    const orb2Y = useTransform(smoothedY, [0, 1], [200, -200]);

    useEffect(() => {
        let frameId: number;
        let time = 0;

        const animate = () => {
            time += 0.005;
            // Add a very subtle base drift so it never looks static
            const driftX = Math.sin(time) * 0.005;
            const driftY = Math.cos(time * 0.7) * 0.005;

            // We only update if mouse is relatively central or just as a base
            // But for simplicity, we'll just let the mouse drive it and add a static pulse if needed
            frameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const xPct = e.clientX / window.innerWidth;
            const yPct = e.clientY / window.innerHeight;

            mouseX.set(xPct);
            mouseY.set(yPct);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animate();
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, [mouseX, mouseY]);

    // Floating elements transforms (more parallax)
    const strandingChars = ['🕸️', '💀', '🧛', '👹', '🕯️', '🦇'];
    const defaultChars = ['💻', '🚀', '✨', '🎮', '⚡', '🔮'];
    const activeChars = theme === 'stranding' ? strandingChars : defaultChars;

    const floaters = activeChars.map((char, i) => {
        const tops = ['15%', '25%', '70%', '65%', '40%', '10%'];
        const lefts = ['10%', '85%', '15%', '75%', '45%', '60%'];
        return {
            char,
            x: useTransform(smoothedX, [0, 1], [(i % 2 === 0 ? -1 : 1) * 50, (i % 2 === 0 ? 1 : -1) * 50]),
            y: useTransform(smoothedY, [0, 1], [(i % 3 === 0 ? -1 : 1) * 60, (i % 3 === 0 ? 1 : -1) * 60]),
            top: tops[i],
            left: lefts[i]
        };
    });

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--background)]">
            {/* Strands Overlay (Death Stranding Style) */}
            {theme === 'stranding' && (
                <div className="absolute inset-0 strands-overlay animate-strand" />
            )}

            {/* Base Animated Gradient */}
            <div className={`absolute inset-0 gradient-animated ${theme === 'stranding' ? 'opacity-10 grayscale' : 'opacity-30'}`} />

            {/* Floating Emojis (The Vibe) */}
            {floaters.map((f, i) => (
                <motion.div
                    key={i}
                    className="absolute text-5xl opacity-20 select-none"
                    style={{
                        top: f.top,
                        left: f.left,
                        x: f.x,
                        y: f.y,
                    }}
                >
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 5 + i,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {f.char}
                    </motion.div>
                </motion.div>
            ))}

            {/* Interactive Grid */}
            <motion.div
                className="absolute inset-[-10%] opacity-20"
                style={{
                    backgroundImage: `linear-gradient(var(--surface-light) 1px, transparent 1px), linear-gradient(90deg, var(--surface-light) 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                    x: gridX,
                    y: gridY,
                }}
            />

            {/* Glowing Orbs that follow mouse with lag */}
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full"
                style={{
                    left: '50%',
                    top: '50%',
                    background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
                    x: orb1X,
                    y: orb1Y,
                    translateX: '-50%',
                    translateY: '-50%',
                    filter: 'blur(100px)',
                    opacity: 0.5,
                }}
            />

            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                    left: '40%',
                    top: '40%',
                    background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)',
                    x: orb2X,
                    y: orb2Y,
                    translateX: '-50%',
                    translateY: '-50%',
                    filter: 'blur(80px)',
                    opacity: 0.4,
                }}
            />

            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04))',
                    backgroundSize: '100% 4px, 4px 100%',
                    zIndex: 2,
                    opacity: 0.15
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,15,35,0.6)_100%)]" />
        </div>
    );
}
