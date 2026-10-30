import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Fuel, TrendingUp, Users, Clock, Send, ShieldCheck, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { TransitNode } from '../types';

interface ModeConducteurProps {
  nodes: TransitNode[];
  onPublishRide: (newRide: {
    originId: string;
    originName: string;
    seats: number;
    departureTime: string;
    priceMad: number;
  }) => void;
}

export const ModeConducteur: React.FC<ModeConducteurProps> = ({ nodes, onPublishRide }) => {
  const [seats, setSeats] = useState(3);
  const [departureTime, setDepartureTime] = useState('08:00');
  const [selectedOriginId, setSelectedOriginId] = useState('takadoum');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Financial calculations
  const pricePerSeat = 5; // MAD
  const grossTotal = seats * pricePerSeat;
  const driverCutPercentage = 0.90; // 90% driver cut
  const driverEarnings = grossTotal * driverCutPercentage;
  const platformFee = grossTotal * 0.10; // 10% commission

  // Fuel amortization calculation (approx 7.8 km round trip Béni Mellal ➔ CMC Mghila = ~15 km @ 7L/100km ≈ 15-18 MAD diesel)
  const estimatedFuelCost = 16; // MAD per round trip
  const fuelCoveragePercent = Math.min(100, Math.round((driverEarnings / estimatedFuelCost) * 100));

  // Circular gauge SVG parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fuelCoveragePercent / 100) * circumference;

  const handlePublish = () => {
    setIsPublishing(true);
    soundManager.playSuccess();

    const origin = nodes.find((n) => n.id === selectedOriginId) || nodes[0];

    setTimeout(() => {
      setIsPublishing(false);
      setPublishedSuccess(true);
      onPublishRide({
        originId: origin.id,
        originName: origin.name,
        seats,
        departureTime,
        priceMad: pricePerSeat,
      });

      setTimeout(() => {
        setPublishedSuccess(false);
      }, 3500);
    }, 450);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Promise Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Fuel className="w-3.5 h-3.5" />
            <span>Monétisation Responsable · Trajet CMC</span>
          </div>
          <h3 className="text-lg font-bold text-white font-heading mt-0.5">
            Amortissez votre carburant instantanément
          </h3>
          <p className="text-xs text-slate-300">
            90% des revenus vous reviennent directement. Zéro détour: vous alliez déjà au campus.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-300 text-xs font-mono self-start sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>90% Pour Vous · 10% CMC</span>
        </div>
      </div>

      {/* Futuristic Dashboard with Circular Data-Viz Ring */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Circular SVG Data-Viz Gauge */}
        <div className="md:col-span-5 hologram-card rounded-3xl p-6 flex flex-col items-center justify-center border border-emerald-500/30">
          <div className="text-[11px] font-mono text-white/50 uppercase tracking-widest mb-3">
            Couverture Carburant
          </div>

          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-white/10"
                strokeWidth="10"
                fill="none"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-emerald-400 transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))',
                }}
              />
            </svg>

            {/* Center Data Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white font-heading tracking-tight">
                {fuelCoveragePercent}%
              </span>
              <span className="text-[11px] font-mono text-emerald-300 font-semibold">
                Amorti
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-2xl font-bold font-mono text-white">
              +{driverEarnings.toFixed(1)} <span className="text-emerald-400 text-base">MAD</span>
            </div>
            <div className="text-xs text-white/50 font-mono mt-0.5">
              Net conducteur par trajet simple
            </div>
          </div>
        </div>

        {/* Right: Trajectory & Seat Configuration */}
        <div className="md:col-span-7 glass-panel-elevated rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          {/* Seat Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <label htmlFor="seats-slider" className="font-heading font-semibold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Places libres dans votre voiture</span>
              </label>
              <span className="text-base font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                {seats} {seats > 1 ? 'places' : 'place'}
              </span>
            </div>

            <input
              id="seats-slider"
              type="range"
              min="1"
              max="4"
              value={seats}
              onChange={(e) => {
                soundManager.playClick();
                setSeats(Number(e.target.value));
              }}
              className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1 px-1">
              <span>1 place (5 MAD)</span>
              <span>2 places (10 MAD)</span>
              <span>3 places (15 MAD)</span>
              <span>4 places (20 MAD)</span>
            </div>
          </div>

          {/* Origin selector */}
          <div>
            <label className="text-xs font-heading font-semibold text-white flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Point de départ à Béni Mellal</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {nodes
                .filter((n) => n.type === 'origin')
                .slice(0, 3)
                .map((node) => {
                  const isSelected = node.id === selectedOriginId;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedOriginId(node.id);
                      }}
                      className={`p-2 rounded-xl text-left transition-all text-xs font-mono ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      <div className="truncate font-semibold">{node.shortLabel}</div>
                      <div className="text-[10px] text-white/40 truncate">Vers CMC</div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Departure Time Slots */}
          <div>
            <label className="text-xs font-heading font-semibold text-white flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Heure de départ prévue</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['07:45', '08:00', '08:15', '12:30', '13:45'].map((time) => {
                const isSelected = time === departureTime;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setDepartureTime(time);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-white/50">Gain Brut: </span>
              <span className="text-white font-bold">{grossTotal} MAD</span>
            </div>
            <div className="text-emerald-400 font-bold">
              Votre Gain: {driverEarnings.toFixed(1)} MAD (90%)
            </div>
            <div className="text-white/40 text-[10px]">
              Frais CMC: {platformFee.toFixed(1)} MAD (10%)
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Action: Publier le Trajet */}
      <div>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-black font-extrabold text-base md:text-lg tracking-wide uppercase shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:shadow-[0_0_50px_rgba(16,185,129,0.9)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 overflow-hidden cursor-pointer"
        >
          {isPublishing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Diffusion sur le réseau CMC en cours...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-current" />
              <span>Publier le Trajet • {seats} {seats > 1 ? 'Places' : 'Place'} ({driverEarnings.toFixed(1)} MAD Net)</span>
              <Send className="w-5 h-5" />
            </>
          )}
        </button>

        {publishedSuccess && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400/80 text-emerald-300 flex items-center justify-center gap-2 text-xs font-mono animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Trajet publié avec succès ! Visible instantanément en Mode Étudiant.</span>
          </div>
        )}
      </div>
    </div>
  );
};
