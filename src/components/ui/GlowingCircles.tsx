import React from 'react';

interface GlowingCirclesProps {
  size?: number;
  className?: string;
  colors?: [string, string, string];
  opacity?: number;
  pulsing?: boolean;
}

export const GlowingCircles: React.FC<GlowingCirclesProps> = ({
  size = 200,
  className = '',
  colors = ['#FFB800', '#D6469A', '#2FA8F0'],
  opacity = 0.45,
  pulsing = false,
}) => {
  return (
    <div
      className={`relative pointer-events-none select-none flex items-center justify-center overflow-visible ${className} ${
        pulsing ? 'animate-pulse' : ''
      }`}
      style={{ width: size, height: size }}
    >
      {/* Circle 1 - Gold/Warm */}
      <div
        className="absolute w-[65%] h-[65%] rounded-full filter blur-xl transition-all duration-1000"
        style={{
          backgroundColor: colors[0],
          opacity: opacity * 0.9,
          top: '12%',
          left: '12%',
          transform: 'translate(-10%, -10%)',
        }}
      />

      {/* Circle 2 - Magenta/Rose */}
      <div
        className="absolute w-[70%] h-[70%] rounded-full filter blur-2xl transition-all duration-1000"
        style={{
          backgroundColor: colors[1],
          opacity: opacity,
          bottom: '8%',
          right: '8%',
          transform: 'translate(10%, 10%)',
        }}
      />

      {/* Circle 3 - Sky Blue/Serene */}
      <div
        className="absolute w-[60%] h-[60%] rounded-full filter blur-xl transition-all duration-1000"
        style={{
          backgroundColor: colors[2],
          opacity: opacity * 0.8,
          top: '25%',
          right: '18%',
        }}
      />

      {/* Center Soft Luminescence */}
      <div
        className="absolute w-[40%] h-[40%] rounded-full filter blur-md bg-white/10"
      />
    </div>
  );
};
