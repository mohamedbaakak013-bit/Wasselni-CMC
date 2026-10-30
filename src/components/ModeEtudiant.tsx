import React, { useState } from 'react';
import { DriverRide, BoardingPassData } from '../types';
import { soundManager } from '../utils/audio';
import { Wallet, Star, ShieldCheck, Car, Clock, PlusCircle, ArrowUpRight, Check, Sparkles } from 'lucide-react';

interface ModeEtudiantProps {
  balance: number;
  onTopUp: (amount: number) => void;
  rides: DriverRide[];
  selectedOriginId: string;
  onBookRide: (ride: DriverRide) => void;
}

export const ModeEtudiant: React.FC<ModeEtudiantProps> = ({
  balance,
  onTopUp,
  rides,
  selectedOriginId,
  onBookRide,
}) => {
  const [selectedRideId, setSelectedRideId] = useState<string>(rides[0]?.id || '');
  const [showTopUpOptions, setShowTopUpOptions] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Filter rides based on chosen starting node if applicable
  const filteredRides = rides.filter(
    (r) => !selectedOriginId || r.originId === selectedOriginId
  );

  const displayRides = filteredRides.length > 0 ? filteredRides : rides;
  const currentRide = displayRides.find((r) => r.id === selectedRideId) || displayRides[0];

  const handleSelectRide = (rideId: string) => {
    soundManager.playClick();
    setSelectedRideId(rideId);
  };

  const handleBook = () => {
    if (!currentRide) return;
    if (balance < currentRide.priceMad) {
      soundManager.playClick();
      setShowTopUpOptions(true);
      return;
    }

    setIsBooking(true);
    soundManager.playSuccess();
    setTimeout(() => {
      setIsBooking(false);
      onBookRide(currentRide);
    }, 450);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 1. Floating Digital Wallet Card (Apple Vision Pro Glass style) */}
      <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 hologram-card border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-52 h-52 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
              <Wallet className="w-3.5 h-3.5" />
              <span>Pass Étudiant CMC · Portefeuille Numérique</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black font-heading text-white tracking-tight drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                {balance}
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400">MAD</span>
              <span className="text-xs text-white/40 ml-2 font-mono">
                (~{Math.floor(balance / 5)} trajets Mghila)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-light">
              Tarif garanti subventionné CMC: <strong>5 MAD</strong> par trajet
            </p>
          </div>

          {/* Quick Top-Up Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {!showTopUpOptions ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowTopUpOptions(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Recharger Solde</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-emerald-500/40">
                <span className="text-[11px] font-mono text-slate-400 px-2">Ajouter:</span>
                {[15, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      soundManager.playSuccess();
                      onTopUp(amt);
                      setShowTopUpOptions(false);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 transition-all font-mono"
                  >
                    +{amt} MAD
                  </button>
                ))}
                <button
                  onClick={() => setShowTopUpOptions(false)}
                  className="px-2 text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Micro-bar footer with security indicator */}
        <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ID Stagiaire Actif #CMC-2026-9812</span>
          </div>
          <span>Crypté via OFPPT Passway</span>
        </div>
      </div>

      {/* 2. Driver Feed: Verified Drivers Heading to CMC Mghila */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white tracking-tight font-heading">
              Conducteurs Vérifiés vers CMC
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-mono">
              {displayRides.length} Disponibles
            </span>
          </div>
          <span className="text-xs text-white/40 font-mono hidden sm:inline">
            Cliquez pour sélectionner
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {displayRides.map((ride) => {
            const isSelected = ride.id === (currentRide?.id || '');
            return (
              <button
                key={ride.id}
                onClick={() => handleSelectRide(ride.id)}
                type="button"
                className={`text-left p-4 rounded-2xl transition-all duration-200 relative group overflow-hidden ${
                  isSelected
                    ? 'glass-panel-elevated ring-2 ring-emerald-400/90 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                    : 'glass-panel hover:border-white/20'
                }`}
              >
                {/* Active indicator badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                )}

                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={ride.avatar}
                      alt={ride.driverName}
                      className="w-11 h-11 rounded-xl object-cover border border-white/15 group-hover:scale-105 transition-transform"
                    />
                    {ride.verifiedStudent && (
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full text-black">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white text-sm truncate font-heading">
                        {ride.driverName}
                      </h4>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-medium">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{ride.rating}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-400 font-medium truncate mt-0.5">
                      {ride.driverRole}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1 font-mono">
                      <Car className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="truncate">{ride.carModel}</span>
                      <span className="text-white/30">·</span>
                      <span className="text-white/60">{ride.carColor}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-white/50 font-mono mt-0.5 truncate">
                      <span className="text-cyan-300">{ride.originName}</span>
                      <span>➔</span>
                      <span className="text-emerald-400">CMC</span>
                    </div>
                  </div>
                </div>

                {/* Trajectory & Departure */}
                <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Départ: <strong>{ride.departureTime}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono font-medium border border-emerald-500/20">
                      {ride.seatsAvailable} {ride.seatsAvailable > 1 ? 'places' : 'place'}
                    </span>
                    <span className="font-bold text-white font-mono">
                      {ride.priceMad} MAD
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Massive Glowing Action Button: "Réserver • 5 MAD" */}
      <div className="pt-2">
        <button
          onClick={handleBook}
          disabled={isBooking || !currentRide}
          className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 text-black font-extrabold text-base md:text-lg tracking-wide uppercase shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:shadow-[0_0_50px_rgba(16,185,129,0.9)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 overflow-hidden group cursor-pointer"
        >
          {/* Shimmer light bar across button */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {isBooking ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Génération du Pass Holographique...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-black" />
              <span>
                Réserver avec {currentRide?.driverName.split(' ')[0] || 'Conducteur'} • {currentRide?.priceMad || 5} MAD
              </span>
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-white/40 mt-2 font-mono">
          Paiement instantané sécurisé par déduction de solde étudiant
        </p>
      </div>
    </div>
  );
};
