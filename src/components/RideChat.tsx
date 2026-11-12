import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Phone, MapPin, CheckCheck, Sparkles } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'passenger' | 'driver';
  text: string;
  time: string;
}

interface RideChatProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
  driverAvatar?: string;
  carModel: string;
  licensePlate?: string;
  originName: string;
}

export const RideChat: React.FC<RideChatProps> = ({
  isOpen,
  onClose,
  driverName,
  driverAvatar,
  carModel,
  licensePlate = '12345 | A | 1',
  originName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'driver',
      text: `Salam ! Je suis en route avec la ${carModel}. Où êtes-vous exactement à ${originName} ?`,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    'Je suis devant la porte',
    'En face de la pharmacie',
    'Au rond-point Takadoum',
    "J'ai un sac noir",
    'J arrive dans 1 min',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'passenger',
      text,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText('');

    // Simulate driver acknowledgment
    setIsTyping(true);
    setTimeout(() => {
      const replies = [
        'Bien reçu ! Je ralentis et je mets les feux de détresse.',
        'Parfait, je vous vois, je m arrête juste devant.',
        'D accord, j arrive dans 45 secondes chrono.',
        'Noté, je suis juste à votre niveau.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
          sender: 'driver',
          text: randomReply,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs select-none animate-fade-in p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Chat Container */}
      <div className="relative w-full max-w-md h-[85vh] sm:h-[620px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 flex flex-col justify-between overflow-hidden z-10">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              {driverAvatar ? (
                <img
                  src={driverAvatar}
                  alt={driverName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  {driverName.charAt(0)}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-black truncate leading-tight">
                  {driverName}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                  Conducteur
                </span>
              </div>
              <p className="text-[11px] text-gray-500 truncate font-medium">
                {carModel} · <span className="font-mono">{licensePlate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pickup Location Banner */}
        <div className="bg-[#F9FAFB] border-b border-gray-100 px-4 py-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-gray-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-black" />
            <span>Point de rendez-vous :</span>
            <strong className="text-black font-bold">{originName}</strong>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            En direct
          </span>
        </div>

        {/* Scrollable Message History List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-[#F9FAFB]/50 overscroll-contain">
          <div className="text-center my-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white border border-gray-100 px-2.5 py-1 rounded-full shadow-2xs">
              Coordination de la prise en charge
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === 'passenger';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-black text-white rounded-br-xs'
                      : 'bg-white text-black border border-gray-200/80 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-1 px-1 text-[10px] text-gray-400">
                  <span>{m.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-black stroke-[2.5]" />}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 p-2 max-w-[120px] bg-white border border-gray-200 rounded-2xl rounded-bl-xs">
              <span className="text-[10px] font-semibold text-gray-500">{driverName.split(' ')[0]} écrit</span>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Coordination Chips */}
        <div className="flex-shrink-0 bg-white px-3 pt-2.5 pb-1 border-t border-gray-100 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#F3F4F6] hover:bg-black hover:text-white text-[11px] font-semibold text-gray-700 border border-gray-200 transition-colors cursor-pointer active:scale-95 flex-shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Sticky Text Input Field at Bottom */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="sticky bottom-0 z-20 flex-shrink-0 p-3 bg-white border-t border-gray-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Écrire un message pour le point de rencontre..."
            className="flex-1 bg-[#F3F4F6] border border-gray-200 rounded-full px-4 py-2.5 text-xs text-black placeholder:text-gray-400 focus:outline-hidden focus:border-black transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-black hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center cursor-pointer transition-transform active:scale-95 flex-shrink-0"
            title="Envoyer"
          >
            <Send className="w-4 h-4 stroke-[2]" />
          </button>
        </form>
      </div>
    </div>
  );
};
