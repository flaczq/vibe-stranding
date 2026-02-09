'use client';

import { motion } from 'framer-motion';

interface AvatarProps {
    src: string;
    alt: string;
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    border?: boolean;
}

const sizeClasses = {
    'xs': 'w-6 h-6 text-xs',
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-10 h-10 text-base',
    'lg': 'w-14 h-14 text-2xl',
    'xl': 'w-20 h-20 text-3xl',
    '2xl': 'w-32 h-32 text-5xl',
    '3xl': 'w-40 h-40 text-6xl',
};

export function Avatar({ src, alt, className = '', size = 'md', border = false }: AvatarProps) {
    const isCustom = src?.startsWith('data:');

    return (
        <div
            className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-surface transition-all ${sizeClasses[size]} ${border ? 'border-2 border-primary/20' : ''} ${className}`}
        >
            {isCustom ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            ) : (
                <span className="select-none">{src || '🦊'}</span>
            )}
        </div>
    );
}
