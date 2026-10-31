import React, { useState, useRef, useEffect } from 'react';
import { AiChatMessage } from '../../types/yugal';
import { GlowingCircles } from '../ui/GlowingCircles';
import { Button } from '../ui/Button';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  Trash2, 
  Bot, 
  User, 
  PhoneCall, 
  RotateCcw,
  HeartHandshake
} from 'lucide-react';
import { playSingingBowl, playSoftTap } from '../../utils/audio';

interface YugalAiTabProps {
  userName: string;
}

const TOPIC_CHIPS = [
  'My cycle & fatigue',
  'Hormonal balance',
  'Pregnancy inquiry',
  'Body changes',
  'Postpartum recovery',
  'Newly married intimacy',
  'Pelvic floor relaxation',
];

const INITIAL_MESSAGES: AiChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: `Namaste, Ananya. I am Yugal AI—your private, calm, and judgment-free companion. Whether you wish to explore subtle hormonal shifts, post-practice somatic sensations, or gentle emotional transitions, I am here to listen and guide you softly.`,
    timestamp: '8:00 AM',
  },
];

export const YugalAiTab: React.FC<YugalAiTabProps> = ({ userName }) => {
  const [messages, setMessages] = useState<AiChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    playSoftTap();
    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Check for urgent symptoms
    const lower = query.toLowerCase();
    const isUrgent =
      lower.includes('chest pain') ||
      lower.includes('bleeding heavily') ||
      lower.includes('fainted') ||
      lower.includes('emergency') ||
      lower.includes('severe pain') ||
      lower.includes('suicide') ||
      lower.includes('harm');

    setTimeout(() => {
      setIsLoading(false);
      let aiText = '';
      let urgentAlert = false;

      if (isUrgent) {
        urgentAlert = true;
        aiText = `Ananya, please pause and breathe with me. What you are describing requires immediate clinical attention from a medical professional or emergency medical services. Please contact your doctor or local health helpline immediately:

• National Emergency Helpline: 112 / 911
• Women's Crisis & Care Line: 1091 / 1-800-273-TALK
• Dedicated Maternal Emergency: Consult your nearest hospital emergency department right now.

Yugal AI is not equipped to handle acute medical urgencies. Please seek qualified physical care right away. Your life and wellbeing are sacred.`;
      } else if (lower.includes('cycle') || lower.includes('period') || lower.includes('hormone')) {
        aiText = `During this phase of your cycle, progesterone and estrogen levels fluctuate naturally. Notice if your body is craving more warmth and less speed. The Reset Box Card #5 (Four-Count Ocean Breath) is particularly restorative for downregulating cortisol when hormonal dips feel overwhelming. Would you like to try a 3-minute breath cycle?`;
      } else if (lower.includes('married') || lower.includes('transition')) {
        aiText = `Entering marriage brings a profound energetic rewriting of your personal space, circadian routines, and emotional boundaries. Remember that it is entirely normal to feel a yearning for quiet solitude even amidst deep love. In your Reset Box, Card #20 (Shared Solitude) offers guidance on existing together peacefully without performing.`;
      } else if (lower.includes('postpartum') || lower.includes('baby')) {
        aiText = `Your physical vessel has performed an astronomical miracle. Please release any societal pressure to 'bounce back'. Your pelvic floor, fascia, and neural pathways require gentle resting. Focus strictly on hydration, warm soups, and grounding barefoot contact like Card #1.`;
      } else {
        aiText = `Thank you for sharing this with me. When we hold tension in the mind, our pelvic floor, jaw, and shoulders often brace in response. Place one warm palm over your sternum right now, take a slow 4-count inhale through your nose, and softly exhale through your lips. You are held in safety.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUrgentAlert: urgentAlert,
        },
      ]);

      if (urgentAlert) {
        playSingingBowl(320, 3);
      }
    }, 1200);
  };

  const handleClearChat = () => {
    playSoftTap();
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] select-none animate-in fade-in duration-300">
      {/* 1. Header Bar: Name, Tone tag, Clear chat */}
      <div className="pt-1 pb-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-spectrum-gradient flex items-center justify-center text-white shadow-focal-glow">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Yugal AI
            </h2>
            <span className="text-[10px] text-[#FFB800] uppercase tracking-wider block font-medium">
              Private, calm, judgement-free
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="text-xs text-[#C9CCE0]/60 hover:text-rose-400 p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          title="Clear chat history"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* 2. Topic Chips */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {TOPIC_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSendMessage(chip)}
            className="h-[28px] px-3 rounded-full bg-[#0D1030] hover:bg-[#171A3F] border border-[rgba(201,204,224,0.12)] hover:border-[#FFB800]/50 text-[11px] text-[#C9CCE0] hover:text-white whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 3. Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar glyph */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                  isUser
                    ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40'
                    : 'bg-[#0D1030] text-[#2FA8F0] border border-white/10'
                }`}
              >
                {isUser ? <User size={13} /> : <Bot size={13} />}
              </div>

              {/* Chat Bubble (User vs AI) */}
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed font-['DM_Sans'] ${
                  isUser
                    ? 'bg-spectrum-gradient text-white rounded-tr-xs shadow-coral-halo'
                    : msg.isUrgentAlert
                    ? 'bg-[#0D1030] border-2 border-rose-500 text-rose-100 rounded-tl-xs shadow-xl'
                    : 'bg-[#0D1030] border border-[rgba(201,204,224,0.1)] text-[#DFE0FE] rounded-tl-xs shadow-gold-halo'
                }`}
              >
                {msg.isUrgentAlert && (
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                    <AlertTriangle size={14} />
                    <span>URGENT CARE PROTOCOL</span>
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.text}</p>

                <div
                  className={`mt-1.5 text-[9px] font-mono text-right ${
                    isUser ? 'text-white/70' : 'text-[#C9CCE0]/50'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading State: Pulsing Glowing Circle */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#C9CCE0]/70 py-2">
            <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-[#FFB800] border-r-[#2FA8F0] animate-spin" />
            <span className="italic">Yugal AI is reflecting thoughtfully...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Medical Disclaimer (ALWAYS VISIBLE per prompt) */}
      <div className="pt-2 pb-1 text-center">
        <span className="text-[10px] text-[#C9CCE0]/60 italic block">
          * Yugal AI is not a substitute for medical advice, clinical diagnosis, or emergency healthcare.
        </span>
      </div>

      {/* 5. Message Box Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-1 pb-2"
      >
        <div className="flex-1 h-[48px] rounded-2xl bg-[#0D1030] border border-[rgba(201,204,224,0.14)] focus-within:border-[#FFB800] px-3.5 flex items-center transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything softly..."
            className="w-full bg-transparent text-xs text-white placeholder-[#C9CCE0]/40 outline-none font-['DM_Sans']"
          />
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="w-[48px] h-[48px] rounded-2xl bg-spectrum-gradient text-white flex items-center justify-center shadow-coral-halo disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
