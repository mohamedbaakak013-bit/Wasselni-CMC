import React, { useEffect, useState } from 'react';
import { Navigation, Clock, Layers, Plus, Minus, RotateCcw, MapPin, Compass } from 'lucide-react';

interface UberMapProps {
  originName?: string;
  destinationName?: string;
  className?: string;
  onSelectOrigin?: (origin: string) => void;
}

interface SimulatedVehicle {
  id: string;
  progress: number;
  speed: number;
  model: string;
}

export const UberMap: React.FC<UberMapProps> = ({
  originName = 'Takadoum',
  destinationName = 'CMC Mghila',
  className = '',
  onSelectOrigin,
}) => {
  const [mapStyle, setMapStyle] = useState<'minimal' | 'satellite'>('minimal');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Multi-vehicle traffic along the real Contournement corridor
  const [vehicles, setVehicles] = useState<SimulatedVehicle[]>([
    { id: 'v1', progress: 0.15, speed: 0.0022, model: 'Dacia Sandero' },
    { id: 'v2', progress: 0.52, speed: 0.0018, model: 'Grand Taxi #03' },
    { id: 'v3', progress: 0.84, speed: 0.0026, model: 'Peugeot 208' },
    { id: 'v4', progress: 0.38, speed: 0.0020, model: 'Clio 4' },
  ]);

  // Real GPS waypoints along Contournement de Béni Mellal ➔ CMC
  const waypoints = [
    { x: 81.5, y: 32.5 }, // Takadoum
    { x: 74.0, y: 27.0 }, // Sortie P3222
    { x: 67.0, y: 24.5 }, // Sommet Contournement
    { x: 59.5, y: 32.0 }, // Descente
    { x: 54.5, y: 47.0 }, // Traversée R312
    { x: 48.0, y: 55.5 }, // Prolongement
    { x: 43.5, y: 62.5 }, // Virage Sud
    { x: 42.0, y: 58.5 }, // CMC Entrance
  ];

  // Secondary road stops
  const stops = [
    { id: 'takadoum', name: 'Takadoum (8JMP+2W3)', shortLabel: 'Takadoum', x: 81.5, y: 32.5, km: 9.4 },
    { id: 'marjane', name: 'Marjane Market / CTM', shortLabel: 'Marjane', x: 75.0, y: 20.0, km: 8.8 },
    { id: 'carrefour', name: 'Carrefour Label\'Vie', shortLabel: 'Carrefour', x: 69.0, y: 44.0, km: 8.2 },
    { id: 'massira', name: 'Place Al Massira', shortLabel: 'Pl. Massira', x: 84.0, y: 40.0, km: 9.6 },
  ];

  useEffect(() => {
    let anim: number;
    const animateVehicles = () => {
      setVehicles((prev) =>
        prev.map((v) => {
          let next = v.progress + v.speed;
          if (next >= 1) next = 0;
          return { ...v, progress: next };
        })
      );
      anim = requestAnimationFrame(animateVehicles);
    };
    anim = requestAnimationFrame(animateVehicles);
    return () => cancelAnimationFrame(anim);
  }, []);

  const getCarPos = (t: number) => {
    const totalSegments = waypoints.length - 1;
    const scaledT = Math.max(0, Math.min(1, t)) * totalSegments;
    const idx = Math.min(Math.floor(scaledT), totalSegments - 1);
    const subT = scaledT - idx;
    const p1 = waypoints[idx];
    const p2 = waypoints[idx + 1];
    return {
      x: p1.x + (p2.x - p1.x) * subT,
      y: p1.y + (p2.y - p1.y) * subT,
    };
  };

  return (
    <div
      className={`relative w-full h-full min-h-[320px] md:min-h-full flex-1 bg-[#EAECEF] overflow-hidden select-none ${className}`}
      style={{
        transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined,
        transformOrigin: 'center center',
        transition: 'transform 0.25s ease-out',
      }}
    >
      {/* Satellite Underlay if toggled */}
      {mapStyle === 'satellite' && (
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/aistudio/image_e13e8771.png"
            alt="Google Maps Béni Mellal"
            className="w-full h-full object-cover filter contrast-105 brightness-95"
          />
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
        </div>
      )}

      {/* Light Grayscale Muted Vector Map */}
      <svg
        className="absolute inset-0 w-full h-full z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {mapStyle === 'minimal' && (
          <>
            {/* Base Background */}
            <rect x="0" y="0" width="100" height="100" fill="#EAECEF" />

            {/* Subtle Agricultural / Open parcels */}
            <polygon points="10,10 40,5 35,40 12,35" fill="#E4E7EB" />
            <polygon points="65,5 95,8 90,30 60,25" fill="#E4E7EB" />
            <polygon points="15,60 40,55 35,85 10,80" fill="#E4E7EB" />
            <polygon points="50,65 85,60 80,95 45,90" fill="#E4E7EB" />

            {/* Grayscale Street Grid (Béni Mellal Urban Canvas) */}
            <g stroke="#D1D5DB" strokeWidth="0.75" strokeLinecap="round">
              <line x1="70" y1="10" x2="95" y2="45" />
              <line x1="60" y1="20" x2="88" y2="60" />
              <line x1="75" y1="40" x2="98" y2="25" />
              <line x1="55" y1="65" x2="85" y2="50" />
              <line x1="20" y1="25" x2="45" y2="80" />
              <line x1="10" y1="50" x2="50" y2="40" />
              <line x1="30" y1="15" x2="65" y2="25" />
              <line x1="40" y1="75" x2="70" y2="85" />
            </g>

            {/* Regional Arterial R312 (crossing northwest to southeast) */}
            <line
              x1="38"
              y1="8"
              x2="65"
              y2="68"
              stroke="#9CA3AF"
              strokeWidth="1.6"
              strokeDasharray="2, 1"
            />

            {/* N8 Highway (Running from Takadoum southwards past Riad Salam) */}
            <path
              d="M 88,18 L 81.5,32.5 L 69.0,44.0 L 65.5,50.0 L 59.5,60.5 L 48.5,77.0"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="1.8"
            />
          </>
        )}

        {/* Alternative Route connector (via N8) */}
        <path
          d="M 81.5,32.5 L 69.0,44.0 L 65.5,50.0 L 59.5,60.5 L 54.5,47.0 L 48.0,55.5 L 43.5,62.5 L 42.0,58.5"
          fill="none"
          stroke={mapStyle === 'minimal' ? '#CBD5E1' : 'rgba(59, 130, 246, 0.4)'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3, 1.5"
        />

        {/* PRIMARY ACTIVE UBER ROUTE: Bold Deep Black Solid Line */}
        <path
          d="M 81.5,32.5 L 74.0,27.0 L 67.0,24.5 L 59.5,32.0 L 54.5,47.0 L 48.0,55.5 L 43.5,62.5 L 42.0,58.5"
          fill="none"
          stroke="#000000"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Moving Live Traffic Vehicles */}
      {vehicles.map((v, i) => {
        const pos = getCarPos(v.progress);
        const isLead = i === 0;
        return (
          <div
            key={v.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100 z-10"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div
              className={`rounded-full flex items-center justify-center shadow-md ${
                isLead
                  ? 'w-6 h-6 bg-black text-white ring-2 ring-white'
                  : 'w-5 h-5 bg-gray-800 text-white'
              }`}
            >
              <Navigation className="w-3 h-3 fill-white rotate-45" />
            </div>
          </div>
        );
      })}

      {/* Origin Stop Nodes */}
      {stops.map((stop) => {
        const isSelected = stop.shortLabel === originName || stop.name.includes(originName);
        return (
          <button
            key={stop.id}
            type="button"
            onClick={() => onSelectOrigin?.(stop.shortLabel)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center cursor-pointer group focus:outline-none"
            style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
            title={stop.name}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform group-hover:scale-125 ${
                isSelected ? 'bg-black scale-110' : 'bg-gray-700'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span
              className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold shadow-xs whitespace-nowrap border transition-all ${
                isSelected
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-gray-800 border-gray-200 group-hover:border-black'
              }`}
            >
              {stop.shortLabel}
            </span>
          </button>
        );
      })}

      {/* Destination Pin: CMC Mghila (Uber Square Pin) */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
        style={{ left: '42.0%', top: '58.5%' }}
      >
        <div className="w-5 h-5 rounded-sm bg-black border-2 border-white shadow-lg flex items-center justify-center ring-4 ring-black/10">
          <div className="w-2 h-2 rounded-sm bg-white" />
        </div>
        <div className="mt-1 px-2.5 py-1 rounded bg-black text-white font-extrabold text-[10px] shadow-md whitespace-nowrap flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>CMC Mghila</span>
        </div>
      </div>

      {/* Minimalist Floating Duration Bubble */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-gray-200/80 flex items-center gap-1.5 sm:gap-2 text-xs text-black font-semibold z-10">
        <Clock className="w-3.5 h-3.5 text-black" />
        <span>12 min · 9.4 km</span>
        <span className="text-gray-300 hidden sm:inline">|</span>
        <span className="text-gray-500 font-medium hidden sm:inline">Contournement P3222</span>
      </div>

      {/* Desktop / Responsive Map Floating Controls (Top Right) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2">
        {/* Style Switcher: Minimalist Vector ⇄ Satellite Overlay */}
        <button
          type="button"
          onClick={() => setMapStyle((prev) => (prev === 'minimal' ? 'satellite' : 'minimal'))}
          className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-gray-200 text-xs font-semibold text-black hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {mapStyle === 'minimal' ? 'Satellite' : 'Minimal'}
          </span>
        </button>

        {/* Zoom Controls */}
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-md border border-gray-200 flex items-center p-0.5">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-black cursor-pointer"
            title="Zoom avant"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-black cursor-pointer"
            title="Zoom arrière"
          >
            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-black cursor-pointer"
            title="Réinitialiser zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
