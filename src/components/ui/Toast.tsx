import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  submessage?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  submessage,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-16 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className="bg-[#0D1030]/95 backdrop-blur-xl border border-[#FFB800]/40 rounded-full py-2.5 px-4 shadow-[0_8px_32px_rgba(4,6,26,0.8),0_0_16px_rgba(255,184,0,0.2)] flex items-center gap-2.5 max-w-sm pointer-events-auto">
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
          <Check size={12} className="stroke-[3]" />
        </div>
        <div className="text-left">
          <span className="text-xs font-semibold text-white block leading-tight">
            {message}
          </span>
          {submessage && (
            <span className="text-[10px] text-[#C9CCE0]/70 block leading-tight mt-0.5">
              {submessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
