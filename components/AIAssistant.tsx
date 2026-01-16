import React, { useState, useRef, useEffect } from 'react';
import { askTravelizAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy Compass AI. ¿En qué puedo ayudarte hoy sobre Traveliz?' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);

    const responseText = await askTravelizAssistant(query);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsThinking(false);
  };

  return (
    <>
      {/* Floating Toggle Button - Square */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-0 w-14 h-14 rounded-none shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center ${
            isOpen ? 'bg-primary rotate-90' : 'bg-brand'
        }`}
      >
        {isOpen ? (
             <i className="fa-solid fa-times text-white text-xl"></i>
        ) : (
            <i className="fa-solid fa-wand-magic-sparkles text-white text-xl animate-pulse"></i>
        )}
      </button>

      {/* Chat Window - Square */}
      <div 
        className={`fixed bottom-24 right-6 w-80 sm:w-96 bg-surface rounded-none shadow-2xl border border-neutral z-40 transition-all duration-300 transform origin-bottom-right flex flex-col ${
            isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header - Traveliz Blue */}
        <div className="p-4 bg-brand rounded-none flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-none flex items-center justify-center backdrop-blur-sm">
             <i className="fa-solid fa-robot text-white text-sm"></i>
          </div>
          <div>
            <h3 className="font-serif font-bold text-white text-sm">Compass AI</h3>
            <p className="text-gray-300 text-xs flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
               Online (Gemini 3.0)
            </p>
          </div>
        </div>

        {/* Messages Area - Background F5F6F8 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-none px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand text-white' // User: Blue
                    : 'bg-white text-primary border border-neutral' // AI: White
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-none border border-neutral shadow-sm flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-neutral bg-white rounded-none">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pregunta algo..."
              className="w-full pl-4 pr-10 py-2.5 bg-background border border-neutral rounded-none text-sm focus:ring-1 focus:ring-accent focus:outline-none transition-all placeholder-secondary text-primary"
            />
            <button 
                type="submit" 
                disabled={!query.trim() || isThinking}
                className="absolute right-2 top-2 p-1.5 text-brand hover:bg-background rounded-none transition-colors disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AIAssistant;