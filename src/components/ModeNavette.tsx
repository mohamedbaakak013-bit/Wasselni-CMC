import React, { useState } from 'react';
import { NavetteSeat, BoardingPassData } from '../types';
import { soundManager } from '../utils/audio';
import { Users, Clock, ShieldCheck, ArrowRight, Zap, CheckCircle, Sparkles } from 'lucide-react';

interface ModeNavetteProps {
  balance: number;
  onBookNavetteSeat: (seatNumber: number, seatLabel: string) => void;
  selectedOriginName: string;
}

export const ModeNavette: React.FC<ModeNavetteProps> = ({
  balance,
  onBookNavetteSeat,
  selectedOriginName,
}) => {
  // 8-passenger layout + 1 driver cabin
  const [seats, setSeats] = useState<NavetteSeat[]>([
    { id: 1, label: 'Siège 01 (Fenêtre Gauche)', status: 'occupied', passengerName: 'Yassine M.' },
    { id: 2, label: 'Siège 02 (Fenêtre Droite)', status: 'empty' },
    { id: 3, label: 'Siège 03 (Milieu Gauche)', status: 'occupied', passengerName: 'Salma K.' },
    { id: 4, label: 'Siège 04 (Centre)', status: 'selected' },
    { id: 5, label: 'Siège 05 (Milieu Droit)', status: 'occupied', passengerName: 'Hamza B.' },
    { id: 6, label: 'Siège 06 (Fond Gauche)', status: 'empty' },
    { id: 7, label: 'Siège 07 (Fond Centre)', status: 'occupied', passengerName: 'Oumaima T.' },
    { id: 8, label: 'Siège 08 (Fond Droit)', status: 'empty' },
  ]);

  const [isConfirming, setIsConfirming] = useState(false);

  const selectedSeat = seats.find((s) => s.status === 'selected');
  const occupiedCount = seats.filter((s) => s.status === 'occupied').length + (selectedSeat ? 1 : 0);

  const handleSeatClick = (seatId: number) => {
    const target = seats.find((s) => s.id === seatId);
    if (!target || target.status === 'occupied') return;

    soundManager.playSeatPop();
    setSeats((prev) =>
      prev.map((s) => {
        if (s.id === seatId) {
          return { ...s, status: s.status === 'selected' ? 'empty' : 'selected' };
        }
        if (s.status === 'selected') {
          return { ...s, status: 'empty' };
        }
        return s;
      })
    );
  };

  const handleConfirmSeat = () => {
    if (!selectedSeat) return;
    setIsConfirming(true);
    soundManager.playSuccess();
    setTimeout(() => {
      setIsConfirming(false);
      onBookNavetteSeat(selectedSeat.id, selectedSeat.label);
    }, 400);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Intro Promise Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Smart Navette Express · Départs Garantis</span>
          </div>
          <h3 className="text-lg font-bold text-white font-heading mt-0.5">
            Zéro attente, place assise sécurisée
          </h3>
          <p className="text-xs text-slate-300">
            Minivans électriques climatisés réservés aux étudiants et formateurs CMC.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/50 px-3.5 py-2 rounded-xl border border-white/10 self-start sm:self-auto font-mono text-xs">
          <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
          <div>
            <div className="text-[10px] text-white/50 uppercase">Prochain départ</div>
            <div className="text-white font-bold">Dans 4 min 20s</div>
          </div>
        </div>
      </div>

      {/* Centerpiece 2D Neon Wireframe of Minivan */}
      <div className="relative rounded-3xl p-6 md:p-8 hologram-card border border-white/10 flex flex-col items-center">
        {/* Minivan Wireframe Title & Legend */}
        <div className="w-full flex items-center justify-between mb-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-white">CMC Shuttle #03</span>
            <span className="text-white/30">|</span>
            <span className="text-emerald-400 font-mono font-medium">
              {occupiedCount} / {seats.length} Places
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border border-cyan-400 bg-cyan-400/20 animate-pulse" />
              <span className="text-slate-300">Libre</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <span className="text-emerald-300 font-semibold">Votre Choix</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-white/20" />
              <span className="text-slate-500">Occupé</span>
            </div>
          </div>
        </div>

        {/* Minivan Chassis Outline (Top-Down Perspective) */}
        <div className="relative w-full max-w-[320px] sm:max-w-[360px] py-8 px-6 rounded-[45px] bg-[#080b12] border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)]">
          {/* Front Windshield Glow */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-48 h-6 rounded-t-full border-t-2 border-x-2 border-cyan-400/60 bg-cyan-500/10" />

          {/* Side mirrors */}
          <div className="absolute top-12 -left-3 w-3 h-6 rounded-l-md bg-cyan-500/40 border border-cyan-400" />
          <div className="absolute top-12 -right-3 w-3 h-6 rounded-r-md bg-cyan-500/40 border border-cyan-400" />

          {/* Front Cabin: Driver on Left + Passenger 01 on Right */}
          <div className="mb-6 flex items-center justify-between px-2 pt-2 pb-4 border-b border-white/10">
            {/* Driver position */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/60 flex flex-col items-center justify-center text-cyan-300 shadow-sm">
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center animate-spin-slow">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <span className="text-[9px] font-mono mt-1 font-semibold">Chauffeur</span>
              </div>
              <span className="text-[10px] text-white/50 font-mono mt-1">CMC Agréé</span>
            </div>

            {/* Front Passenger Seat 01 */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleSeatClick(1)}
                disabled={seats[0].status === 'occupied'}
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform ${
                  seats[0].status === 'selected'
                    ? 'bg-emerald-400 text-black font-bold scale-105 shadow-[0_0_20px_#10b981]'
                    : seats[0].status === 'occupied'
                    ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
                    : 'bg-cyan-500/10 border-2 border-cyan-400/80 text-cyan-200 hover:bg-cyan-500/25 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                }`}
                aria-label={seats[0].label}
              >
                <span className="text-xs font-mono font-bold">#01</span>
                <span className="text-[9px] font-mono">
                  {seats[0].status === 'occupied' ? 'Occupé' : 'Vip'}
                </span>
              </button>
              <span className="text-[10px] text-white/50 font-mono mt-1">Avant</span>
            </div>
          </div>

          {/* Row 2: 3 Seats (#02, #03, #04) */}
          <div className="mb-4">
            <div className="text-[10px] uppercase font-mono text-white/40 mb-1.5 text-center">
              Rangée 2 · Milieu
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[seats[1], seats[2], seats[3]].map((seat) => {
                const isSelected = seat.status === 'selected';
                const isOccupied = seat.status === 'occupied';
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat.id)}
                    disabled={isOccupied}
                    className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform ${
                      isSelected
                        ? 'bg-emerald-400 text-black font-bold scale-110 shadow-[0_0_22px_#10b981] z-10'
                        : isOccupied
                        ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                        : 'bg-cyan-500/10 border-2 border-cyan-400/70 text-cyan-200 hover:bg-cyan-500/20 hover:scale-105 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse'
                    }`}
                    aria-label={seat.label}
                  >
                    <span className="text-xs font-mono font-bold">#{seat.id < 10 ? `0${seat.id}` : seat.id}</span>
                    <span className="text-[9px] font-mono">
                      {isOccupied ? 'Occupé' : isSelected ? 'Choisi' : 'Libre'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: 4 Seats (#05, #06, #07, #08) */}
          <div>
            <div className="text-[10px] uppercase font-mono text-white/40 mb-1.5 text-center">
              Rangée 3 · Arrière
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[seats[4], seats[5], seats[6], seats[7]].map((seat) => {
                const isSelected = seat.status === 'selected';
                const isOccupied = seat.status === 'occupied';
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat.id)}
                    disabled={isOccupied}
                    className={`h-13 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform ${
                      isSelected
                        ? 'bg-emerald-400 text-black font-bold scale-110 shadow-[0_0_22px_#10b981] z-10'
                        : isOccupied
                        ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                        : 'bg-cyan-500/10 border-2 border-cyan-400/70 text-cyan-200 hover:bg-cyan-500/20 hover:scale-105 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse'
                    }`}
                    aria-label={seat.label}
                  >
                    <span className="text-xs font-mono font-bold">#{seat.id < 10 ? `0${seat.id}` : seat.id}</span>
                    <span className="text-[8px] font-mono">
                      {isOccupied ? 'Occupé' : isSelected ? 'Choisi' : 'Libre'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rear lights indicator */}
          <div className="mt-6 flex justify-between px-3">
            <div className="w-8 h-2 rounded bg-red-500/60 shadow-[0_0_8px_#ef4444]" />
            <div className="w-8 h-2 rounded bg-red-500/60 shadow-[0_0_8px_#ef4444]" />
          </div>
        </div>

        {/* Selected Seat Feedback */}
        <div className="mt-6 text-center">
          {selectedSeat ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>
                Siège <strong>#{selectedSeat.id < 10 ? `0${selectedSeat.id}` : selectedSeat.id}</strong> sélectionné · {selectedOriginName || 'Takadoum'} ➔ CMC
              </span>
            </div>
          ) : (
            <p className="text-xs text-white/40 font-mono">
              Touchez un siège en néon cyan pour verrouiller votre place
            </p>
          )}
        </div>
      </div>

      {/* Action Button: Confirm Seat */}
      <div>
        <button
          onClick={handleConfirmSeat}
          disabled={!selectedSeat || isConfirming}
          className={`relative w-full py-4 px-6 rounded-2xl font-extrabold text-base md:text-lg tracking-wide uppercase transition-all flex items-center justify-center gap-3 overflow-hidden ${
            selectedSeat
              ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-emerald-500 text-black shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:shadow-[0_0_50px_rgba(16,185,129,0.9)] cursor-pointer hover:scale-[1.01]'
              : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
          }`}
        >
          {isConfirming ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Attribution du Siège & Billet...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-current" />
              <span>
                {selectedSeat
                  ? `Confirmer Siège #${selectedSeat.id < 10 ? `0${selectedSeat.id}` : selectedSeat.id} • 5 MAD`
                  : 'Sélectionnez un Siège'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
