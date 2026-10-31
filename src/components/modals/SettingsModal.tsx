import React, { useState } from 'react';
import { UserProfile, LifePhase } from '../../types/yugal';
import { X, Bell, Lock, Heart, RefreshCw, HelpCircle, LogOut, Trash2, ChevronRight, Check } from 'lucide-react';
import { playSoftTap } from '../../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateLifePhase: (phase: LifePhase) => void;
  onRetakeAssessment: () => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateLifePhase,
  onRetakeAssessment,
  onLogout,
}) => {
  const [notifications, setNotifications] = useState(true);
  const [soundChimes, setSoundChimes] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLifePhaseSelect, setShowLifePhaseSelect] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-[#04061A] border border-[rgba(201,204,224,0.15)] rounded-3xl p-5 text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFB800]">
              SANCTUARY CONFIGURATION
            </span>
            <h3 className="text-base font-semibold text-white">
              Settings & Privacy
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0D1030] flex items-center justify-center text-[#C9CCE0]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Settings List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {/* Notifications */}
          <div className="p-4 rounded-2xl bg-[#0D1030] border border-white/5 space-y-3">
            <span className="text-xs font-semibold text-[#FFB800] uppercase tracking-wider block">
              Preferences
            </span>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Bell size={16} className="text-[#C9CCE0]" />
                <div>
                  <span className="text-white font-medium block">Daily Gentle Reminder</span>
                  <span className="text-[10px] text-[#C9CCE0]/60">Morning & dusk unhurried prompts</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="accent-[#FFB800] w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <div className="flex items-center gap-2.5">
                <Lock size={16} className="text-[#C9CCE0]" />
                <div>
                  <span className="text-white font-medium block">Privacy & End-to-End Vault</span>
                  <span className="text-[10px] text-[#C9CCE0]/60">Your journal entries never train public models</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">LOCKED</span>
            </div>
          </div>

          {/* Life Phase Setting */}
          <div className="p-4 rounded-2xl bg-[#0D1030] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Heart size={16} className="text-[#D6469A]" />
                <div>
                  <span className="text-white font-medium block">Current Life Phase</span>
                  <span className="text-[11px] text-[#FFB800]">{user.lifePhase}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLifePhaseSelect(!showLifePhaseSelect)}
                className="text-xs text-[#2FA8F0] underline"
              >
                Change
              </button>
            </div>

            {showLifePhaseSelect && (
              <div className="pt-2 space-y-1.5 border-t border-white/5">
                {(['Unmarried', 'Recently married', 'Postpartum', 'Prefer not to say'] as LifePhase[]).map((lp) => (
                  <button
                    key={lp}
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      onUpdateLifePhase(lp);
                      setShowLifePhaseSelect(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-colors ${
                      user.lifePhase === lp
                        ? 'bg-[#FFB800]/20 text-[#FFB800] font-semibold'
                        : 'bg-[#04061A]/50 text-[#C9CCE0] hover:text-white'
                    }`}
                  >
                    {lp}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Retake Assessment & Help */}
          <div className="rounded-2xl bg-[#0D1030] border border-white/5 divide-y divide-white/5 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                onClose();
                onRetakeAssessment();
              }}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 text-xs text-white cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw size={15} className="text-[#2FA8F0]" />
                <span>Retake Baseline Assessment</span>
              </div>
              <ChevronRight size={14} className="text-[#C9CCE0]/50" />
            </button>

            <button
              type="button"
              onClick={() => playSoftTap()}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 text-xs text-white cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle size={15} className="text-[#FFB800]" />
                <span>Reset Box Support & Guide FAQ</span>
              </div>
              <ChevronRight size={14} className="text-[#C9CCE0]/50" />
            </button>
          </div>

          {/* Account Actions: Log Out & Delete Account */}
          <div className="rounded-2xl bg-[#0D1030] border border-white/5 divide-y divide-white/5 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                onClose();
                onLogout();
              }}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-rose-500/10 text-xs text-rose-400 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LogOut size={15} />
                <span>Log out</span>
              </div>
              <ChevronRight size={14} className="opacity-50" />
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-red-900/20 text-xs text-red-400 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Trash2 size={15} />
                <span>Delete Account & Inscriptions</span>
              </div>
              <ChevronRight size={14} className="opacity-50" />
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs space-y-2">
              <span className="font-semibold text-red-300 block">
                Are you sure?
              </span>
              <p className="text-[#C9CCE0]/80 leading-relaxed text-[11px]">
                This permanently erases all journal entries, challenge milestones, and paired box status from this device.
              </p>
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full py-2 rounded-xl bg-red-600 text-white font-semibold text-xs"
              >
                Yes, Delete Permanently
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
