import React, { useState } from 'react';
import { AppMode, TransitNode, DriverRide, BoardingPassData } from './types';
import { SpatialBackground } from './components/SpatialBackground';
import { SmartMap } from './components/SmartMap';
import { ModeEtudiant } from './components/ModeEtudiant';
import { ModeNavette } from './components/ModeNavette';
import { ModeConducteur } from './components/ModeConducteur';
import { DynamicIslandNav } from './components/DynamicIslandNav';
import { BoardingPassModal } from './components/BoardingPassModal';
import { FounderModal } from './components/FounderModal';
import { ExportModal } from './components/ExportModal';
import { soundManager } from './utils/audio';
import { Sparkles, Shield, Compass, FileCode, Bell, ChevronRight, Zap } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('etudiant');
  const [balance, setBalance] = useState<number>(25);
  const [selectedOriginId, setSelectedOriginId] = useState<string>('takadoum');
  const [activeBoardingPass, setActiveBoardingPass] = useState<BoardingPassData | null>(null);
  const [isFounderModalOpen, setIsFounderModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Béni Mellal Transit Nodes matching the real Google Maps geometry
  const [nodes, setNodes] = useState<TransitNode[]>([
    {
      id: 'takadoum',
      name: 'Takadoum (8JMP+2W3, Béni Mellal)',
      shortLabel: 'Takadoum',
      type: 'origin',
      x: 80.5,
      y: 33.5,
      availableDrivers: 6,
      averageEtaMinutes: 12,
      distanceKm: 9.4,
      description: 'Point de départ direct via Contournement de Béni Mellal (12 min · 9.4 km)',
    },
    {
      id: 'marjane-ctm',
      name: 'Marjane Market / CTM',
      shortLabel: 'Marjane / CTM',
      type: 'origin',
      x: 75.0,
      y: 20.0,
      availableDrivers: 4,
      averageEtaMinutes: 11,
      distanceKm: 8.8,
      description: 'Axe Nord-Est, carrefour commercial et agence CTM',
    },
    {
      id: 'carrefour-riad',
      name: 'Carrefour Label\'Vie / Riad Salam',
      shortLabel: 'Carrefour / Riad',
      type: 'origin',
      x: 69.0,
      y: 44.0,
      availableDrivers: 3,
      averageEtaMinutes: 10,
      distanceKm: 8.2,
      description: 'Jonction N8 Sud vers bretelle de contournement CMC',
    },
    {
      id: 'place-massira',
      name: 'Place Al Massira (Centre-Ville)',
      shortLabel: 'Pl. Massira',
      type: 'origin',
      x: 84.0,
      y: 40.0,
      availableDrivers: 5,
      averageEtaMinutes: 13,
      distanceKm: 9.6,
      description: 'Hub central devant la grande fontaine, liaison directe',
    },
    {
      id: 'cmc-mghila',
      name: 'CMC : Cité des Métiers et des Compétences',
      shortLabel: 'CMC Mghila',
      type: 'destination',
      x: 42.5,
      y: 59.5,
      availableDrivers: 0,
      averageEtaMinutes: 0,
      distanceKm: 0,
      description: 'Campus d\'Excellence des Métiers et des Compétences',
    },
  ]);

  // Verified Driver Rides heading to CMC
  const [rides, setRides] = useState<DriverRide[]>([
    {
      id: 'ride-1',
      driverName: 'Amine Benchekroun',
      driverRole: 'Stagiaire Dévelop. Digital CMC',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      carModel: 'Dacia Sandero Stepway',
      carColor: 'Gris Comète',
      rating: 4.95,
      totalTrips: 84,
      originId: 'takadoum',
      originName: 'Takadoum',
      destinationName: 'CMC : Cité des Métiers et des Compétences',
      departureTime: '08:15',
      seatsTotal: 4,
      seatsAvailable: 2,
      priceMad: 5,
      verifiedStudent: true,
    },
    {
      id: 'ride-2',
      driverName: 'Dr. Imane Laroussi',
      driverRole: 'Formatrice Industrie 4.0 CMC',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      carModel: 'Peugeot 208 Tech',
      carColor: 'Blanc Nacré',
      rating: 5.0,
      totalTrips: 112,
      originId: 'takadoum',
      originName: 'Takadoum',
      destinationName: 'CMC : Cité des Métiers et des Compétences',
      departureTime: '08:25',
      seatsTotal: 4,
      seatsAvailable: 3,
      priceMad: 5,
      verifiedStudent: true,
    },
    {
      id: 'ride-3',
      driverName: 'Othmane Radi',
      driverRole: 'Stagiaire Électromécanique',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      carModel: 'Renault Clio 4',
      carColor: 'Bleu Cosmos',
      rating: 4.88,
      totalTrips: 45,
      originId: 'carrefour-riad',
      originName: 'Carrefour Label\'Vie',
      destinationName: 'CMC : Cité des Métiers et des Compétences',
      departureTime: '08:10',
      seatsTotal: 4,
      seatsAvailable: 1,
      priceMad: 5,
      verifiedStudent: true,
    },
    {
      id: 'ride-4',
      driverName: 'Sanaa Mounir',
      driverRole: 'Stagiaire Gestion Entreprise CMC',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      carModel: 'Volkswagen Golf 7',
      carColor: 'Noir Intense',
      rating: 4.92,
      totalTrips: 63,
      originId: 'marjane-ctm',
      originName: 'Marjane Market',
      destinationName: 'CMC : Cité des Métiers et des Compétences',
      departureTime: '08:30',
      seatsTotal: 4,
      seatsAvailable: 3,
      priceMad: 5,
      verifiedStudent: true,
    },
  ]);

  const handleTopUp = (amount: number) => {
    setBalance((prev) => prev + amount);
    showToast(`+${amount} MAD ajoutés à votre portefeuille CMC`);
  };

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  };

  const handleBookStudentRide = (ride: DriverRide) => {
    setBalance((prev) => Math.max(0, prev - ride.priceMad));

    // Generate simulated QR Matrix
    const matrix: boolean[][] = Array(21)
      .fill(false)
      .map(() => Array(21).fill(false).map(() => Math.random() > 0.45));

    setActiveBoardingPass({
      ticketId: `CMC-${Math.floor(1000 + Math.random() * 9000)}`,
      passengerName: 'Stagiaire CMC (Vous)',
      serviceType: 'Covoiturage Étudiant',
      origin: ride.originName,
      destination: 'CMC : Cité des Métiers et des Compétences',
      departureTime: ride.departureTime,
      seatInfo: 'Place Avant Droit',
      driverOrVehicle: `${ride.driverName} (${ride.carModel})`,
      priceMad: ride.priceMad,
      qrMatrix: matrix,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleBookNavetteSeat = (seatNumber: number, seatLabel: string) => {
    const originNode = nodes.find((n) => n.id === selectedOriginId) || nodes[0];
    setBalance((prev) => Math.max(0, prev - 5));

    const matrix: boolean[][] = Array(21)
      .fill(false)
      .map(() => Array(21).fill(false).map(() => Math.random() > 0.45));

    setActiveBoardingPass({
      ticketId: `NAV-${Math.floor(2000 + Math.random() * 8000)}`,
      passengerName: 'Stagiaire CMC (Vous)',
      serviceType: 'Smart Navette CMC',
      origin: originNode.name,
      destination: 'CMC : Cité des Métiers et des Compétences',
      departureTime: 'Dans 4 minutes',
      seatInfo: `Siège #${seatNumber < 10 ? `0${seatNumber}` : seatNumber}`,
      driverOrVehicle: 'Navette Express CMC #03 (14-Seater)',
      priceMad: 5,
      qrMatrix: matrix,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handlePublishDriverRide = (newRideData: {
    originId: string;
    originName: string;
    seats: number;
    departureTime: string;
    priceMad: number;
  }) => {
    const newRide: DriverRide = {
      id: `ride-${Date.now()}`,
      driverName: 'Vous (Conducteur CMC)',
      driverRole: 'Stagiaire Certifié Conducteur',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      carModel: 'Votre Véhicule',
      carColor: 'Enregistré',
      rating: 5.0,
      totalTrips: 1,
      originId: newRideData.originId,
      originName: newRideData.originName,
      destinationName: 'CMC Mghila',
      departureTime: newRideData.departureTime,
      seatsTotal: newRideData.seats,
      seatsAvailable: newRideData.seats,
      priceMad: newRideData.priceMad,
      verifiedStudent: true,
    };

    setRides((prev) => [newRide, ...prev]);

    // Update node count
    setNodes((prev) =>
      prev.map((n) =>
        n.id === newRideData.originId ? { ...n, availableDrivers: n.availableDrivers + 1 } : n
      )
    );

    showToast(`Trajet publié ! ${newRideData.seats} places ouvertes au départ de ${newRideData.originName}`);
  };

  const selectedNode = nodes.find((n) => n.id === selectedOriginId) || nodes[0];

  return (
    <div className="min-h-screen text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 relative pb-36">
      {/* 1. Spatial Fluid Aurora Background (Cursor/Touch responsive) */}
      <SpatialBackground />

      {/* Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-950/90 text-emerald-200 border border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 text-xs font-mono animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* 2. Top Header Navigation */}
      <header className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-3">
        <div className="flex items-center justify-between">
          {/* Logo & Platform Brand: Wcmc */}
          <div className="flex items-center gap-2.5">
            <div className="relative group cursor-pointer" onClick={() => setIsFounderModalOpen(true)}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center font-black text-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-200/40">
                W
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-emerald-400/30 blur-sm group-hover:opacity-100 opacity-0 transition-opacity" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heading">
              W<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">cmc</span>
            </h1>
          </div>

          {/* Right: Clean Wallet Quick Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono shadow-sm">
            <span className="text-white/50">Solde:</span>
            <strong className="text-emerald-400 font-bold">{balance} MAD</strong>
          </div>
        </div>
      </header>

      {/* 3. Main Stage Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 mt-2">
        {/* 🗺️ Centerpiece 1: The Breathing Smart Map */}
        <section aria-label="Carte Interactive Béni Mellal vers CMC Mghila">
          <SmartMap
            nodes={nodes}
            selectedNodeId={selectedOriginId}
            onSelectNode={(nodeId) => {
              setSelectedOriginId(nodeId);
              const n = nodes.find((item) => item.id === nodeId);
              if (n) showToast(`Point de départ sélectionné: ${n.name}`);
            }}
          />
        </section>

        {/* 🚀 Centerpiece 2: The 3 Frictionless Experiences */}
        <section aria-label="Expérience de transit">
          {currentMode === 'etudiant' && (
            <ModeEtudiant
              balance={balance}
              onTopUp={handleTopUp}
              rides={rides}
              selectedOriginId={selectedOriginId}
              onBookRide={handleBookStudentRide}
            />
          )}

          {currentMode === 'navette' && (
            <ModeNavette
              balance={balance}
              onBookNavetteSeat={handleBookNavetteSeat}
              selectedOriginName={selectedNode.name}
            />
          )}

          {currentMode === 'conducteur' && (
            <ModeConducteur
              nodes={nodes}
              onPublishRide={handlePublishDriverRide}
            />
          )}
        </section>
      </main>

      {/* 4. Bottom Floating Dynamic Island Navigation */}
      <DynamicIslandNav
        currentMode={currentMode}
        onChangeMode={(mode) => setCurrentMode(mode)}
        isMuted={isMuted}
        onToggleMute={() => {
          const next = soundManager.toggleMute();
          setIsMuted(next);
        }}
        onOpenFounders={() => setIsFounderModalOpen(true)}
      />

      {/* 5. Modals */}
      <BoardingPassModal
        pass={activeBoardingPass}
        onClose={() => setActiveBoardingPass(null)}
      />

      <FounderModal
        isOpen={isFounderModalOpen}
        onClose={() => setIsFounderModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
