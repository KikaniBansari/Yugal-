import React, { useState } from 'react';
import { Affirmation } from '../../types/yugal';
import { GlowingCircles } from '../ui/GlowingCircles';
import { Button } from '../ui/Button';
import { X, Bookmark, BookmarkCheck, Share2, Sparkles, Check } from 'lucide-react';
import { playSoftTap } from '../../utils/audio';

interface AffirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  affirmation: Affirmation;
  onToggleSave: (id: string) => void;
}

export const AffirmationModal: React.FC<AffirmationModalProps> = ({
  isOpen,
  onClose,
  affirmation,
  onToggleSave,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    playSoftTap();
    navigator.clipboard?.writeText?.(affirmation.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-sm bg-[#04061A] border border-[rgba(201,204,224,0.15)] rounded-3xl p-6 text-white shadow-2xl flex flex-col justify-between min-h-[460px] overflow-hidden">
        {/* Top close */}
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800]">
            SACRED AFFIRMATION
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0D1030] text-[#C9CCE0] hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Center: Soft Glowing Circles & Large Affirmation */}
        <div className="my-auto text-center space-y-6 relative z-10 py-4">
          <div className="flex justify-center">
            <GlowingCircles size={160} pulsing={true} />
          </div>

          <div className="space-y-2">
            <p className="text-xl sm:text-2xl font-semibold text-white italic leading-relaxed font-['DM_Sans'] px-2">
              "{affirmation.text}"
            </p>
            <span className="text-xs text-[#FFB800] uppercase tracking-wider block font-medium">
              — {affirmation.authorOrPhase}
            </span>
          </div>
        </div>

        {/* Bottom Actions: Save and Share */}
        <div className="space-y-2.5 relative z-10 pt-4">
          <Button
            variant={affirmation.isSaved ? 'outline' : 'primary'}
            onClick={() => onToggleSave(affirmation.id)}
            icon={affirmation.isSaved ? <BookmarkCheck size={16} className="text-[#FFB800]" /> : <Bookmark size={16} />}
          >
            {affirmation.isSaved ? 'Saved in Sanctuary' : 'Save to Sanctuary'}
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            icon={copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
          >
            {copied ? 'Affirmation Copied' : 'Share with Sister'}
          </Button>
        </div>
      </div>
    </div>
  );
};
