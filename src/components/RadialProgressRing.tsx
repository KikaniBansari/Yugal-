import React from 'react';

interface RadialProgressRingProps {
  completed: number;
  total?: number;
  currentPhaseColor?: string;
  size?: number;
  strokeWidth?: number;
}

export const RadialProgressRing: React.FC<RadialProgressRingProps> = ({
  completed,
  total = 21,
  currentPhaseColor = '#9B4FB5',
  size = 200,
  strokeWidth = 7,
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(Math.max(completed / total, 0), 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="relative flex items-center justify-center my-2" style={{ width: size, height: size }}>
      {/* Ambient background glow behind the active sweep */}
      <div 
        className="absolute inset-0 rounded-full filter blur-xl transition-all duration-700 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle, ${currentPhaseColor} 0%, transparent 70%)`
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10 overflow-visible">
        <defs>
          {/* Master Spectrum Gradient for the stroke */}
          <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB800" />
            <stop offset="20%" stopColor="#FF7A1A" />
            <stop offset="40%" stopColor="#F2452F" />
            <stop offset="60%" stopColor="#D6469A" />
            <stop offset="80%" stopColor="#9B4FB5" />
            <stop offset="100%" stopColor="#2FA8F0" />
          </linearGradient>

          {/* Filter for subtle glow around the stroke */}
          <filter id="progressGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFB800" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer subtle guide ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2 + 3}
          stroke="rgba(201, 204, 224, 0.05)"
          strokeWidth="1"
          fill="none"
        />

        {/* Unfilled track with subtle outline */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#0D1030"
          strokeWidth={strokeWidth}
          fill="rgba(9, 12, 33, 0.45)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(201, 204, 224, 0.12)"
          strokeWidth="1"
          fill="none"
        />

        {/* Active progress sweep */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#spectrumGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          filter="url(#progressGlow)"
          className="transition-all duration-1000 ease-out"
        />

        {/* Small golden marker node at origin */}
        <circle
          cx={size / 2 + radius}
          cy={size / 2}
          r={3}
          fill="#FFB800"
          className="opacity-70"
        />
      </svg>

      {/* Center Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#C9CCE0]/70 font-semibold mb-0.5">
          Reset Progress
        </span>
        <div className="flex items-baseline">
          <span className="text-3xl font-semibold tracking-tight text-white font-['DM_Sans']">
            {completed}
          </span>
          <span className="text-lg font-normal text-[#C9CCE0]/60 ml-0.5 font-['DM_Sans']">
            /{total}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[#FFB800] font-medium mt-0.5">
          Cards Unlocked
        </span>
        <span className="text-[10px] text-[#C9CCE0]/50 mt-1 font-mono">
          {Math.round((completed / total) * 100)}% COMPLETE
        </span>
      </div>
    </div>
  );
};
