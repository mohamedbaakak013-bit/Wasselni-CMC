import React, { useEffect, useState } from 'react';
import { Navigation, Clock } from 'lucide-react';

interface UberMapProps {
  originName: string;
  destinationName: string;
}

export const UberMap: React.FC<UberMapProps> = ({ originName, destinationName }) => {
  const [carProgress, setCarProgress] = useState(0.35);

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

  useEffect(() => {
    let anim: number;
    const animateCar = () => {
      setCarProgress((prev) => (prev >= 1 ? 0 : prev + 0.0022));
      anim = requestAnimationFrame(animateCar);
    };
    anim = requestAnimationFrame(animateCar);
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

  const carPos = getCarPos(carProgress);

  return (
    <div className="relative w-full h-[320px] bg-[#EAECEF] overflow-hidden select-none border-b border-gray-200">
      {/* Light Grayscale Muted Vector Map */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Subtle City Blocks & Grayscale Topo */}
        <rect x="0" y="0" width="100" height="100" fill="#EAECEF" />

        {/* Agricultural / Open land parcels (Mghila plains) */}
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

        {/* N8 Highway (Running from Takadoum southwards) */}
        <path
          d="M 88,18 L 81.5,32.5 L 69.0,44.0 L 65.5,50.0 L 59.5,60.5 L 48.5,77.0"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="1.8"
        />

        {/* Alternative Route connector (via N8) */}
        <path
          d="M 81.5,32.5 L 69.0,44.0 L 65.5,50.0 L 59.5,60.5 L 54.5,47.0 L 48.0,55.5 L 43.5,62.5 L 42.0,58.5"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* PRIMARY ACTIVE UBER ROUTE: Bold Deep Black Solid Line */}
        <path
          d="M 81.5,32.5 L 74.0,27.0 L 67.0,24.5 L 59.5,32.0 L 54.5,47.0 L 48.0,55.5 L 43.5,62.5 L 42.0,58.5"
          fill="none"
          stroke="#000000"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Moving Car Marker (Uber Black Style) */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100 z-10"
        style={{ left: `${carPos.x}%`, top: `${carPos.y}%` }}
      >
        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-md">
          <Navigation className="w-3.5 h-3.5 fill-white rotate-45" />
        </div>
      </div>

      {/* Origin Pin: Takadoum (Uber Dot) */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
        style={{ left: '81.5%', top: '32.5%' }}
      >
        <div className="w-4 h-4 rounded-full bg-black border-2 border-white shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
        <span className="mt-1 px-1.5 py-0.5 rounded bg-white text-black font-semibold text-[9px] shadow-sm whitespace-nowrap border border-gray-200">
          Takadoum
        </span>
      </div>

      {/* Destination Pin: CMC Mghila (Uber Square Pin) */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
        style={{ left: '42.0%', top: '58.5%' }}
      >
        <div className="w-4 h-4 rounded-sm bg-black border-2 border-white shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-sm bg-white" />
        </div>
        <span className="mt-1 px-1.5 py-0.5 rounded bg-black text-white font-bold text-[9px] shadow-sm whitespace-nowrap">
          CMC Mghila
        </span>
      </div>

      {/* Minimalist Floating Duration Bubble */}
      <div className="absolute top-16 left-4 bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-1.5 text-xs text-black font-semibold z-10">
        <Clock className="w-3.5 h-3.5 text-black" />
        <span>12 min · 9.4 km</span>
      </div>
    </div>
  );
};
