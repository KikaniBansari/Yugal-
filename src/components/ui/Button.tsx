import React from 'react';
import { playSoftTap } from '../../utils/audio';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text' | 'ghost';
  size?: 'default' | 'compact' | 'sm';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  fullWidth = true,
  children,
  icon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      playSoftTap();
      if (onClick) onClick(e);
    }
  };

  const heightClass = size === 'default' ? 'h-[54px]' : size === 'compact' ? 'h-[46px]' : 'h-[36px]';
  const paddingClass = size === 'default' ? 'px-6' : size === 'compact' ? 'px-4' : 'px-3';
  const textClass = size === 'default' ? 'text-[14px] font-semibold' : size === 'compact' ? 'text-[13px] font-medium' : 'text-[12px] font-medium';

  if (variant === 'primary') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`${fullWidth ? 'w-full' : 'inline-flex'} ${heightClass} ${paddingClass} ${textClass} rounded-full bg-spectrum-gradient text-white tracking-wide flex items-center justify-center gap-2.5 shadow-coral-halo active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`${fullWidth ? 'w-full' : 'inline-flex'} ${heightClass} ${paddingClass} ${textClass} rounded-full bg-[#0D1030]/60 hover:bg-[#0D1030] border border-[rgba(201,204,224,0.2)] hover:border-[#FFB800] text-[#C9CCE0] hover:text-white tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#C9CCE0]/75 hover:text-[#FFB800] transition-colors cursor-pointer disabled:opacity-50 ${className}`}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${fullWidth ? 'w-full' : 'inline-flex'} ${heightClass} ${paddingClass} ${textClass} rounded-full bg-white/5 hover:bg-white/10 text-[#C9CCE0] hover:text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
