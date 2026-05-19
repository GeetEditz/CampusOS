'use client';

import { Trash } from 'lucide-react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

interface HoldToDeleteProps {
    holdDuration?: number;
    label?: string;
    deletedLabel?: string;
    resetDelay?: number;
    onDelete?: () => void;
    onReset?: () => void;
    className?: string;
}

const HoldToDelete = ({
    holdDuration = 2000,
    label = 'Hold to delete',
    deletedLabel = 'Deleted',
    resetDelay = 2000,
    onDelete,
    onReset,
    className = '',
}: HoldToDeleteProps) => {
    const [deleted, setDeleted] = useState(false);
    const progress = useMotionValue(0);
    const width = useTransform(progress, [0, 100], ['0%', '100%']);
    const rafRef = useRef<ReturnType<typeof animate> | null>(null);

    const startHold = useCallback(() => {
        if (deleted) return;
        const remaining = ((100 - progress.get()) / 100) * holdDuration;
        rafRef.current = animate(progress, 100, {
            duration: remaining / 1000,
            ease: 'linear',
            onComplete: () => {
                setDeleted(true);
                onDelete?.();
                setTimeout(() => {
                    progress.set(0);
                    setDeleted(false);
                    onReset?.();
                }, resetDelay);
            },
        });
    }, [deleted, holdDuration, onDelete, onReset, progress, resetDelay]);

    const stopHold = useCallback(() => {
        if (rafRef.current) {
            rafRef.current.stop();
            rafRef.current = null;
        }
        if (!deleted) {
            animate(progress, 0, { duration: 0.4, ease: 'easeOut' });
        }
    }, [deleted, progress]);

    return (
        <motion.button
            type="button"
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
            whileTap={!deleted ? { scale: 0.95 } : {}}
            animate={{ scale: deleted ? 1 : undefined }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`flex items-center px-3 py-2 gap-1.5 cursor-pointer text-red-500 border border-red-500 text-sm font-medium bg-red-500/5 transition-colors ease-in-out duration-150 rounded-lg relative overflow-hidden select-none ${className}`}
        >
            <motion.span
                animate={{ opacity: deleted ? 0 : 1, width: deleted ? 0 : 'auto' }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden flex items-center -translate-y-px z-10"
            >
                <Trash size={14} />
            </motion.span>

            <span className="relative z-10">
                <motion.span
                    animate={{ opacity: deleted ? 0 : 1, y: deleted ? -8 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                >
                    {label}
                </motion.span>
                <motion.span
                    animate={{ opacity: deleted ? 1 : 0, y: deleted ? 0 : 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                >
                    {deletedLabel}
                </motion.span>
            </span>

            <motion.div style={{ width }} className="left-0 top-0 bg-red-500/20 h-full absolute z-0" />
        </motion.button>
    );
};

export { HoldToDelete };
