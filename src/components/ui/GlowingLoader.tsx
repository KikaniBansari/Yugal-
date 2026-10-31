import React from 'react';

interface GlowingLoaderProps {
  label?: string;
  size?: number;
}

export const GlowingLoader: React.FC<GlowingLoaderProps> = ({
  label = 'Aligning your sanctuary...',
  size = 72,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Outer glowing pulsing aura */}
        <div className="absolute inset-0 rounded-full bg-spectrum-gradient opacity-30 filter blur-xl animate-ping" />
        
        {/* Rotating spectrum ring */}
        <div className="w-full h-full rounded-full border-2 border-transparent border-t-[#FFB800] border-r-[#D6469A] border-b-[#2FA8F0] animate-spin" />
        
        {/* Inner concentric glowing core */}
        <div className="absolute w-[60%] h-[60%] rounded-full bg-[#0D1030] border border-[#FFB800]/40 flex items-center justify-center shadow-gold-halo">
          <div className="w-3 h-3 rounded-full bg-spectrum-gradient animate-pulse" />
        </div>
      </div>

      {label && (
        <span className="text-xs font-medium text-[#C9CCE0] mt-4 tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};
