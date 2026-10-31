import React from 'react';
import { Phase } from '../../types/yugal';
import { PHASE_CONFIG } from '../../data/yugalData';
import { playSoftTap } from '../../utils/audio';

interface PhaseTagProps {
  phase: Phase;
  labelOverride?: string;
  size?: 'sm' | 'default';
  showDot?: boolean;
  className?: string;
}

export const PhaseTag: React.FC<PhaseTagProps> = ({
  phase,
  labelOverride,
  size = 'default',
  showDot = true,
  className = '',
}) => {
  const meta = PHASE_CONFIG[phase] || PHASE_CONFIG.CALM;
  const isSm = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-[0.08em] ${
        isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
      } ${className}`}
      style={{
        backgroundColor: meta.bgTint,
        borderColor: meta.borderColor,
        borderWidth: '1px',
        color: meta.color,
      }}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: meta.color }}
        />
      )}
      <span>{labelOverride || `${meta.label}, Phase ${meta.number}`}</span>
    </div>
  );
};

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  phase?: Phase;
  icon?: React.ReactNode;
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active = false,
  onClick,
  phase,
  icon,
  className = '',
}) => {
  const handleClick = () => {
    playSoftTap();
    if (onClick) onClick();
  };

  const meta = phase ? PHASE_CONFIG[phase] : null;

  return (
    <button
      type="button"
      onClick={handleClick}
      style={
        active && meta
          ? {
              backgroundColor: meta.bgTint,
              borderColor: meta.color,
              color: meta.color,
            }
          : active
          ? {
              backgroundColor: 'rgba(255, 184, 0, 0.15)',
              borderColor: '#FFB800',
              color: '#FFB800',
            }
          : {}
      }
      className={`h-[34px] px-3.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
        active
          ? 'border shadow-[0_0_10px_rgba(255,184,0,0.12)] font-semibold'
          : 'bg-[#0D1030] text-[#C9CCE0] border border-[rgba(201,204,224,0.1)] hover:border-white/20'
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
      {meta && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: meta.color }}
        />
      )}
      <span>{label}</span>
    </button>
  );
};

interface AttributeChipProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const AttributeChip: React.FC<AttributeChipProps> = ({
  label,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D1030] border border-[rgba(201,204,224,0.14)] text-xs text-[#C9CCE0] font-medium ${className}`}
    >
      {icon && <span className="text-[#FFB800]">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};
