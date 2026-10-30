import React, { useEffect, useState } from 'react';
import { TransitNode } from '../types';
import { soundManager } from '../utils/audio';
import { Compass, Zap, MapPin, ShieldCheck, Activity, Eye, Layers, Navigation2, Check } from 'lucide-react';

interface SmartMapProps {
  nodes: TransitNode[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  selectedRouteType?: 'contournement' | 'n8_connector' | 'foum_oudi';
  onSelectRouteType?: (route: 'contournement' | 'n8_connector' | 'foum_oudi') => void;
}

interface SimulatedVehicle {
  id: string;
  type: 'covoiturage' | 'navette';
  progress: number; // 0 to 1
  routeType: 'contournement' | 'n8_connector';
  speed: number;
  label: string;
}

export const SmartMap: React.FC<SmartMapProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
}) => {
  const [mapViewMode, setMapViewMode] = useState<'cyber' | 'satellite'>('cyber');
  const [activeRoute, setActiveRoute] = useState<'contournement' | 'n8_connector' | 'foum_oudi'>('contournement');

  // Simulated live vehicles travelling specifically along the Béni Mellal ➔ CMC road
  const [vehicles, setVehicles] = useState<SimulatedVehicle[]>([
    { id: 'v1', type: 'covoiturage', progress: 0.12, routeType: 'contournement', speed: 0.0032, label: 'Dacia #44' },
    { id: 'v2', type: 'navette', progress: 0.48, routeType: 'contournement', speed: 0.0025, label: 'Navette Express 01' },
    { id: 'v3', type: 'covoiturage', progress: 0.82, routeType: 'contournement', speed: 0.0036, label: 'Clio #12' },
    { id: 'v4', type: 'navette', progress: 0.28, routeType: 'n8_connector', speed: 0.0028, label: 'Navette Express 02' },
    { id: 'v5', type: 'covoiturage', progress: 0.65, routeType: 'n8_connector', speed: 0.0034, label: 'Peugeot 208' },
  ]);

  // Destination node: CMC (Cité des Métiers et des Compétences)
  // Exact position on the real map: x=42.5%, y=59.5% (South-West)
  const destinationNode = nodes.find((n) => n.id === 'cmc-mghila') || {
    id: 'cmc-mghila',
    name: 'CMC : Cité des Métiers et des Compétences',
    shortLabel: 'CMC Mghila',
    type: 'destination' as const,
    x: 42.5,
    y: 59.5,
    availableDrivers: 0,
    averageEtaMinutes: 0,
    distanceKm: 9.4,
    description: 'Campus des Compétences Béni Mellal',
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Animation loop for realistic vehicle movement along trajectories
  useEffect(() => {
    let animId: number;
    const updateVehicles = () => {
      setVehicles((prev) =>
        prev.map((v) => {
          let nextProg = v.progress + v.speed;
          if (nextProg > 1) {
            nextProg = 0;
          }
          return { ...v, progress: nextProg };
        })
      );
      animId = requestAnimationFrame(updateVehicles);
    };
    animId = requestAnimationFrame(updateVehicles);
    return () => cancelAnimationFrame(animId);
  }, []);

  // EXACT Real GPS waypoints interpolated from the user's Google Maps screen:
  // Route 1: Contournement de Béni Mellal (Fastest, 12 min, 9.4 km)
  // Waypoints:
  // 1. Takadoum (80.5, 33.5)
  // 2. Sortie Takadoum P3222 (74.5, 28.5)
  // 3. Sommet virage Contournement (67.5, 25.5)
  // 4. Descente Contournement (60.5, 31.5)
  // 5. Traversée R312 (55.5, 48.0)
  // 6. Prolongement Mghila (49.0, 56.5)
  // 7. Embranchement Sud-Ouest (44.0, 63.5)
  // 8. CMC Entrance & Pin (42.5, 59.5)

  const contournementPoints = [
    { x: 80.5, y: 33.5 },
    { x: 74.5, y: 28.5 },
    { x: 67.5, y: 25.5 },
    { x: 60.5, y: 31.5 },
    { x: 55.5, y: 48.0 },
    { x: 49.0, y: 56.5 },
    { x: 44.0, y: 63.5 },
    { x: 42.5, y: 59.5 },
  ];

  // Route 2: via N8 & Connector (13 min, 9.6 km)
  // Waypoints:
  // 1. Takadoum (80.5, 33.5)
  // 2. N8 sud devant Carrefour Label'Vie (69.0, 44.0)
  // 3. Riad Salam axe N8 (65.5, 50.0)
  // 4. Bretelle vers Contournement (59.5, 60.5)
  // 5. Jonction R312 (55.5, 48.0)
  // 6. Vers CMC (42.5, 59.5)
  const n8Points = [
    { x: 80.5, y: 33.5 },
    { x: 69.0, y: 44.0 },
    { x: 65.5, y: 50.0 },
    { x: 59.5, y: 60.5 },
    { x: 55.5, y: 48.0 },
    { x: 44.0, y: 63.5 },
    { x: 42.5, y: 59.5 },
  ];

  // Calculate piecewise linear position along waypoints
  const getPointOnPath = (points: { x: number; y: number }[], t: number) => {
    const clampedT = Math.max(0, Math.min(1, t));
    const totalSegments = points.length - 1;
    const scaledT = clampedT * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledT), totalSegments - 1);
    const subT = scaledT - segmentIndex;

    const p1 = points[segmentIndex];
    const p2 = points[segmentIndex + 1];

    return {
      x: p1.x + (p2.x - p1.x) * subT,
      y: p1.y + (p2.y - p1.y) * subT,
    };
  };

  const getVehiclePosition = (progress: number, route: 'contournement' | 'n8_connector') => {
    const points = route === 'contournement' ? contournementPoints : n8Points;
    return getPointOnPath(points, progress);
  };

  const handleNodeClick = (nodeId: string) => {
    soundManager.playClick();
    onSelectNode(nodeId);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel-elevated border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] p-3 md:p-5">
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-emerald-400 tracking-wider font-semibold">
            BÉNI MELLAL ➔ CMC
          </span>
          <span className="text-white/30">|</span>
          <span className="text-white/80 font-mono">
            {activeRoute === 'contournement'
              ? 'via Contournement de Béni Mellal (9.4 km · 12 min)'
              : activeRoute === 'n8_connector'
              ? 'via N8 et Contournement (9.6 km · 13 min)'
              : 'via N8 & Foum Oudi (9.8 km · 14 min)'}
          </span>
        </div>

        {/* View Mode Toggle & Telemetry */}
        <div className="flex items-center gap-2">
          {/* Map Layer Switcher: Cyber vs Satellite */}
          <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/15">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setMapViewMode('cyber');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                mapViewMode === 'cyber'
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Cyber</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setMapViewMode('satellite');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                mapViewMode === 'satellite'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Carte Réelle</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-xl border border-white/10 text-cyan-300 font-mono text-[11px]">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>14 Véhicules</span>
          </div>
        </div>
      </div>

      {/* Vector Dark Mode Map Canvas */}
      <div className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] rounded-2xl bg-[#07090e] overflow-hidden border border-white/[0.08] select-none">
        {/* If Satellite View is active: render the real Google Maps satellite/road screenshot as backdrop */}
        {mapViewMode === 'satellite' && (
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/aistudio/image_e13e8771.png"
              alt="Carte Réelle Béni Mellal CMC"
              className="w-full h-full object-cover opacity-85 filter contrast-125 brightness-90"
            />
            {/* Dark tint overlay for spatial readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
          </div>
        )}

        {/* Map Vector Overlay SVG with the EXACT road curves from the user's screen */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="realContournementGlow" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="n8Glow" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.75" />
            </linearGradient>

            <filter id="neonGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* In Cyber mode: render grid lines and secondary streets matching the geography */}
          {mapViewMode === 'cyber' && (
            <>
              {/* Secondary city streets around Takadoum & Béni Mellal East */}
              <path
                d="M 70,15 L 90,40 M 75,10 L 95,35 M 65,30 L 85,55 M 78,45 L 96,25"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
                strokeDasharray="1, 2"
              />

              {/* R312 Crossing Highway going Northwest to Southeast */}
              <path
                d="M 40,8 L 65,65"
                fill="none"
                stroke="rgba(6, 182, 212, 0.22)"
                strokeWidth="0.9"
                strokeDasharray="3, 2"
              />

              {/* Regional P3222 continuation */}
              <path
                d="M 32,32 L 67.5,25.5"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="0.7"
              />
            </>
          )}

          {/* 1. N8 Highway Corridor (running from Top-Right 88,17 down southwest to 48,77) */}
          <path
            d="M 88,17 L 80.5,33.5 L 69.0,44.0 L 65.5,50.0 L 59.5,60.5 L 48.5,77.0"
            fill="none"
            stroke={mapViewMode === 'cyber' ? 'rgba(59, 130, 246, 0.35)' : 'rgba(30, 64, 175, 0.5)'}
            strokeWidth={mapViewMode === 'cyber' ? '1.2' : '2'}
            strokeDasharray="3, 1.5"
          />

          {/* 2. Route Alternative 3 via Foum Oudi (48.5, 77.0 ➔ CMC) */}
          <path
            d="M 48.5,77.0 L 44.0,63.5 L 42.5,59.5"
            fill="none"
            stroke={activeRoute === 'foum_oudi' ? 'url(#realContournementGlow)' : 'rgba(255,255,255,0.2)'}
            strokeWidth={activeRoute === 'foum_oudi' ? '2.0' : '1.1'}
            filter={activeRoute === 'foum_oudi' ? 'url(#neonGlowEffect)' : undefined}
          />

          {/* 3. Route Alternative 2: via N8 & Connector (13 min · 9.6 km) */}
          <path
            d="M 80.5,33.5 L 69.0,44.0 L 65.5,50.0 L 59.5,60.5 L 55.5,48.0 L 49.0,56.5 L 44.0,63.5 L 42.5,59.5"
            fill="none"
            stroke={activeRoute === 'n8_connector' ? 'url(#realContournementGlow)' : 'url(#n8Glow)'}
            strokeWidth={activeRoute === 'n8_connector' ? '2.4' : '1.5'}
            filter={activeRoute === 'n8_connector' ? 'url(#neonGlowEffect)' : undefined}
            strokeDasharray={activeRoute === 'n8_connector' ? 'none' : '4, 2'}
          />

          {/* 4. PRIMARY FASTEST ROUTE: via Contournement de Béni Mellal (12 min · 9.4 km) */}
          {/* Exactly matching the bold purple/blue road on the user's screen */}
          <path
            d="M 80.5,33.5 L 74.5,28.5 L 67.5,25.5 L 60.5,31.5 L 55.5,48.0 L 49.0,56.5 L 44.0,63.5 L 42.5,59.5"
            fill="none"
            stroke={activeRoute === 'contournement' ? 'url(#realContournementGlow)' : 'rgba(16, 185, 129, 0.4)'}
            strokeWidth={activeRoute === 'contournement' ? '3.0' : '1.8'}
            filter={activeRoute === 'contournement' ? 'url(#neonGlowEffect)' : undefined}
          />
        </svg>

        {/* Real-time Moving Vehicles on the Real Road Path */}
        {vehicles.map((v) => {
          const pos = getVehiclePosition(v.progress, v.routeType);
          const isNavette = v.type === 'navette';
          return (
            <div
              key={v.id}
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75 z-20"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
            >
              <div className="relative group">
                {/* Glowing vehicle beacon */}
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shadow-lg ${
                    isNavette
                      ? 'bg-cyan-400 shadow-[0_0_14px_#06b6d4]'
                      : 'bg-emerald-400 shadow-[0_0_14px_#10b981]'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div
                  className={`absolute -inset-1 rounded-full animate-ping opacity-60 ${
                    isNavette ? 'bg-cyan-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {/* Real Map Origin Nodes (Takadoum, Marjane, Carrefour Label'Vie / Riad Salam) */}
        {nodes
          .filter((n) => n.type === 'origin')
          .map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                type="button"
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group focus:outline-none"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                aria-label={`Choisir le départ ${node.name}`}
              >
                <div className="relative flex flex-col items-center">
                  {/* Pulse ring when selected */}
                  <div
                    className={`absolute -inset-3 rounded-full transition-all duration-300 ${
                      isSelected
                        ? 'bg-cyan-500/30 ring-2 ring-cyan-400 animate-pulse'
                        : 'group-hover:bg-white/10'
                    }`}
                  />

                  {/* Marker Pin */}
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-lg ${
                      isSelected
                        ? 'bg-cyan-400 text-black font-bold shadow-[0_0_18px_rgba(6,182,212,0.9)]'
                        : 'bg-[#10141f] text-cyan-300 border border-cyan-500/50 group-hover:border-cyan-400'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>

                  {/* Name Badge */}
                  <div
                    className={`mt-1 px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-mono font-medium whitespace-nowrap transition-all shadow-md ${
                      isSelected
                        ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-400/80 font-bold'
                        : 'bg-black/85 text-white/90 border border-white/15 group-hover:text-white'
                    }`}
                  >
                    {node.shortLabel}
                    <span className="ml-1 text-[9px] text-emerald-400">
                      ({node.distanceKm} km)
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

        {/* Real Landmarks from User Screenshot */}
        {/* Marjane Market */}
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] font-mono text-cyan-300"
          style={{ left: '75%', top: '20%' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Marjane Market / CTM</span>
        </div>

        {/* Carrefour Label'Vie / Riad Salam */}
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] font-mono text-cyan-300"
          style={{ left: '69%', top: '44%' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Carrefour Label'Vie</span>
        </div>

        {/* P3222 Contournement Badge on the Bend */}
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-400/40 text-[9px] font-mono text-blue-200"
          style={{ left: '67.5%', top: '25.5%' }}
        >
          <span>P3222 · Contournement</span>
        </div>

        {/* ETA Bubble on the Road (like Google Maps "12 min / 9.4 km") */}
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveRoute('contournement');
          }}
          type="button"
          className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-black/90 hover:bg-black border border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-1.5 text-xs font-mono text-white cursor-pointer"
          style={{ left: '60%', top: '27%' }}
        >
          <Navigation2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <div>
            <div className="font-bold text-emerald-300 text-[11px] leading-tight">12 min</div>
            <div className="text-[9px] text-white/60">9.4 km</div>
          </div>
        </button>

        {/* Alternative Route 2 Bubble ("13 min / 9.6 km") */}
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveRoute('n8_connector');
          }}
          type="button"
          className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-black/80 hover:bg-black border border-white/20 text-[10px] font-mono text-white/80 cursor-pointer hidden sm:flex items-center gap-1"
          style={{ left: '57%', top: '58%' }}
        >
          <span className="text-cyan-400 font-bold">13 min</span>
          <span className="text-white/40">9.6 km</span>
        </button>

        {/* DESTINATION NODE: CMC (Cité des Métiers et des Compétences) */}
        {/* Exactly at (42.5%, 59.5%) matching the red Google Maps pin on user's screen */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto"
          style={{
            left: `${destinationNode.x}%`,
            top: `${destinationNode.y}%`,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Radar Pulse Rings */}
            <div className="absolute -inset-6 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
            <div className="absolute -inset-3 rounded-full bg-emerald-400/25 animate-pulse pointer-events-none" />

            {/* Glowing Red/Emerald Destination Core Pin */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-emerald-600 to-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.9)] border-2 border-white/80">
              <ShieldCheck className="w-6 h-6 text-white stroke-[2.5]" />
            </div>

            {/* Tag matching Google Maps pin label */}
            <div className="mt-1.5 px-3 py-1 rounded-xl bg-black/90 border border-emerald-400 text-emerald-300 text-[11px] font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-1.5 whitespace-nowrap font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CMC : Cité des Métiers et des Compétences</span>
            </div>
          </div>
        </div>

        {/* Real Google Maps style Route Selector pill at bottom-left */}
        <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 text-xs flex flex-wrap items-center gap-3 z-30 shadow-xl max-w-[90%] sm:max-w-none">
          <div>
            <div className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider flex items-center gap-1">
              <span>Itinéraire Actif</span>
              <span className="text-white/30">·</span>
              <span>{selectedNode.name}</span>
            </div>
            <div className="text-white font-semibold text-xs flex items-center gap-1.5 mt-0.5">
              <span>Contournement de Béni Mellal</span>
              <span className="text-white/40">➔</span>
              <span className="text-emerald-400 font-bold">CMC</span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/15 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/40">
              12 min · 9.4 km
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] font-bold">
              5 MAD
            </span>
          </div>
        </div>

        {/* Compass & Coordinates (Top Right) */}
        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 text-[10px] text-white/80 z-20 font-mono">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>32°20′N · 6°21′W</span>
        </div>
      </div>
    </div>
  );
};
