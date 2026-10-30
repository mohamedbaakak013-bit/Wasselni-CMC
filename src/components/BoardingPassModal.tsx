import React, { useEffect, useState } from 'react';
import { BoardingPassData } from '../types';
import { soundManager } from '../utils/audio';
import { CheckCircle2, QrCode, Download, Share2, X, Clock, Car, MapPin, Sparkles } from 'lucide-react';

interface BoardingPassModalProps {
  pass: BoardingPassData | null;
  onClose: () => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({ pass, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [countdownMinutes, setCountdownMinutes] = useState(7);
  const [countdownSeconds, setCountdownSeconds] = useState(45);

  useEffect(() => {
    if (!pass) return;
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev > 0) return prev - 1;
        setCountdownMinutes((m) => (m > 0 ? m - 1 : 0));
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pass]);

  if (!pass) return null;

  const handleShare = () => {
    soundManager.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Wcmc Pass: ${pass.ticketId} | Trajet: ${pass.origin} ➔ ${pass.destination} | Départ: ${pass.departureTime}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md hologram-card rounded-3xl p-6 overflow-hidden border border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.25)]">
        {/* Holographic light beam effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
          aria-label="Fermer le pass"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pass Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>PASS VALIDÉ · EMBARQUEMENT PRIORITAIRE</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white font-heading">
            {pass.serviceType}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ticket #{pass.ticketId} · CMC Béni Mellal
          </p>
        </div>

        {/* Holographic QR Code Area */}
        <div className="bg-[#090d14] rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center mb-5 shadow-inner">
          <div className="relative p-3 bg-white rounded-xl shadow-lg mb-3">
            {/* High visual fidelity simulated matrix QR */}
            <svg className="w-36 h-36" viewBox="0 0 25 25">
              {/* Corner position markers */}
              {/* Top-Left */}
              <rect x="0" y="0" width="7" height="7" fill="#050505" />
              <rect x="1" y="1" width="5" height="5" fill="#ffffff" />
              <rect x="2" y="2" width="3" height="3" fill="#050505" />

              {/* Top-Right */}
              <rect x="18" y="0" width="7" height="7" fill="#050505" />
              <rect x="19" y="1" width="5" height="5" fill="#ffffff" />
              <rect x="20" y="2" width="3" height="3" fill="#050505" />

              {/* Bottom-Left */}
              <rect x="0" y="18" width="7" height="7" fill="#050505" />
              <rect x="1" y="19" width="5" height="5" fill="#ffffff" />
              <rect x="2" y="20" width="3" height="3" fill="#050505" />

              {/* Data modules */}
              <rect x="9" y="2" width="2" height="2" fill="#050505" />
              <rect x="13" y="1" width="2" height="3" fill="#050505" />
              <rect x="10" y="6" width="3" height="2" fill="#050505" />
              <rect x="2" y="9" width="2" height="4" fill="#050505" />
              <rect x="5" y="11" width="2" height="2" fill="#050505" />
              <rect x="9" y="10" width="4" height="4" fill="#050505" />
              <rect x="15" y="9" width="3" height="2" fill="#050505" />
              <rect x="19" y="10" width="4" height="2" fill="#050505" />
              <rect x="10" y="16" width="2" height="3" fill="#050505" />
              <rect x="14" y="14" width="3" height="3" fill="#050505" />
              <rect x="18" y="15" width="2" height="4" fill="#050505" />
              <rect x="9" y="21" width="3" height="3" fill="#050505" />
              <rect x="14" y="20" width="2" height="3" fill="#050505" />
              <rect x="18" y="21" width="4" height="2" fill="#050505" />
              <rect x="22" y="18" width="2" height="2" fill="#050505" />
              <rect x="2" y="14" width="2" height="2" fill="#050505" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px] shadow-sm">
                CMC
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[11px] font-mono text-emerald-400">
              Scannez auprès du chauffeur ou à la borne CMC
            </span>
            <div className="flex items-center justify-center gap-1.5 text-xs text-white/70 mt-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Arrivée estimée dans{' '}
                <strong className="text-white">
                  {countdownMinutes}:{countdownSeconds < 10 ? `0${countdownSeconds}` : countdownSeconds}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Trajectory Details */}
        <div className="space-y-3 bg-white/[0.03] p-4 rounded-2xl border border-white/10 text-xs mb-5">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">Point de Ramassage</span>
            </div>
            <span className="font-semibold text-white">{pass.origin}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Destination</span>
            </div>
            <span className="font-semibold text-white">{pass.destination}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">Conducteur / Véhicule</span>
            </div>
            <span className="font-semibold text-white">{pass.driverOrVehicle}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300">Place / Siège</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {pass.seatInfo}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-all"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>{copied ? 'Copié !' : 'Partager'}</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Prêt à partir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
