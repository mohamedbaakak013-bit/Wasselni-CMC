import React from 'react';
import { soundManager } from '../utils/audio';
import { Sparkles, X, Heart, Shield, Award, MapPin, Rocket, Users } from 'lucide-react';

interface FounderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderModal: React.FC<FounderModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-6 md:p-8 overflow-hidden border border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.3)]">
        {/* Glow ambient spots */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
          aria-label="Fermer la modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Manifeste Fondateur · Béni Mellal</span>
        </div>

        <h3 className="text-2xl font-bold text-white font-heading tracking-tight">
          Architected by Mohamed &amp; Doaa
        </h3>
        <p className="text-xs font-mono text-cyan-400 mt-0.5">
          CMC 2026 ✦ Cité des Métiers et des Compétences
        </p>

        {/* The Core Mission */}
        <div className="my-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            <strong className="text-white">Le Défi :</strong> Située à Mghila à plus de 7 kilomètres du centre de Béni Mellal, la CMC représente l'excellence de la formation professionnelle marocaine. Pourtant, les étudiants faisaient face quotidiennement à des grands taxis onéreux (15 à 20 MAD la course) ou des trajets aléatoires.
          </p>
          <p>
            <strong className="text-emerald-400">La Vision Wasselni :</strong> Nous avons imaginé une plateforme à l'intersection du spatial design, de la mutualisation urbaine et de la dignité étudiante. Un tarif unique et solidaire de <strong>5 MAD</strong>, sans commission abusive.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-3 gap-2.5 text-center my-4">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-white">5 MAD Fixe</div>
            <div className="text-[9px] text-white/50 font-mono">Budget Étudiant</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <Rocket className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-white">4 min ETA</div>
            <div className="text-[9px] text-white/50 font-mono">Smart Navettes</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <Shield className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-white">90% Conducteur</div>
            <div className="text-[9px] text-white/50 font-mono">Équité Totale</div>
          </div>
        </div>

        {/* Founders Note */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Conçu avec passion pour la communauté CMC</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all"
          >
            Découvrir l'App
          </button>
        </div>
      </div>
    </div>
  );
};
