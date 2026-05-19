'use client';

import { useToast } from './use-toast';
import { X, Trophy, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col p-4 md:max-w-[420px] max-h-screen w-full gap-3 pointer-events-none">
      {toasts.map(function ({ id, title, description, variant, action, ...props }) {
        // Auto dismiss timer per toast inside toaster rendering
        return (
          <ToastItem
            key={id}
            id={id!}
            title={title}
            description={description}
            variant={variant}
            action={action}
            onClose={() => dismiss(id)}
          />
        );
      })}
    </div>
  );
}

interface ToastItemProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  action?: React.ReactNode;
  onClose: () => void;
}

function ToastItem({ id, title, description, variant, action, onClose }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Style helper based on variants
  const isDestructive = variant === 'destructive';
  const isSuccess = variant === 'success';
  const isScoreBoost = title?.toLowerCase().includes('score') || title?.toLowerCase().includes('credibility');

  let borderColor = 'border-white/5';
  let glowColor = 'bg-primary/5';
  let bannerColor = 'from-primary/20 via-purple-500/10 to-transparent';
  let icon = <Sparkles className="w-5 h-5 text-indigo-400" />;

  if (isDestructive) {
    borderColor = 'border-red-500/30';
    glowColor = 'bg-red-500/5';
    bannerColor = 'from-red-500/20 to-transparent';
    icon = <AlertTriangle className="w-5 h-5 text-red-400" />;
  } else if (isSuccess) {
    borderColor = 'border-emerald-500/30';
    glowColor = 'bg-emerald-500/5';
    bannerColor = 'from-emerald-500/20 to-transparent';
    icon = <CheckCircle className="w-5 h-5 text-emerald-400" />;
  } else if (isScoreBoost) {
    borderColor = 'border-amber-500/30';
    glowColor = 'bg-amber-500/5';
    bannerColor = 'from-amber-500/20 to-transparent';
    icon = <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />;
  }

  return (
    <div className="w-full pointer-events-auto animate-slideIn">
      <div className={`glass-panel border ${borderColor} bg-black/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl flex items-start gap-4 max-w-sm relative overflow-hidden group`}>
        {/* Glow indicator line */}
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${isScoreBoost ? 'from-amber-500 via-orange-500 to-amber-500' : isDestructive ? 'from-red-500 to-transparent' : isSuccess ? 'from-emerald-500 to-transparent' : 'from-indigo-500 via-purple-500 to-indigo-500'}`}></div>
        
        {/* Background glow overlay */}
        <div className={`absolute -inset-10 ${glowColor} blur-xl pointer-events-none rounded-full`}></div>
        
        {/* Icon wrapper */}
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        
        {/* Text descriptions */}
        <div className="flex-1 flex flex-col gap-0.5 relative z-10">
          {title && <span className="text-xs font-black text-white tracking-tight">{title}</span>}
          {description && <span className="text-[10px] text-zinc-400 font-semibold leading-normal">{description}</span>}
        </div>

        {/* Action Button if provided */}
        {action && <div className="relative z-10 shrink-0 self-center">{action}</div>}

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300 p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
