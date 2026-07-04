import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Sparkles, User, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface CounsellorBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CounsellorBot({ isOpen, onClose }: CounsellorBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your GyaanPeeth AI Counselling Specialist. 🎓 I can help you find and compare the ideal UGC-DEB approved online degrees (MBA, MCA, BCA, etc.) based on your career interests, budget, and learning style. How can I guide you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Recommend an Online MBA under 2L",
    "Compare Amity vs NMIMS for MBA",
    "Is an Online MCA degree valid?",
    "Which university has best placements?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6) // Send recent context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch AI reply');
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Connecting to counselling services...');
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Our AI counselling node is initializing. In the meantime, you can easily compare universities side-by-side using our "Compare Colleges" tool above, or submit our quick Admission Enquiry form to schedule a direct call with an elite senior admissions consultant!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="counsellor-bot-panel"
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-24 right-6 w-full max-w-md h-[550px] bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="brand-gradient p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-500/10 rounded-xl text-accent-500 border border-accent-500/30">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wide text-white flex items-center gap-1.5">
                  GyaanPeeth AI Counsellor
                  <Sparkles className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
                </h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Online & Active
                </span>
              </div>
            </div>
            <button 
              id="close-bot-btn"
              onClick={onClose} 
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-accent-500/10 text-accent-500 flex items-center justify-center border border-accent-500/20 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-accent-500 text-slate-950 font-medium' 
                    : 'bg-slate-800/80 border border-slate-700/50 text-slate-100'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`block text-[9px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-accent-500/10 text-accent-500 flex items-center justify-center border border-accent-500/20 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-xs text-slate-300 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent-500" />
                  Analyzing best academic options...
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-[11px] text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Interactive Advisory Active</p>
                  <p className="text-slate-400">For complete personal assistance, consider leaving your details in our enquiry panel!</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-900">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">Quick Counselling Queries:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    id={`suggested-question-${idx}`}
                    onClick={() => handleSend(q)}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full transition-colors border border-slate-700/40 text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-900 flex gap-2">
            <input
              id="bot-chat-input"
              type="text"
              placeholder="Ask anything about fees, placement, recognition..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
            />
            <button
              id="send-bot-msg-btn"
              onClick={() => handleSend(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="p-2 bg-accent-500 hover:bg-accent-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl transition-all font-semibold flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
