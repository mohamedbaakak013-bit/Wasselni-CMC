import React, { useState } from 'react';
import { AppMode, DriverRide, BoardingPassData } from './types';
import { UberMap } from './components/UberMap';
import { StudentModule } from './components/StudentModule';
import { NavetteModule } from './components/NavetteModule';
import { DriverModule } from './components/DriverModule';
import { UberReceiptModal } from './components/UberReceiptModal';
import { Wallet, Plus, Check, MapPin, Activity, ShieldCheck, Compass } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('etudiant');
  const [balance, setBalance] = useState<number>(25);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('Takadoum');
  const [selectedRideId, setSelectedRideId] = useState<string>('ride-1');
  const [activePass, setActivePass] = useState<BoardingPassData | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);

  // Available drivers along the corridor
  const [rides, setRides] = useState<DriverRide[]>([
    {
      id: 'ride-1',
      driverName: 'Amine Benchekroun',
      driverRole: 'Stagiaire CMC',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      carModel: 'Dacia Sandero Stepway',
      carColor: 'Gris',
      rating: 4.9,
      totalTrips: 84,
      originId: 'takadoum',
      originName: 'Takadoum',
      destinationName: 'CMC Mghila',
      departureTime: '08:15',
      seatsTotal: 4,
      seatsAvailable: 2,
      priceMad: 5,
      verifiedStudent: true,
    },
    {
      id: 'ride-2',
      driverName: 'Dr. Imane Laroussi',
      driverRole: 'Formatrice CMC',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      carModel: 'Peugeot 208',
      carColor: 'Blanc',
      rating: 5.0,
      totalTrips: 112,
      originId: 'takadoum',
      originName: 'Takadoum',
      destinationName: 'CMC Mghila',
      departureTime: '08:25',
      seatsTotal: 4,
      seatsAvailable: 3,
      priceMad: 5,
      verifiedStudent: true,
    },
    {
      id: 'ride-3',
      driverName: 'Othmane Radi',
      driverRole: 'Stagiaire CMC',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      carModel: 'Renault Clio 4',
      carColor: 'Bleu',
      rating: 4.8,
      totalTrips: 45,
      originId: 'takadoum',
      originName: 'Takadoum',
      destinationName: 'CMC Mghila',
      departureTime: '08:30',
      seatsTotal: 4,
      seatsAvailable: 1,
      priceMad: 5,
      verifiedStudent: true,
    },
  ]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleConfirmStudent = () => {
    const ride = rides.find((r) => r.id === selectedRideId) || rides[0];
    if (balance < 5) {
      triggerToast('Solde insuffisant (Rechargez votre solde)');
      setShowRechargeModal(true);
      return;
    }

    setBalance((prev) => prev - 5);
    setActivePass({
      ticketId: `CMC-${Math.floor(1000 + Math.random() * 9000)}`,
      passengerName: 'Étudiant CMC',
      serviceType: 'Covoiturage Étudiant',
      origin: selectedOrigin,
      destination: 'CMC Mghila',
      departureTime: ride.departureTime,
      seatInfo: 'Place Avant Droit',
      driverOrVehicle: `${ride.driverName} (${ride.carModel})`,
      priceMad: 5,
      qrMatrix: [],
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    });
    triggerToast('Course confirmée • 5 MAD déduits');
  };

  const handleConfirmNavette = (seatId: number) => {
    if (balance < 5) {
      triggerToast('Solde insuffisant (Rechargez votre solde)');
      setShowRechargeModal(true);
      return;
    }

    setBalance((prev) => prev - 5);
    setActivePass({
      ticketId: `NAV-${Math.floor(2000 + Math.random() * 8000)}`,
      passengerName: 'Étudiant CMC',
      serviceType: 'Smart Navette CMC',
      origin: selectedOrigin,
      destination: 'CMC Mghila',
      departureTime: 'Dans 4 min',
      seatInfo: `Siège #0${seatId}`,
      driverOrVehicle: 'Grand Taxi Express #03',
      priceMad: 5,
      qrMatrix: [],
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    });
    triggerToast(`Siège #0${seatId} réservé • 5 MAD déduits`);
  };

  const handlePublishDriver = (seats: number, time: string) => {
    const newRide: DriverRide = {
      id: `ride-${Date.now()}`,
      driverName: 'Vous (Conducteur CMC)',
      driverRole: 'Stagiaire Conducteur',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      carModel: 'Votre Véhicule',
      carColor: 'Noir',
      rating: 5.0,
      totalTrips: 1,
      originId: 'takadoum',
      originName: selectedOrigin,
      destinationName: 'CMC Mghila',
      departureTime: time,
      seatsTotal: seats,
      seatsAvailable: seats,
      priceMad: 5,
      verifiedStudent: true,
    };

    setRides((prev) => [newRide, ...prev]);
    triggerToast(`Trajet publié avec ${seats} places disponibles`);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-black flex flex-col selection:bg-black selection:text-white">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-fade-in border border-white/10">
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Global Top App Bar: Responsive for both Desktop and Mobile */}
      <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Brand & Campus Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg shadow-sm">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-black">
                Wasselni CMC
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                Béni Mellal
              </span>
            </div>
            <p className="hidden md:block text-xs text-gray-500 font-medium">
              Plateforme de covoiturage & navettes · Campus CMC Mghila
            </p>
          </div>
        </div>

        {/* Center: Live Corridor Telemetry (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-3 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-1.5 text-black font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>14 Véhicules en Ligne</span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-gray-600 font-medium">
            Takadoum ➔ CMC (9.4 km · 12 min)
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-black font-bold">Tarif Fixe : 5 MAD</span>
        </div>

        {/* Right: Wallet Balance Pill & Quick Top-Up */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRechargeModal(true)}
            className="bg-white hover:bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full shadow-xs text-xs font-bold text-black flex items-center gap-2 transition-all cursor-pointer"
            title="Recharger le portefeuille étudiant"
          >
            <Wallet className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-500 font-medium">Solde:</span>
            <span className="text-black font-extrabold">{balance} MAD</span>
            <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px] ml-0.5">
              +
            </span>
          </button>
        </div>
      </header>

      {/* Main Webapp Layout: Split-Screen on Desktop, Stacked Sheet on Mobile */}
      <main className="flex-1 flex flex-col md:flex-row w-full h-[calc(100vh-61px)] min-h-[600px] overflow-hidden">
        {/* LEFT PANEL: Booking & Operations Console */}
        <section className="w-full md:w-[420px] lg:w-[460px] xl:w-[480px] bg-white border-r border-gray-200 flex-shrink-0 flex flex-col justify-between overflow-y-auto z-20 shadow-xs order-2 md:order-1 h-auto md:h-[calc(100vh-61px)]">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Segmented Control Role Switcher */}
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Mode de Transport
              </div>
              <div className="bg-[#F3F4F6] p-1 rounded-full flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentMode('etudiant')}
                  className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    currentMode === 'etudiant'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-black font-medium'
                  }`}
                >
                  Étudiant
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentMode('navette')}
                  className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    currentMode === 'navette'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-black font-medium'
                  }`}
                >
                  Navette
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentMode('conducteur')}
                  className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    currentMode === 'conducteur'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-black font-medium'
                  }`}
                >
                  Conducteur
                </button>
              </div>
            </div>

            {/* Dynamic View Switched by Mode */}
            {currentMode === 'etudiant' && (
              <StudentModule
                rides={rides}
                selectedRideId={selectedRideId}
                onSelectRide={(id) => setSelectedRideId(id)}
                onConfirm={handleConfirmStudent}
              />
            )}

            {currentMode === 'navette' && (
              <NavetteModule onConfirmSeat={handleConfirmNavette} />
            )}

            {currentMode === 'conducteur' && (
              <DriverModule onPublish={handlePublishDriver} />
            )}
          </div>

          {/* Ownership Branding: Subtle text label at bottom */}
          <div className="p-4 border-t border-gray-100 text-center bg-gray-50/50">
            <p className="text-[11px] font-medium text-gray-400">
              Architected by Baakak • CMC 2026
            </p>
          </div>
        </section>

        {/* RIGHT PANEL: Full-Bleed Interactive Webapp Map */}
        <section className="flex-1 relative w-full h-[320px] sm:h-[380px] md:h-[calc(100vh-61px)] self-stretch bg-[#EAECEF] overflow-hidden order-1 md:order-2 flex flex-col">
          <UberMap
            originName={selectedOrigin}
            destinationName="CMC Mghila"
            onSelectOrigin={(orig) => {
              setSelectedOrigin(orig);
              triggerToast(`Point de départ sélectionné : ${orig}`);
            }}
            className="w-full h-full flex-1"
          />
        </section>
      </main>

      {/* Confirmation Receipt Modal */}
      <UberReceiptModal
        pass={activePass}
        onClose={() => setActivePass(null)}
      />

      {/* Recharge Wallet Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl border border-gray-100 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-black">
                Recharger le Solde
              </h4>
              <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                Pass Étudiant
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Solde actuel : <strong className="text-black">{balance} MAD</strong>
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setBalance((prev) => prev + amt);
                    setShowRechargeModal(false);
                    triggerToast(`+${amt} MAD ajoutés au solde`);
                  }}
                  className="py-2.5 rounded-lg bg-[#F3F4F6] hover:bg-black hover:text-white text-xs font-bold text-black border border-gray-200 transition-colors cursor-pointer"
                >
                  +{amt} MAD
                </button>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 text-center">
              Paiement instantané sécurisé par pass CMC
            </p>

            <button
              onClick={() => setShowRechargeModal(false)}
              className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-black cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
