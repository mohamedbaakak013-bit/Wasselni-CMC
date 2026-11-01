import React from 'react';
import { AppMode } from '../types';
import { soundManager } from '../utils/audio';
import { GraduationCap, Bus, Car, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface DynamicIslandNavProps {
  currentMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenFounders: () => void;
}

export const DynamicIslandNav: React.FC<DynamicIslandNavProps> = ({
  currentMode,
  onChangeMode,
  isMuted,
  onToggleMute,
  onOpenFounders,
}) => {
  const modes: { id: AppMode; label: string; icon: React.ReactNode; tag: string }[] = [
    {
      id: 'etudiant',
      label: 'Étudiant',
      icon: <GraduationCap className="w-4 h-4" />,
      tag: '5 MAD',
    },
    {
      id: 'navette',
      label: 'Smart Navette',
      icon: <Bus className="w-4 h-4" />,
      tag: 'Express',
    },
    {
      id: 'conducteur',
      label: 'Conducteur',
      icon: <Car className="w-4 h-4" />,
      tag: '90% Net',
    },
  ];

  const handleModeClick = (mode: AppMode) => {
    if (mode !== currentMode) {
      soundManager.playModeSwitch();
      onChangeMode(mode);
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex flex-col items-center pointer-events-none px-4">
      {/* Dynamic Island Container */}
      <div className="pointer-events-auto relative p-1.5 rounded-full bg-[#0a0d16]/85 backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] flex items-center gap-1 sm:gap-2 transition-all duration-300">
        {/* Glow pill behind active tab */}
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleModeClick(m.id)}
              className={`relative px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 text-xs font-semibold cursor-pointer select-none ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.6)] font-bold scale-[1.02]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {m.icon}
              <span className="font-heading">{m.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono hidden sm:inline ${
                  isActive
                    ? 'bg-black/25 text-black font-bold'
                    : 'bg-white/10 text-emerald-400'
                }`}
              >
                {m.tag}
              </span>
            </button>
          );
        })}

        {/* Vertical divider */}
        <div className="h-5 w-px bg-white/15 mx-0.5" />

        {/* Sound toggle button */}
        <button
          onClick={() => {
            onToggleMute();
          }}
          className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          title={isMuted ? 'Activer le son spatial' : 'Son spatial actif'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400/80" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Founder Branding: Sleek floating frosted-glass signature */}
      <button
        onClick={onOpenFounders}
        className="pointer-events-auto mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-[11px] text-white/60 hover:text-white/90 transition-all cursor-pointer group shadow-sm"
      >
        <Sparkles className="w-3 h-3 text-cyan-400 group-hover:text-emerald-400 transition-colors" />
        <span className="font-mono tracking-wide">
          Architected by <strong className="text-white font-semibold">Baakak</strong> ✦ CMC 2026
        </span>
      </button>
    </div>
  );
};
