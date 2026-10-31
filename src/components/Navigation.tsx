import React from 'react';
import { Home, BookOpen, QrCode, Bot, User } from 'lucide-react';
import { playSoftTap } from '../utils/audio';

export type YugalTab = 'home' | 'journal' | 'yugal_ai' | 'profile';

interface NavigationProps {
  activeTab: YugalTab;
  onTabChange: (tab: YugalTab) => void;
  onOpenScanner: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenScanner,
}) => {
  const handleTabClick = (tab: YugalTab) => {
    playSoftTap();
    onTabChange(tab);
  };

  const handleScanClick = () => {
    playSoftTap();
    onOpenScanner();
  };

  return (
    <nav 
      aria-label="Main Navigation"
      className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none pb-safe"
    >
      <div className="w-full max-w-md pointer-events-auto relative">
        {/* Navigation Bar Surface */}
        <div className="h-[68px] bg-[#0D1030]/95 backdrop-blur-[30px] border-t border-[rgba(201,204,224,0.12)] px-3 flex items-center justify-between relative shadow-[0_-8px_24px_rgba(4,6,26,0.6)]">
          {/* Left Tabs: Home & Journal */}
          <div className="flex items-center space-x-6 flex-1 justify-around pr-7">
            {/* Home Tab */}
            <button
              type="button"
              onClick={() => handleTabClick('home')}
              className="flex flex-col items-center justify-center py-1 transition-all group relative cursor-pointer"
            >
              <Home
                size={22}
                className={`transition-colors ${
                  activeTab === 'home' ? 'text-[#FFB800]' : 'text-[#C9CCE0] group-hover:text-white'
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-wide mt-1 transition-colors ${
                  activeTab === 'home' ? 'text-[#FFB800] font-semibold' : 'text-[#C9CCE0]/70 group-hover:text-white'
                }`}
              >
                Home
              </span>
              {activeTab === 'home' && (
                <span className="w-1 h-1 rounded-full bg-[#FFB800] mt-0.5" />
              )}
            </button>

            {/* Journal Tab */}
            <button
              type="button"
              onClick={() => handleTabClick('journal')}
              className="flex flex-col items-center justify-center py-1 transition-all group relative cursor-pointer"
            >
              <BookOpen
                size={22}
                className={`transition-colors ${
                  activeTab === 'journal' ? 'text-[#FFB800]' : 'text-[#C9CCE0] group-hover:text-white'
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-wide mt-1 transition-colors ${
                  activeTab === 'journal' ? 'text-[#FFB800] font-semibold' : 'text-[#C9CCE0]/70 group-hover:text-white'
                }`}
              >
                Journal
              </span>
              {activeTab === 'journal' && (
                <span className="w-1 h-1 rounded-full bg-[#FFB800] mt-0.5" />
              )}
            </button>
          </div>

          {/* Elevated Scan Center Button: 60px circular button elevated -18px, full gradient, most prominent */}
          <div className="absolute left-1/2 -top-[20px] -translate-x-1/2 flex flex-col items-center">
            {/* Dynamic ambient pulse ring */}
            <div className="absolute -inset-1 rounded-full bg-spectrum-gradient opacity-40 blur-md animate-pulse pointer-events-none" />

            <button
              type="button"
              onClick={handleScanClick}
              title="Scan physical QR challenge card"
              className="relative w-[60px] h-[60px] rounded-full bg-spectrum-gradient text-white flex items-center justify-center ring-4 ring-[#04061A] shadow-focal-glow active:scale-95 transition-all group cursor-pointer"
            >
              <QrCode size={26} className="text-white drop-shadow-sm group-hover:scale-105 transition-transform" />
            </button>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#FFB800] mt-1 drop-shadow">
              Scan
            </span>
          </div>

          {/* Right Tabs: Yugal AI & Profile */}
          <div className="flex items-center space-x-6 flex-1 justify-around pl-7">
            {/* Yugal AI Tab */}
            <button
              type="button"
              onClick={() => handleTabClick('yugal_ai')}
              className="flex flex-col items-center justify-center py-1 transition-all group relative cursor-pointer"
            >
              <Bot
                size={22}
                className={`transition-colors ${
                  activeTab === 'yugal_ai' ? 'text-[#FFB800]' : 'text-[#C9CCE0] group-hover:text-white'
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-wide mt-1 transition-colors ${
                  activeTab === 'yugal_ai' ? 'text-[#FFB800] font-semibold' : 'text-[#C9CCE0]/70 group-hover:text-white'
                }`}
              >
                Yugal AI
              </span>
              {activeTab === 'yugal_ai' && (
                <span className="w-1 h-1 rounded-full bg-[#FFB800] mt-0.5" />
              )}
            </button>

            {/* Profile Tab */}
            <button
              type="button"
              onClick={() => handleTabClick('profile')}
              className="flex flex-col items-center justify-center py-1 transition-all group relative cursor-pointer"
            >
              <User
                size={22}
                className={`transition-colors ${
                  activeTab === 'profile' ? 'text-[#FFB800]' : 'text-[#C9CCE0] group-hover:text-white'
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-wide mt-1 transition-colors ${
                  activeTab === 'profile' ? 'text-[#FFB800] font-semibold' : 'text-[#C9CCE0]/70 group-hover:text-white'
                }`}
              >
                Profile
              </span>
              {activeTab === 'profile' && (
                <span className="w-1 h-1 rounded-full bg-[#FFB800] mt-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
